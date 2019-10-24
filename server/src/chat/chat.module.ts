import { Module } from '@nestjs/common';
import {ChatGateway} from "./chat.gateway";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Message} from "./db/message.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Message])],
    providers: [ChatGateway],
})
export class ChatModule {
}
