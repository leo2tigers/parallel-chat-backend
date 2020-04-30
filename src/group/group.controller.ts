import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Patch,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto, ChangeGroupNameDto } from './group.dto';
import { AuthGuard } from '@nestjs/passport';
import { LoadUser } from '../decorators/user.decorator';

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

    @Get('/group-list/:memberId')
    async getListGroupByMember(@Param('memberId') memberId: string) {
        return this.groupService.getListGroupByMember(memberId);
    }

    @UseGuards(AuthGuard())
    @Post()
    async createNewGroup(@LoadUser() user: any, @Body() createGroupDto: CreateGroupDto) {
        return this.groupService.createNewGroup(createGroupDto, user.id);
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
