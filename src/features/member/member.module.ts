import { Module, forwardRef } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/features/auth/auth.module';
import { Member, MemberSchema } from './schemas/member.schema';
import { UserModule } from 'src/features/user/user.module';
import { SummaryModule } from '../summary/summary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
    AuthModule,
    UserModule,
    SummaryModule,
  ],

  controllers: [MemberController],
  providers: [MemberService],
  exports: [MemberService],
})
export class MemberModule {}
