import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
} from '@nestjs/websockets';
import { UserService } from '../user/user.service';
import { GroupService } from '../group/group.service';
import { MessageService } from '../message/message.service';
import { Socket, Server } from 'socket.io';
import { NewMessageDto } from '../message/message.dto';
import { CreateGroupDto } from '../group/group.dto';
import { JoinOrLeaveGroupDto } from '../user/user.dto';

@WebSocketGateway(10001, { transports: ['websocket'] })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly userService: UserService,
        private readonly groupService: GroupService,
        private readonly messageService: MessageService,
    ) {}

    @WebSocketServer() server: Server;

    async handleConnection(socket: Socket) {
        console.log(`[NewUserConnected] :\t${socket.id}`);
    }

    async handleDisconnect(socket: Socket) {
        console.log(`[UserDisconnected] :\t${socket.id}`);
    }

    @SubscribeMessage('send-message')
    async newMessage(socket: Socket, data: any) {
        const user = await this.userService.getUserById(data.sender);
        const newMessageDto: NewMessageDto = {
            message: data.message,
            sender: data.user,
            group: data.group,
        };
        const res = await this.messageService.newMessage(newMessageDto);

        const newMessageData = {
            message: data.message,
            sender: data.user,
            senderName: user.name,
            group: data.group,
            createdAt: res.createdAt,
        };

        this.server.to(data.group).emit('new-message', newMessageData);
        console.log(
            `[MessageSent] :\t${data.message} from ${user.name} to group ID ${data.group}`,
        );
    }

    @SubscribeMessage('create-group')
    async createGroup(socket: Socket, data: any) {
        const createGroupDto: CreateGroupDto = {
            creator: data.user,
            groupName: data.groupName,
        };
        const res = await this.groupService.createNewGroup(createGroupDto);
        socket.join(res._id);
        const newGroupData = {
            groupId: res._id,
            groupName: res.groupName,
            creator: res.creator,
        };

        this.server.emit('new-group', newGroupData);
        console.log(`[GroupCreated] :\t${res.groupName}`);
    }

    @SubscribeMessage('join-group')
    async joinGroup(socket: Socket, data: any) {
        const user = await this.userService.getUserById(data.user);
        const newMessageDto: NewMessageDto = {
            message: `${user.name} joined the group`,
            sender: data.user,
            group: data.group,
            isJoinOrLeaveMessage: true,
        };
        const joinGroupDto: JoinOrLeaveGroupDto = {
            groupId: data.group,
        };

        const resJoin = await this.userService.joinGroup(
            data.user,
            joinGroupDto,
        );
        const resMsg = await this.messageService.newMessage(newMessageDto);
        socket.join(data.group);

        const joinGroupData = {
            user: data.user,
            userDisplayname: user.name,
            group: data.group,
            groupName: resJoin.updatedGroup.groupName,
            joinTime: resMsg.createdAt,
        };

        this.server.to(data.group).emit('user-join', joinGroupData);
        console.log(
            `[UserJoinGroup]:\t${user.username} joined ${resJoin.updatedGroup.groupName}`,
        );
    }

    @SubscribeMessage('leave-group')
    async leaveGroup(socket: Socket, data: any) {
        const user = await this.userService.getUserById(data.user);
        const newMessageDto: NewMessageDto = {
            message: `${user.name} left the group`,
            sender: data.user,
            group: data.group,
            isJoinOrLeaveMessage: true,
        };
        const leaveGroupDto: JoinOrLeaveGroupDto = {
            groupId: data.group,
        };

        const resLeave = await this.userService.leaveGroup(
            data.user,
            leaveGroupDto,
        );
        const resMsg = await this.messageService.newMessage(newMessageDto);

        const leaveGroupData = {
            user: data.user,
            userDisplayname: user.name,
            group: data.group,
            groupName: resLeave.updatedGroup.groupName,
            leaveTime: resMsg.createdAt,
        };
        this.server.to(data.group).emit('user-leave', leaveGroupData);
        socket.leave(data.group);
        console.log(
            `[UserLeaveGroup]:\t${user.username} left ${resLeave.updatedGroup.groupName}`,
        );
    }

    @SubscribeMessage('login')
    async login(socket: Socket, data: any) {
        const user = await this.userService.getUserById(data.user);
        user.groupMembership.forEach(({ group, lastAccess }) => {
            socket.join(group);
        });
        console.log(`[UserLogin] :\t${user.username}`);
    }

    @SubscribeMessage('change-focused-room')
    async changeRoom(socket: Socket, data: any) {
        if (!data.group) {
            data.groupName = ``;
        } else {
            data.groupName = (
                await this.groupService.getGroupByGroupId(data.group)
            ).groupName;
        }

        socket.emit('change-focused-room-reply', data);
        console.log(
            `[ChangeFocusedRoom] :\t ${socket.id} to ${data.groupName}`,
        );
    }

    @SubscribeMessage('test-message')
    handleMessage(socket: Socket, data: any): string {
        return 'Hello world!';
    }
}
