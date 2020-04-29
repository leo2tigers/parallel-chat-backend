import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { MessageService } from './message.service';
import { NewMessageDto } from './message.dto';

@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Get()
    async getAllMessage() {
        return this.messageService.getAllMessage();
    }

    @Get('group/:id')
    async getMessageByGroup(@Param('id') groupId: string) {
        return this.messageService.getMessageByGroup(groupId);
    }

    @Get('sender/:id')
    async getMessageBySender(@Param('id') senderId: string) {
        return this.messageService.getMessageBySender(senderId);
    }

    @Get('unread/:group/:sender')
    async getUnreadMessageByGroup(@Param('group') groupId: string, @Param('sender') senderId: string) {
        return this.messageService.getUnreadMessageByGroup(groupId, senderId);
    }

    @Post()
    async newMessage(@Body() newMessageDto: NewMessageDto) {
        return this.messageService.newMessage(newMessageDto);
    }
}
