import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Dashboard } from './Schemas/dashboard.schema';
import { SummaryService } from '../summary/summary.service';
import { Summary } from '../summary/Schemas/summary.schema';
import { Member } from '../member/schemas/member.schema';
import { STATUS_ENUM } from '../../constant/enums/status.enum';
import { User } from '../user/schemas/user.schema';
import { ROLE_ENUM } from '../../constant/enums/role.enum';

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
    @InjectModel(User.name)
    private readonly userModel: mongoose.Model<User>,
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

    // Provide a default object if totalSummary is empty
    const summaryData = totalSummary[0] || {
      totalDeposit: 0,
      totalMealQuantity: 0,
      totalCost: 0,
      positiveSummaryCount: 0,
      negativeSummaryCount: 0,
      mealRate: 0,
    };

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
      Number(summaryData.totalDeposit) - Number(summaryData.totalCost);

    const dashboardData = {
      totalActiveMember: activeCount,
      totalInActiveMember: inactiveCount,
      totalPositiveMember: summaryData.positiveSummaryCount,
      totalNegativeMember: summaryData.negativeSummaryCount,
      totalDeposit: summaryData.totalDeposit,
      totalCost: summaryData.totalCost,
      totalMeal: summaryData.totalMealQuantity,
      totalCashInHand: totalCashInHand,
      mealRate: summaryData.mealRate,
    };

    return dashboardData;
  }

  async getAdminDashboardData(): Promise<any> {
    // Count the total number of users
    const totalUsers = await this.userModel.countDocuments();

    // Count the number of members
    const memberCount = await this.userModel.countDocuments({
      role: ROLE_ENUM.MEMBER,
    });

    // Get the manager's details (assuming there is only one manager)
    const manager = await this.userModel.findOne(
      { role: ROLE_ENUM.MANAGER },
      'name',
    );

    return {
      totalUsers,
      memberCount,
      managerName: manager ? manager.name : null,
    };
  }
}
