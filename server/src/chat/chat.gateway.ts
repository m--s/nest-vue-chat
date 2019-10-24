import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayDisconnect, ConnectedSocket, MessageBody,
} from '@nestjs/websockets';
import {Logger} from '@nestjs/common';
import {Socket, Server} from 'socket.io';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Message} from "./db/message.entity";
import SendMessageBody from "./dto/SendMessageBody";

@WebSocketGateway()
export class ChatGateway implements OnGatewayDisconnect {

    private logger: Logger = new Logger(this.constructor.name);

    rooms: any[] = [];
    hosts: Socket[] = [];

    @WebSocketServer()
    server: Server;

    constructor(@InjectRepository(Message) private readonly messageRepository: Repository<Message>) {}

    @SubscribeMessage('sendMessage')
    async sendMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: SendMessageBody): Promise<void> {
        this.logger.debug(`sendMessage: ${client.id} ${JSON.stringify(payload)}`);

        payload.fromId = client.id;

        const roomId = payload.to || client.id;
        this.server.to(roomId).emit('newMessage', payload);

        const message = new Message({...payload, roomId});
        await this.messageRepository.save(message);
    }

    @SubscribeMessage('getActiveRooms')
    getActiveRooms(@ConnectedSocket() client: Socket): void {
        this.logger.debug(`getActiveRooms: ${client.id}`);

        client.emit('activeRooms', this.rooms);
    }

    @SubscribeMessage('getMessages')
    async getMessages(@ConnectedSocket() client: Socket, @MessageBody() roomId: string): Promise<void> {
        this.logger.debug(`getMessages: ${client.id} ${roomId}`);

        const roomMessages = await this.messageRepository.find({
            where: [{ roomId }],
        });
        client.emit('messages', roomMessages);
    }

    @SubscribeMessage('userConnected')
    userConnected(@ConnectedSocket() client: Socket, @MessageBody() payload: any): void {
        this.logger.debug(`userConnected: ${client.id} ${JSON.stringify(payload)}`);

        const socketAlreadyConnected = this.hosts.map(host => host.id).includes(client.id)
            || this.rooms.map(room => room.id).includes(client.id);
        if (socketAlreadyConnected) {
            return;
        }

        if (payload.userType === 'client') {
            this.onNewClientConnected(client, payload);
        } else {
            this.hosts.push(client);
            for (const room of this.rooms) {
                client.join(room.id);
            }
        }
    }

    onNewClientConnected(client: Socket, payload: any) {
        const room = { id: client.id, name: payload.name };
        this.rooms.push(room);
        client.join(client.id);

        this.hosts.forEach(host => {
            host.join(client.id);
            host.emit('newRoom', room);
        });
    }

    handleDisconnect(client: Socket) {
        this.logger.debug(`Client disconnected: ${client.id}`);

        client.leave(client.id);

        this.hosts.forEach(host => {
            host.leave(client.id);
            host.emit('userDisconnected', client.id);
        });

        this.rooms = this.rooms.filter(room => room.id !== client.id);
        this.hosts = this.hosts.filter(host => host.id !== client.id);
    }
}