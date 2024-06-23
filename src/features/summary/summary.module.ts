import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Summary, SummarySchema } from './Schemas/summary.schema';

import { SummaryController } from './summary.controller';
import { SummaryService } from './summary.service';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Summary.name, schema: SummarySchema }]),
    MemberModule,
  ],
  controllers: [SummaryController],
  providers: [SummaryService],
  exports: [SummaryService],
})
export class SummaryModule {}
