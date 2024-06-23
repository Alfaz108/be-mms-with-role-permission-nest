import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IPagination } from '../interfaces/pagination.interface';

export const Pagination = createParamDecorator(
  (_, ctx: ExecutionContext): IPagination => {
    const req = ctx.switchToHttp().getRequest();
    return {
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
      order: req.query.order || 'desc',
    };
  },
);
