import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Summary, SummarySchema } from './Schemas/summary.schema';

import { SummaryController } from './summary.controller';
import { SummaryService } from './summary.service';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Summary.name, schema: SummarySchema }]),
    AuthModule,
    forwardRef(() => MemberModule),
  ],
  controllers: [SummaryController],
  providers: [SummaryService],
  exports: [SummaryService],
})
export class SummaryModule {}
