import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MealService } from './meal.service';

import { MealController } from './meal.controller';
import { Meal, MealSchema } from './Schemas/meal.schema';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { SummaryModule } from '../summary/summary.module';
import { MarketModule } from '../market/market.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Meal.name, schema: MealSchema }]),
    MemberModule,

    AuthModule,
    SummaryModule,
    MarketModule,
  ],
  controllers: [MealController],
  providers: [MealService],
  exports: [MealService],
})
export class MealModule {}
