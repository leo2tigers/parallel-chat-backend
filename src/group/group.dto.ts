export class CreateGroupDto {
    creatorId: string;
    groupName: string;
}

export class ChangeGroupNameDto {
    groupId: string;
    newGroupName: string;
}
