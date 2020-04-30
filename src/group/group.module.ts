import { Module, forwardRef } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupSchema } from '../schema/group.schema';
import { UserModule } from '../user/user.module';
import { UserSchema } from 'src/schema/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Group', schema: GroupSchema }, {name: 'User', schema: UserSchema}]),
    ],
    controllers: [GroupController],
    providers: [GroupService],
    exports: [GroupService],
})
export class GroupModule {}
