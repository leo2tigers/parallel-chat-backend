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

    async getGroupById(id: string) {
        return this.groupModel.findById(id).exec();
    }

    async createNewGroup(createGroupDto: CreateGroupDto): Promise<Group> {
        if (createGroupDto.name.length == 0) {
            throw new BadRequestException('Group name cannot be empty');
        }
        const createdGroup = new this.groupModel(createGroupDto);
        return createdGroup.save();
    }

    async changeGroupName(
        changeGroupNameDto: ChangeGroupNameDto,
    ): Promise<Group> {
        return this.groupModel.findByIdAndUpdate(changeGroupNameDto.id, {
            name: changeGroupNameDto.newGroupName,
        });
    }

    async deleteGroupById(id: string) {
        return this.groupModel.findByIdAndDelete(id);
    }
}
