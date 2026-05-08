import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { RegisterRequestDto, RegisterResponseDto, UserEntity } from 'src/core';

@Injectable()
export class RegisterCreateFactoryService {
  async createUser(dto: RegisterRequestDto): Promise<UserEntity> {
    const hash = await bcrypt.hash(dto.password, 10);

    const user = new UserEntity();
    user.username = dto.username;
    user.email = dto.email;
    user.password = hash;
    user.createdAt = new Date();
    user.updatedAt = new Date();

    return user;
  }

  constructResponse(id: string): RegisterResponseDto {
    const resp = new RegisterResponseDto();
    resp.id = id;
    return resp;
  }
}
