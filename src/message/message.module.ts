import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MessageSchema } from '../schema/message.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
        UserModule,
    ],
    controllers: [MessageController],
    providers: [MessageService],
})
export class MessageModule {}
