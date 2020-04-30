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
import { UserService } from './user.service';
import {
    CreateUserDto,
    ChangePasswordDto,
    ChangeDisplayNameDto,
    JoinOrLeaveGroupDto,
} from './user.dto';
import { LoadUser } from '../decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';

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

    @UseGuards(AuthGuard())
    @Patch('change-password')
    async changePassword(
        @LoadUser() user: any,
        @Body() changePasswordDto: ChangePasswordDto,
    ) {
        return this.userService.changePassword(user.id, changePasswordDto);
    }

    @UseGuards(AuthGuard())
    @Patch('change-display-name')
    async changeDisplayName(
        @LoadUser() user: any,
        @Body() changeDisplayNameDto: ChangeDisplayNameDto,
    ) {
        return this.userService.changeDisplayName(
            user.id,
            changeDisplayNameDto,
        );
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        return this.userService.deleteUser(id);
    }

    @UseGuards(AuthGuard())
    @Post('group')
    async joinGroup(
        @LoadUser() user: any,
        @Body() joinGroupDto: JoinOrLeaveGroupDto,
    ) {
        return this.userService.joinGroup(user.id, joinGroupDto);
    }

    @UseGuards(AuthGuard())
    @Patch('group')
    async leaveGroup(
        @LoadUser() user: any,
        @Body() leaveGroupDto: JoinOrLeaveGroupDto,
    ) {
        return this.userService.leaveGroup(user.id, leaveGroupDto);
    }
}
