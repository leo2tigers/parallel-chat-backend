import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GroupModule } from './group/group.module';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [GroupModule, UserModule, MessageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
