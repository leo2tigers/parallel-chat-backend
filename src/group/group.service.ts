import { Injectable, BadRequestException } from '@nestjs/common';
import { Group } from '../interface/group.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGroupDto, ChangeGroupNameDto } from './group.dto';
import { User } from '../interface/user.interface';
import { Message } from '../interface/message.interface';

@Injectable()
export class GroupService {
    constructor(
        @InjectModel('Group') private groupModel: Model<Group>,
        @InjectModel('User') private userModel: Model<User>,
        @InjectModel('Message') private messageModel: Model<Message>,
    ) {}

    async getAllGroup(): Promise<Group[]> {
        return this.groupModel.find().exec();
    }

    async getGroupByGroupId(id: string): Promise<Group> {
        return this.groupModel.findById(id).exec();
    }

    async getListGroupByMember(memberId: string): Promise<Group[]> {
        return this.groupModel
            .find({ members: { $elemMatch: { $eq: memberId } } })
            .exec();
    }

    async createNewGroup(createGroupDto: CreateGroupDto, creator?: string): Promise<Group> {
        if (creator) {
            createGroupDto.creator = creator;
        }
        if (createGroupDto.groupName.length === 0) {
            throw new BadRequestException(`Group name cannot be empty`);
        }
        const createdGroup = new this.groupModel(createGroupDto);
        await createdGroup.save();
        await this.userModel.findByIdAndUpdate(createGroupDto.creator, {
            $push: { groupMembership: { group: createdGroup._id }}
        });
        return this.groupModel.findByIdAndUpdate(createdGroup._id, {
            $push: { members: createdGroup.creator },
        });
    }

    async changeGroupName(
        changeGroupNameDto: ChangeGroupNameDto,
    ): Promise<Group> {
        if (changeGroupNameDto.newGroupName.length === 0) {
            throw new BadRequestException(`Group name cannot be empty`);
        }
        return this.groupModel.findByIdAndUpdate(changeGroupNameDto.groupId, {
            groupName: changeGroupNameDto.newGroupName,
        });
    }

    async deleteGroupById(id: string) {
        const userInGroup = await this.userModel.find({
                'groupMembership.group': id,
                'groupMembership.lastAccess': { $gte: new Date(-100)}
            }).exec()
        userInGroup.forEach(user => {
            user.groupMembership = user.groupMembership.filter(
                ({ group, lastAccess }) => {
                    return group.toString() !== id;
                },
            )
        })
        userInGroup.forEach(async user => {
            await user.save();
        })
        await this.messageModel.deleteMany({group: id});
        return this.groupModel.findByIdAndDelete(id);
    }
}
