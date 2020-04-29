export class CreateUserDto {
    name: string;
    username: string;
    password: string;
}

export class ChangePasswordDto {
    id: string;
    oldpassword: string;
    newpassword: string;
}

export class ChangeDisplayNameDto {
    id: string;
    newDisplayname: string;
}

export class JoinOrLeaveGroupDto {
    id: string;
    groupId: string;
}
