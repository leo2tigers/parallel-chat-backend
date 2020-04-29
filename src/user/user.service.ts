import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../interface/user.interface';
import * as bcrypt from 'bcrypt';
import {
    CreateUserDto,
    ChangePasswordDto,
    ChangeDisplayNameDto,
    JoinOrLeaveChatRoomDto,
} from './user.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private userModel: Model<User>) {}

    async getAllUsers(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async getUserById(id: string): Promise<User> {
        return this.userModel.findById(id).exec();
    }

    async getUserByUsername(username: string): Promise<User> {
        return this.userModel.findOne({ username });
    }

    async createNewUser(createUserDto: CreateUserDto): Promise<User> {
        if (createUserDto.password.length < 8) {
            throw new BadRequestException(`Password is too short`);
        }
        const hashedPass = await bcrypt.hash(createUserDto.password, 10);
        createUserDto.password = hashedPass;

        if (await this.getUserByUsername(createUserDto.username)) {
            throw new BadRequestException(`This username has been used`);
        }

        const createdUser = new this.userModel(createUserDto);
        return createdUser.save();
    }

    async changePassword(changePasswordDto: ChangePasswordDto) {
        if (
            await bcrypt.compare(
                changePasswordDto.oldpassword,
                (await this.getUserById(changePasswordDto.id)).password,
            )
        ) {
            if (changePasswordDto.newpassword.length < 8) {
                throw new BadRequestException(`New password is too short`);
            }
            const hashedPass = await bcrypt.hash(
                changePasswordDto.newpassword,
                10,
            );
            return this.userModel.findByIdAndUpdate(changePasswordDto.id, {
                password: hashedPass,
            });
        } else {
            throw new BadRequestException(`Old password is incorrect`);
        }
    }

    async changeDisplayName(
        changeDisplayNameDto: ChangeDisplayNameDto,
    ): Promise<User> {
        return this.userModel.findByIdAndUpdate(changeDisplayNameDto.id, {
            name: changeDisplayNameDto.newDisplayname,
        });
    }

    async deleteUser(id: string) {
        return this.userModel.findByIdAndDelete(id).exec();
    }

    async joinChatRoom(joinChatRoomDto: JoinOrLeaveChatRoomDto) {
        const user = await this.getUserById(joinChatRoomDto.id);
        user.groupMembership.push({ group: joinChatRoomDto.chatroomId });
        return user.save();
    }

    async leaveChatRoom(leaveChatRoomDto: JoinOrLeaveChatRoomDto) {
        const user = await this.getUserById(leaveChatRoomDto.id);
        const userAfterLeaveChatRoom = user.groupMembership.filter(
            ({ group, lastAccess }) => {
                return group !== leaveChatRoomDto.chatroomId;
            },
        );
        user.groupMembership = userAfterLeaveChatRoom;
        return user.save();
    }
}
