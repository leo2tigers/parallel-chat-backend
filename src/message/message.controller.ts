import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { NewMessageDto } from './message.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoadUser } from 'src/decorators/user.decorator';

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

    @UseGuards(AuthGuard())
    @Get('unread/:group')
    async getUnreadMessageByGroup(
        @LoadUser() user: any,
        @Param('group') groupId: string,
    ) {
        return this.messageService.getUnreadMessageByGroup(groupId, user.id);
    }

    @UseGuards(AuthGuard())
    @Post()
    async newMessage(@LoadUser() user: any, @Body() newMessageDto: NewMessageDto) {
        return this.messageService.newMessage(newMessageDto, user.id);
    }
}
