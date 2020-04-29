export class CreateGroupDto {
    userId: string;
    groupName: string;
}

export class ChangeGroupNameDto {
    groupId: string;
    newGroupName: string;
}
