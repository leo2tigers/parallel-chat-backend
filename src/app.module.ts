import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GroupModule } from './group/group.module';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { ChatGateway } from './chat/chat.gateway';

@Module({
    imports: [
        GroupModule,
        UserModule,
        MessageModule,
        MongooseModule.forRootAsync({
            useFactory: () => ({
                uri: process.env.MONGO_URI,
                useFindAndModify: false,
                useUnifiedTopology: true,
                useNewUrlParser: true,
            }),
        }),
        AuthModule,
        ChatModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
