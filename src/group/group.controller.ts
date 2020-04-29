import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Patch,
    Delete,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto, ChangeGroupNameDto } from './group.dto';

@Controller('group')
export class GroupController {
    constructor(private readonly groupService: GroupService) {}

    @Get()
    async getAllGroup() {
        return this.groupService.getAllGroup();
    }

    @Get(':id')
    async getGroupByGroupId(@Param('id') id: string) {
        return this.groupService.getGroupByGroupId(id);
    }

    @Get('/group-list/:userId')
    async getListGroupByUserId(@Param('userId') userId: string) {
        return this.groupService.getListGroupByUserId(userId);
    }

    @Post()
    async createNewGroup(@Body() createGroupDto: CreateGroupDto) {
        return this.groupService.createNewGroup(createGroupDto);
    }

    @Patch()
    async changeGroupName(@Body() changeGroupNameDto: ChangeGroupNameDto) {
        return this.groupService.changeGroupName(changeGroupNameDto);
    }

    @Delete(':id')
    async deleteGroupById(@Param('id') id: string) {
        return this.groupService.deleteGroupById(id);
    }
}
