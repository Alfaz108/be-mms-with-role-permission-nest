import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Deposit, DepositSchema } from './Schemas/deposit.schema';
import { DepositController } from './deposit.controller';
import { DepositService } from './deposit.service';
import { MemberModule } from '../member/member.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Deposit.name, schema: DepositSchema }]),
    MemberModule,
  ],
  controllers: [DepositController],
  providers: [DepositService],
})
export class DepositModule {}
