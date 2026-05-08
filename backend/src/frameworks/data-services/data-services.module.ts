import { Module } from '@nestjs/common';

import { TypeOrmDataServicesModule } from './typeorm/typeorm-data-services.module';

@Module({
  imports: [TypeOrmDataServicesModule],
  exports: [TypeOrmDataServicesModule],
})
export class DataServicesModule {}
