import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { GetFoodQueryDto } from 'src/core';
import { FoodGetAllUseCase } from 'src/use-case/food-get-all/food-get-all-use-case';

@ApiTags('food')
@Controller()
export class FoodController {
  constructor(private readonly foodGetAllUseCase: FoodGetAllUseCase) {}

  @Get('/v1/foods')
  getAllFood(@Query() query: GetFoodQueryDto) {
    return this.foodGetAllUseCase.getAllFoodPaginated(query);
  }

  @Get('/v1/foods/:id')
  getFoodById(@Param('id') id: string) {
    return id;
  }
}
