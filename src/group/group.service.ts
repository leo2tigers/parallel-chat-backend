import { Injectable, BadRequestException } from '@nestjs/common';
import { Group } from 'src/interface/group.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGroupDto, ChangeGroupNameDto } from './group.dto';

@Injectable()
export class GroupService {
    constructor(@InjectModel('Group') private groupModel: Model<Group>) {}

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

    async createNewGroup(createGroupDto: CreateGroupDto): Promise<Group> {
        if (createGroupDto.groupName.length === 0) {
            throw new BadRequestException(`Group name cannot be empty`);
        }
        const createdGroup = new this.groupModel(createGroupDto);
        await createdGroup.save();
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
        return this.groupModel.findByIdAndDelete(id);
    }
}
