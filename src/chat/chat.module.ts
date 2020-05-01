import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { GroupModule } from '../group/group.module';
import { MessageModule } from '../message/message.module';
import { ChatGateway } from './chat.gateway';

@Module({
    imports: [UserModule, GroupModule, MessageModule],
    providers: [ChatGateway],
})
export class ChatModule {}
    
