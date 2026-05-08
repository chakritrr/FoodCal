import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { IUserRepository, LoginRequestDto, LoginResponseDto } from 'src/core';
import { LoginCreateFactoryService } from './login-create-factory.service';

@Injectable()
export class LoginCreateUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly iUserRepository: IUserRepository,
    private readonly loginCreateFactoryService: LoginCreateFactoryService,
  ) {}

  async loginCreate(loginRequestDto: LoginRequestDto): Promise<LoginResponseDto> {
    const { username } = loginRequestDto;
    const userEntity = await this.iUserRepository.findOneByUsername(username);

    await this.loginCreateFactoryService.comparePassword(userEntity, loginRequestDto);

    const payload = { email: userEntity.email, sub: userEntity.id };
    const token = this.jwtService.sign(payload);

    return { token };
  }
}
