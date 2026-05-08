import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DataServicesModule } from 'src/frameworks/data-services/data-services.module';
import { JwtStrategy } from 'src/frameworks/guards/strategies/jwt.strategy';
import { LoginCreateUseCase } from './login-create-use-case';
import { LoginCreateFactoryService } from './login-create-factory.service';

@Module({
  imports: [
    DataServicesModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        secret: cs.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [LoginCreateUseCase, LoginCreateFactoryService, JwtStrategy],
  exports: [LoginCreateUseCase, LoginCreateFactoryService],
})
export class LoginCreateUseCaseModule {}
