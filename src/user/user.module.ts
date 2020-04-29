import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../schema/user.schema';
import { GroupModule } from '../group/group.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        GroupModule
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
