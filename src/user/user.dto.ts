export class CreateUserDto {
    name: string;
    username: string;
    password: string;
}

export class ChangePasswordDto {
    oldpassword: string;
    newpassword: string;
}

export class ChangeDisplayNameDto {
    newDisplayname: string;
}

export class JoinOrLeaveGroupDto {
    groupId: string;
}
