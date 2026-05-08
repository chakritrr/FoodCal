import { Injectable, ConflictException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { IUserRepository, RegisterRequestDto } from 'src/core';
import { RegisterCreateFactoryService } from './register-create-factory.service';

@Injectable()
export class RegisterCreateUseCase {
  constructor(
    private readonly dataSource: DataSource,
    private readonly iUserRepository: IUserRepository,
    private readonly registerCreateFactoryService: RegisterCreateFactoryService,
  ) {}

  async createRegister(dto: RegisterRequestDto) {
    const existingUsername = await this.iUserRepository.findOneByUsername(dto.username);
    if (existingUsername) {
      throw new ConflictException('ชื่อผู้ใช้นี้ถูกใช้งานแล้ว');
    }

    const existingEmail = await this.iUserRepository.findOneByEmail(dto.email);
    if (existingEmail) {
      throw new ConflictException('อีเมลนี้ถูกใช้งานแล้ว');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userEntity = await this.registerCreateFactoryService.createUser(dto);
      await queryRunner.manager.save(userEntity);
      await queryRunner.commitTransaction();
      return this.registerCreateFactoryService.constructResponse(userEntity.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
