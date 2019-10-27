import {Test, TestingModule} from '@nestjs/testing';
import {ChatGateway} from "./chat.gateway";
import {getRepositoryToken} from "@nestjs/typeorm";
import {Message} from "./db/message.entity";
import {createConnection, getConnection, getRepository, Repository} from "typeorm";
import UserConnectedBody from "./dto/UserConnectedBody";
import SendMessageBody from "./dto/SendMessageBody";

describe('ChatGateway', () => {
    let gateway: ChatGateway;
    let messageRepository: Repository<Message>;

    let connection;

    let testModule: TestingModule;
    const testConnectionName = 'testConnectionName';


    beforeEach(async () => {
        testModule = await Test.createTestingModule({
            providers: [
                {
                    provide: 'ChateGateway',
                    useValue: gateway,
                },
                {
                    provide: getRepositoryToken(Message),
                    useClass: Repository,
                },
            ],
        }).compile();

        connection = await createConnection({
            type: "sqlite",
            database: ":memory:",
            dropSchema: true,
            entities: [Message],
            synchronize: true,
            logging: false,
            name: testConnectionName,
        });

        messageRepository = getRepository(Message, testConnectionName);
        gateway = new ChatGateway(messageRepository);
    });

    afterEach(async () => {
        await getConnection(testConnectionName).close();
    });

    it('has defined repository', () => {
        expect(messageRepository).toBeDefined();
    });

    it('handles client connection', async () => {
        expect(gateway.rooms.length).toBe(0);

        const mockedSocket = {
            id: '1234',
            join: jest.fn(),
        };

        let body: UserConnectedBody = {name: 'Marcin', userType: 'client'};

        gateway.userConnected(mockedSocket, body);
        expect(gateway.rooms.length).toEqual(1);
    });

    it('handles host connection', async () => {
        expect(gateway.hosts.length).toBe(0);

        const mockedSocket = {
            id: '1234',
            join: jest.fn(),
        };

        let body: UserConnectedBody = {name: 'Marcin', userType: 'host'};

        gateway.userConnected(mockedSocket, body);
        expect(gateway.hosts.length).toEqual(1);
    });

    it('registers same sockets only once ', async () => {
        expect(gateway.hosts.length).toBe(0);

        const mockedSocket = {
            id: '1234',
            join: jest.fn(),
        };

        let body: UserConnectedBody = {name: 'Marcin', userType: 'host'};

        gateway.userConnected(mockedSocket, body);
        expect(gateway.hosts.length).toEqual(1);

        gateway.userConnected(mockedSocket, body);
        expect(gateway.isSocketAlreadyConnected(mockedSocket)).toBe(true);
        expect(gateway.hosts.length).toEqual(1);
    });

    it('returns active rooms', async () => {
        let mockedSocket = {
            id: '1234',
            join: jest.fn(),
            emit: jest.fn(),
        };

        let body: UserConnectedBody = {name: 'Marcin', userType: 'client'};
        gateway.userConnected(mockedSocket, body);

        gateway.getActiveRooms(mockedSocket);
        expect(mockedSocket.emit).toBeCalledWith('activeRooms', gateway.rooms);
        expect(gateway.rooms).toEqual([{name: 'Marcin', id: '1234'}])
    });

    it('handles disconnection', async () => {
        const mockedClientSocket = {
            id: '1234',
            join: jest.fn(),
            emit: jest.fn(),
            leave: jest.fn(),
        };
        const mockedHostSocket = {...mockedClientSocket, id: '4567'};

        const clientBody: UserConnectedBody = {name: 'Marcin', userType: 'client'};
        gateway.userConnected(mockedClientSocket, clientBody);

        const hostBody: UserConnectedBody = {name: 'Marcin', userType: 'host'};
        gateway.userConnected(mockedHostSocket, hostBody);

        expect(gateway.rooms.length).toEqual(1);
        expect(gateway.hosts.length).toEqual(1);

        gateway.handleDisconnect(mockedClientSocket);
        expect(gateway.rooms.length).toEqual(0);
        expect(mockedHostSocket.emit).toBeCalledWith('userDisconnected', mockedClientSocket.id);

        gateway.handleDisconnect(mockedHostSocket);
        expect(gateway.hosts.length).toEqual(0);
    });

    it('process & saves messages', async () => {
        const emit = jest.fn();

        const mockedServer = {
            to: jest.fn().mockImplementation(() => {
                return {emit}
            }),
        };
        gateway.server = mockedServer;

        const mockedClientSocket = {
            id: '1234',
            join: jest.fn(),
            emit: jest.fn(),
        };
        let body: UserConnectedBody = {name: 'Marcin', userType: 'client'};

        gateway.userConnected(mockedClientSocket, body);

        let messages = await messageRepository.find();
        expect(messages.length).toEqual(0);

        const sendMessageBody: SendMessageBody = {
            fromId: '1234',
            from: 'Marcin',
            text: 'test',
        };
        await gateway.sendMessage(mockedClientSocket, sendMessageBody);

        messages = await messageRepository.find();
        expect(messages.length).toEqual(1);

        expect(mockedServer.to).toBeCalledWith(sendMessageBody.fromId);
        expect(emit).toBeCalledWith('newMessage', sendMessageBody);
    });

});