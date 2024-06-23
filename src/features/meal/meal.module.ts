import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MealService } from './meal.service';

import { MealController } from './meal.controller';
import { Meal, MealSchema } from './Schemas/meal.schema';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Meal.name, schema: MealSchema }]),
    MemberModule,
  ],
  controllers: [MealController],
  providers: [MealService],
})
export class MealModule {}
