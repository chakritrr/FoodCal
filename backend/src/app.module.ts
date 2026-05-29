import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './frameworks/middlewares/logger.middleware';

import { FoodEntity } from './core/entities/food.entity';
import { FoodController, AuthController } from './controller';
import { DataServicesModule } from './frameworks/data-services/data-services.module';
import { FoodGetAllUseCaseModule } from './use-case/food-get-all/food-get-all-use-case.module';
import { LoginCreateUseCaseModule } from './use-case/login-create/login-create-use-case.module';
import { RegisterCreateUseCaseModule } from './use-case/register-create/register-create-use-case.module';
import { AutoSeedService } from './database/auto-seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forFeature([FoodEntity]),
    DataServicesModule,
    FoodGetAllUseCaseModule,
    LoginCreateUseCaseModule,
    RegisterCreateUseCaseModule,
  ],
  controllers: [FoodController, AuthController],
  providers: [AutoSeedService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
