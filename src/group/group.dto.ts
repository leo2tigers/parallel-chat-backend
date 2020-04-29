export class CreateGroupDto {
    creator: string;
    groupName: string;
}

export class ChangeGroupNameDto {
    groupId: string;
    newGroupName: string;
}
