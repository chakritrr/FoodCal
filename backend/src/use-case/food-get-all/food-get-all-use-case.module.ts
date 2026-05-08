import { Module } from '@nestjs/common';

import { DataServicesModule } from 'src/frameworks/data-services/data-services.module';
import { FoodGetAllUseCase } from './food-get-all-use-case';
import { FoodGetAllFactoryService } from './food-get-all-factory.service';

@Module({
  imports: [DataServicesModule],
  providers: [FoodGetAllUseCase, FoodGetAllFactoryService],
  exports: [FoodGetAllUseCase, FoodGetAllFactoryService],
})
export class FoodGetAllUseCaseModule {}
