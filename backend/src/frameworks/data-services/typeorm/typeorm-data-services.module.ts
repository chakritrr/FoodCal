import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TYPE_ORM_CONFIG } from 'src/configulations';
import { FoodEntity, IFoodRepository, IUserRepository, UserEntity } from 'src/core';
import { FoodRepository, UserRepository } from 'src/repositories';

@Module({
  imports: [
    TypeOrmModule.forFeature([FoodEntity, UserEntity]),
    TYPE_ORM_CONFIG,
  ],
  providers: [
    {
      provide: IFoodRepository,
      useClass: FoodRepository,
    },
    {
      provide: IUserRepository,
      useClass: UserRepository,
    },
  ],
  exports: [IFoodRepository, IUserRepository],
})
export class TypeOrmDataServicesModule {}
