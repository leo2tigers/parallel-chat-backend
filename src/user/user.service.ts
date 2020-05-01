import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../interface/user.interface';
import * as bcrypt from 'bcrypt';
import {
    CreateUserDto,
    ChangePasswordDto,
    ChangeDisplayNameDto,
    JoinOrLeaveGroupDto,
} from './user.dto';
import { GroupService } from '../group/group.service';
import { Group } from '../interface/group.interface';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private userModel: Model<User>,
        private readonly groupService: GroupService,
    ) {}

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

    async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
        if (
            await bcrypt.compare(
                changePasswordDto.oldpassword,
                (await this.getUserById(userId)).password,
            )
        ) {
            if (changePasswordDto.newpassword.length < 8) {
                throw new BadRequestException(`New password is too short`);
            }
            const hashedPass = await bcrypt.hash(
                changePasswordDto.newpassword,
                10,
            );
            return this.userModel.findByIdAndUpdate(userId, {
                password: hashedPass,
            });
        } else {
            throw new BadRequestException(`Old password is incorrect`);
        }
    }

    async changeDisplayName(
        userId: string,
        changeDisplayNameDto: ChangeDisplayNameDto,
    ): Promise<User> {
        return this.userModel.findByIdAndUpdate(userId, {
            name: changeDisplayNameDto.newDisplayname,
        });
    }

    async deleteUser(id: string) {
        return this.userModel.findByIdAndDelete(id).exec();
    }

    async checkGroupMembership(userId: string, groupId: string) {
        const user = await this.getUserById(userId);
        const ret = user.groupMembership.find(x => {
            return x.group.toString() === groupId;
        });
        return ret;
    }

    async joinGroup(userId: string, joinGroupDto: JoinOrLeaveGroupDto) {
        if (await this.checkGroupMembership(userId, joinGroupDto.groupId)) {
            throw new BadRequestException(
                `You have already joined this group!`,
            );
        }
        const user = await this.getUserById(userId);
        const group = await this.groupService.getGroupByGroupId(
            joinGroupDto.groupId,
        );
        if (!group) {
            throw new NotFoundException(`This group does not exist!`);
        }
        user.groupMembership.push({ group: joinGroupDto.groupId });
        group.members.push(userId);
        return {
            updatedUser: await user.save(),
            updatedGroup: await group.save(),
        };
    }

    async leaveGroup(userId: string, leaveGroupDto: JoinOrLeaveGroupDto) {
        if (!(await this.checkGroupMembership(userId, leaveGroupDto.groupId))) {
            throw new BadRequestException(
                `You can't leave a group you're not member of!`,
            );
        }
        const user = await this.getUserById(userId);
        const group = await this.groupService.getGroupByGroupId(
            leaveGroupDto.groupId,
        );
        const userAfterLeaveGroup = user.groupMembership.filter(
            ({ group, lastAccess }) => {
                return group.toString() !== leaveGroupDto.groupId;
            },
        );
        const groupAfterLeaveGroup = group.members.filter(member => {
            return member.toString() !== userId;
        });
        user.groupMembership = userAfterLeaveGroup;
        group.members = groupAfterLeaveGroup;
        let groupRet: Group;
        if (groupAfterLeaveGroup.length === 0) {
            groupRet = await this.groupService.deleteGroupById(
                leaveGroupDto.groupId,
            );
        } else {
            groupRet = await group.save();
        }
        return {
            updatedUser: await user.save(),
            updatedGroup: groupRet,
        };
    }

    async updateLastReadOfAGroup(userId: string, groupId: string) {
        const user = await this.getUserById(userId);
        const idx = user.groupMembership.findIndex(
            element => element.group.toString() === groupId,
        );
        user.groupMembership[idx].lastAccess = new Date();
        return user.save();
    }
}
