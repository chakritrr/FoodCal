import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { LoginRequestDto, RegisterRequestDto } from 'src/core';
import { JwtAuthGuard } from 'src/frameworks/guards/jwt.auth.guard';
import { LoginCreateUseCase } from 'src/use-case/login-create/login-create-use-case';
import { RegisterCreateUseCase } from 'src/use-case/register-create/register-create-use-case';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(
    private readonly loginCreateUseCase: LoginCreateUseCase,
    private readonly registerCreateUseCase: RegisterCreateUseCase,
  ) {}

  @Post('/v1/register')
  register(@Body() dto: RegisterRequestDto) {
    return this.registerCreateUseCase.createRegister(dto);
  }

  @Post('/v1/login')
  login(@Body() dto: LoginRequestDto) {
    return this.loginCreateUseCase.loginCreate(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/v1/me')
  getMe(@Request() req) {
    return req.user;
  }
}
