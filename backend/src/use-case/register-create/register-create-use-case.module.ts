import { Module } from '@nestjs/common';

import { DataServicesModule } from 'src/frameworks/data-services/data-services.module';
import { RegisterCreateUseCase } from './register-create-use-case';
import { RegisterCreateFactoryService } from './register-create-factory.service';

@Module({
  imports: [DataServicesModule],
  providers: [RegisterCreateUseCase, RegisterCreateFactoryService],
  exports: [RegisterCreateUseCase, RegisterCreateFactoryService],
})
export class RegisterCreateUseCaseModule {}
