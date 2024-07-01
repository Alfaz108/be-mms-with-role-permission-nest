import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Deposit, DepositSchema } from './Schemas/deposit.schema';
import { DepositController } from './deposit.controller';
import { DepositService } from './deposit.service';
import { MemberModule } from '../member/member.module';
import { AuthModule } from '../auth/auth.module';
import { SummaryModule } from '../summary/summary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Deposit.name, schema: DepositSchema }]),
    AuthModule,
    MemberModule,
    SummaryModule,
  ],
  controllers: [DepositController],
  providers: [DepositService],
})
export class DepositModule {}
