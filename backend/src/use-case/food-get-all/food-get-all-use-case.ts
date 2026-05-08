import { Injectable } from '@nestjs/common';

import { GetFoodQueryDto, IFoodRepository } from 'src/core';
import { FoodGetAllFactoryService } from './food-get-all-factory.service';

@Injectable()
export class FoodGetAllUseCase {
  constructor(
    private readonly foodGetAllFactoryService: FoodGetAllFactoryService,
    private readonly iFoodRepository: IFoodRepository,
  ) {}

  async getAllFood() {
    const entities = await this.iFoodRepository.findAll();
    return this.foodGetAllFactoryService.constructResponse(entities);
  }

  async getAllFoodPaginated(query: GetFoodQueryDto) {
    const { page, limit, category } = query;
    const [entities, total] = await this.iFoodRepository.findPaginated(page, limit, category);
    return this.foodGetAllFactoryService.constructPaginatedResponse(entities, total, page, limit);
  }
}
