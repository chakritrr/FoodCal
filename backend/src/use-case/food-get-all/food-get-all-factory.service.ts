import { Injectable } from '@nestjs/common';

import { FoodEntity, GetFoodPaginatedResponseDto, GetFoodResponseDto } from 'src/core';

@Injectable()
export class FoodGetAllFactoryService {
  constructResponse(foodEntities: FoodEntity[]): GetFoodResponseDto[] {
    return foodEntities.map((item) => this.toDto(item));
  }

  constructPaginatedResponse(
    foodEntities: FoodEntity[],
    total: number,
    page: number,
    limit: number,
  ): GetFoodPaginatedResponseDto {
    const resp = new GetFoodPaginatedResponseDto();
    resp.data = foodEntities.map((item) => this.toDto(item));
    resp.total = total;
    resp.page = page;
    resp.limit = limit;
    resp.totalPages = Math.ceil(total / limit);
    return resp;
  }

  private toDto(item: FoodEntity): GetFoodResponseDto {
    const dto = new GetFoodResponseDto();
    dto.id = item.id;
    dto.name = item.name;
    dto.emoji = item.emoji;
    dto.category = item.category;
    dto.caloriesPer100g = item.caloriesPer100g;
    return dto;
  }
}
