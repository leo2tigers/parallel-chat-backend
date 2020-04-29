import {
    Controller,
    Get,
    Param,
    Post,
    Body,
    Patch,
    Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
    CreateUserDto,
    ChangePasswordDto,
    ChangeDisplayNameDto,
    JoinOrLeaveGroupDto,
} from './user.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getAllUsers() {
        return this.userService.getAllUsers();
    }

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return this.userService.getUserById(id);
    }

    @Get('username/:username')
    async getUserByUsername(@Param('username') username: string) {
        return this.userService.getUserByUsername(username);
    }

    @Post()
    async createNewUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createNewUser(createUserDto);
    }

    @Patch('change-password')
    async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
        return this.userService.changePassword(changePasswordDto);
    }

    @Patch('change-display-name')
    async changeDisplayName(
        @Body() changeDisplayNameDto: ChangeDisplayNameDto,
    ) {
        return this.userService.changeDisplayName(changeDisplayNameDto);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        return this.userService.deleteUser(id);
    }

    @Post('group')
    async joinGroup(@Body() joinGroupDto: JoinOrLeaveGroupDto) {
        return this.userService.joinGroup(joinGroupDto);
    }

    @Delete('group')
    async leaveGroup(@Body() leaveGroupDto: JoinOrLeaveGroupDto) {
        return this.userService.leaveGroup(leaveGroupDto);
    }
}
