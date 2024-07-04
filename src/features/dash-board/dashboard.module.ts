import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Dashboard, DashboardSchema } from './Schemas/dashboard.schema';
import { Summary, SummarySchema } from '../summary/Schemas/summary.schema';
import { Member, MemberSchema } from '../member/schemas/member.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Dashboard.name, schema: DashboardSchema },
      { name: Summary.name, schema: SummarySchema },
      { name: Member.name, schema: MemberSchema },
    ]),
    AuthModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
