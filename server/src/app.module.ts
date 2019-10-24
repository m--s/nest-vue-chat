import {Module} from '@nestjs/common';
import {ChatModule} from './chat/chat.module';
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'db.sqlite',
            synchronize: true,
            logging: false,
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        }),
        ChatModule
    ],
})
export class AppModule {
}
