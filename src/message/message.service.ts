import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from '../interface/message.interface';
import { NewMessageDto } from './message.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class MessageService {
    constructor(
        @InjectModel('Message') private messageModel: Model<Message>,
        private userService: UserService,
    ) {}

    async getAllMessage(): Promise<Message[]> {
        return this.messageModel.find();
    }

    async getMessageByGroup(groupId: string): Promise<Message[]> {
        return this.messageModel.find({ group: groupId });
    }

    async getMessageBySender(senderId: string): Promise<Message[]> {
        return this.messageModel.find({ sender: senderId });
    }

    private async getLastReadTimeOfAGroup(groupId: string, senderId: string) {
        return (
            await this.userService.getUserById(senderId)
        ).groupMembership.find(element => element.group === groupId).group;
    }

    async getUnreadMessageByGroup(
        groupId: string,
        senderId: string,
    ): Promise<Message[]> {
        const messages = await this.messageModel.find({
            group: groupId,
            sender: senderId,
            createdTime: {
                $gte: await this.getLastReadTimeOfAGroup(groupId, senderId),
            },
        });
        await this.userService.updateLastReadOfAGroup(senderId, groupId);
        return messages;
    }

    async newMessage(newMessageDto: NewMessageDto) {
        const message = new this.messageModel(newMessageDto);
        return message.save();
    }
}
