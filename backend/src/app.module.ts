import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './frameworks/middlewares/logger.middleware';

import { FoodController, AuthController } from './controller';
import { DataServicesModule } from './frameworks/data-services/data-services.module';
import { FoodGetAllUseCaseModule } from './use-case/food-get-all/food-get-all-use-case.module';
import { LoginCreateUseCaseModule } from './use-case/login-create/login-create-use-case.module';
import { RegisterCreateUseCaseModule } from './use-case/register-create/register-create-use-case.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    DataServicesModule,
    FoodGetAllUseCaseModule,
    LoginCreateUseCaseModule,
    RegisterCreateUseCaseModule,
  ],
  controllers: [FoodController, AuthController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
