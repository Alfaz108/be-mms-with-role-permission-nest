import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Market, MarketSchema } from './schemas/market.schema';
import { MarketService } from './market.service';
import { MarketController } from './market.controller';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { MealModule } from '../meal/meal.module';
import { SummaryModule } from '../summary/summary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Market.name, schema: MarketSchema }]),
    AuthModule,
    SummaryModule,
    MemberModule,
    forwardRef(() => MealModule),
  ],
  controllers: [MarketController],
  providers: [MarketService],
  exports: [MarketService],
})
export class MarketModule {}
