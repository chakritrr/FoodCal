import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { LoginRequestDto, UserEntity } from 'src/core';

@Injectable()
export class LoginCreateFactoryService {
  async comparePassword(user: UserEntity, loginRequestDto: LoginRequestDto) {
    if (!user) {
      throw new UnauthorizedException('ไม่พบผู้ใช้งาน');
    }

    const isValid = await bcrypt.compare(loginRequestDto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  }
}
