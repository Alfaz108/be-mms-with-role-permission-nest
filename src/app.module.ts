import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './features/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberModule } from './features/member/member.module';
import { MealModule } from './features/meal/meal.module';
import { MarketModule } from './features/market/market.module';
import { DepositModule } from './features/deposit/deposit.module';
import { SummaryModule } from './features/summary/summary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URL),
    AuthModule,
    MemberModule,
    MealModule,
    MarketModule,
    DepositModule,
    SummaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
