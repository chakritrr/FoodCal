import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IFoodRepository, FoodEntity } from 'src/core';

@Injectable()
export class FoodRepository implements IFoodRepository {
  constructor(
    @InjectRepository(FoodEntity)
    private readonly foodEntity: Repository<FoodEntity>,
  ) {}

  findAll(): Promise<FoodEntity[]> {
    return this.foodEntity.find();
  }

  findOneById(id: string): Promise<FoodEntity> {
    return this.foodEntity.findOne({ where: { id } });
  }

  findByCategory(category: string): Promise<FoodEntity[]> {
    return this.foodEntity.find({ where: { category } });
  }

  findPaginated(page: number, limit: number, category?: string): Promise<[FoodEntity[], number]> {
    const where = category ? { category } : {};
    return this.foodEntity.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { name: 'ASC' },
    });
  }
}
