import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IUserRepository, UserEntity } from 'src/core';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
  ) {}

  findAll(): Promise<UserEntity[]> {
    return this.userEntity.find();
  }

  findOneById(id: string): Promise<UserEntity> {
    return this.userEntity.findOne({ where: { id } });
  }

  findOneByUsername(username: string): Promise<UserEntity> {
    return this.userEntity.findOne({ where: { username } });
  }

  findOneByEmail(email: string): Promise<UserEntity> {
    return this.userEntity.findOne({ where: { email } });
  }
}
