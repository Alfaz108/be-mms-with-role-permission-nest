import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Dashboard } from './Schemas/dashboard.schema';
import { SummaryService } from '../summary/summary.service';
import { Summary } from '../summary/Schemas/summary.schema';
import { Member } from '../member/schemas/member.schema';
import { STATUS_ENUM } from '../../constant/enums/status.enum';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Dashboard.name)
    private dashboardModel: mongoose.Model<Dashboard>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(Summary.name)
    private summaryModel: mongoose.Model<Summary>,
    @InjectModel(Member.name)
    private readonly memberModel: mongoose.Model<Member>,
  ) {}

  async findAll(): Promise<Dashboard> {
    const totalSummary = await this.summaryModel.aggregate([
      {
        $group: {
          _id: null,
          totalDeposit: { $sum: '$depositAmount' },
          totalMealQuantity: { $sum: '$mealQuantity' },
          totalCost: { $sum: '$totalCost' },
          positiveSummaryCount: {
            $sum: {
              $cond: [{ $gt: ['$summaryAmount', 0] }, 1, 0],
            },
          },
          negativeSummaryCount: {
            $sum: {
              $cond: [{ $lt: ['$summaryAmount', 0] }, 1, 0],
            },
          },
          mealRate: { $first: '$mealRate' },
        },
      },
    ]);

    const memberStatusCounts = await this.memberModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statusCounts = memberStatusCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const activeCount = statusCounts[STATUS_ENUM.ACTIVE] || 0;
    const inactiveCount = statusCounts[STATUS_ENUM.INACTIVE] || 0;
    const totalCashInHand =
      Number(totalSummary[0].totalDeposit) - Number(totalSummary[0].totalCost);

    const dashboardData = {
      totalActiveMember: activeCount,
      totalInActiveMember: inactiveCount,
      totalPositiveMember: totalSummary[0].positiveSummaryCount,
      totalNegativeMember: totalSummary[0].negativeSummaryCount,
      totalDeposit: totalSummary[0].totalDeposit,
      totalCost: totalSummary[0].totalCost,
      totalMeal: totalSummary[0].totalMealQuantity,
      totalCashInHand: totalCashInHand,
      mealRate: totalSummary[0].mealRate,
    };

    return dashboardData;
  }
}
