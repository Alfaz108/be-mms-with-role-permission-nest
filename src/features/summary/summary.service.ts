import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Summary } from './Schemas/summary.schema';
import { CreateSummaryDto } from './dto/create.summary.dto';
import { UpdateSummaryDto } from './dto/update.summary.dto copy';
import {
  IPagination,
  PaginationOptions,
} from 'src/common/interfaces/pagination.interface';

@Injectable()
export class SummaryService {
  constructor(
    @InjectModel(Summary.name)
    private summaryModel: mongoose.Model<Summary>,
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
        currentPage: page,
        totalPage: Math.ceil(totalDocument / limit),
        allDataCount: totalDocument,
      },
    };
  }

  async create(summary: CreateSummaryDto): Promise<Summary> {
    const res = await this.summaryModel.create(summary);
    return res;
  }

  async updateById(id: string, summary: UpdateSummaryDto): Promise<Summary> {
    return await this.summaryModel.findByIdAndUpdate(id, summary, {
      new: true,
      runValidators: true,
    });
  }

  async findByMemberId(id: mongoose.Types.ObjectId): Promise<Summary> {
    const member = await this.summaryModel.findOne({ member: id });
    return member;
  }
}
