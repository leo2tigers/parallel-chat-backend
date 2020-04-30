import { Module, forwardRef } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupSchema } from '../schema/group.schema';
import { UserSchema } from '../schema/user.schema';
import { MessageSchema } from '../schema/message.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'Group', schema: GroupSchema },
            { name: 'User', schema: UserSchema },
            { name: 'Message', schema: MessageSchema}
        ]),
    ],
    controllers: [GroupController],
    providers: [GroupService],
    exports: [GroupService],
})
export class GroupModule {}
