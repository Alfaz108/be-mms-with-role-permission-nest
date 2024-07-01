import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Summary } from './Schemas/summary.schema';
import { CreateSummaryDto } from './dto/create.summary.dto';
import { UpdateSummaryDto } from './dto/update.summary.dto';
import {
  IPagination,
  PaginationOptions,
} from 'src/common/interfaces/pagination.interface';
import { BulkWriteResult } from 'mongodb';

@Injectable()
export class SummaryService {
  constructor(
    @InjectModel(Summary.name)
    private summaryModel: mongoose.Model<Summary>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async findAll(
    pagination: IPagination,
  ): Promise<{ summary: Summary[]; pagination: PaginationOptions }> {
    const { page, limit, order } = pagination;

    const totalDocument = await this.summaryModel.countDocuments();
    const summary = await this.summaryModel
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ clientId: order === 'asc' ? 1 : -1 });

    return {
      summary,
      pagination: {
        page: page,
        limit: limit,
        totalPage: Math.ceil(totalDocument / limit),
      },
    };
  }

  async findAllSummary(): Promise<{ summary: Summary[] }> {
    const summary = await this.summaryModel.find();

    return {
      summary,
    };
  }

  async create(summary: CreateSummaryDto): Promise<Summary> {
    const res = await this.summaryModel.create(summary);
    return res;
  }

  async updateById(id: string, summary: UpdateSummaryDto): Promise<Summary> {
    const updatedSummary = await this.summaryModel.findByIdAndUpdate(
      id,
      summary,
      {
        new: true,
        runValidators: true,
      },
    );

    return updatedSummary;
  }

  async findByMemberId(id: mongoose.Types.ObjectId): Promise<Summary> {
    const member = await this.summaryModel.findOne({ member: id });
    return member;
  }

  async updateSummaries(summaries: any[]): Promise<Summary[]> {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();

      console.log({ summaries });

      const bulkOps = summaries.map((summary) => ({
        updateOne: {
          filter: { _id: summary._id },
          update: {
            $set: {
              mealQuantity: summary.mealQuantity,
              mealRate: summary.mealRate,
              depositAmount: summary.depositAmount,
              totalCost: summary.totalCost,
              summaryAmount: summary.summaryAmount,
            },
          },
          upsert: false,
        },
      }));

      await this.summaryModel.bulkWrite(bulkOps, { session });

      const Summary = await this.summaryModel
        .find({
          _id: {
            $in: summaries.map((summary) => summary._id),
          },
        })
        .session(session);

      await session.commitTransaction();
      return Summary;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
