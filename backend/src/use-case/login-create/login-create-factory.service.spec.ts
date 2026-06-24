import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { LoginCreateFactoryService } from './login-create-factory.service';
import { UserEntity, LoginRequestDto } from 'src/core';

jest.mock('bcrypt');

describe('LoginCreateFactoryService', () => {
  let service: LoginCreateFactoryService;

  const mockUser: UserEntity = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    username: 'john_doe',
    email: 'john@example.com',
    password: '$2b$10$hashedpassword',
    role: 'user',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(() => {
    service = new LoginCreateFactoryService();
    jest.clearAllMocks();
  });

  describe('comparePassword', () => {
    const loginDto: LoginRequestDto = {
      username: 'john_doe',
      password: 'password123',
    };

    it('should throw UnauthorizedException when user is null', async () => {
      await expect(
        service.comparePassword(null as unknown as UserEntity, loginDto),
      ).rejects.toThrow(UnauthorizedException);

      await expect(
        service.comparePassword(null as unknown as UserEntity, loginDto),
      ).rejects.toThrow('ไม่พบผู้ใช้งาน');
    });

    it('should throw UnauthorizedException when password does not match', async () => {
      jest.mocked(bcrypt.compare).mockResolvedValue(false as never);

      await expect(
        service.comparePassword(mockUser, loginDto),
      ).rejects.toThrow(UnauthorizedException);

      await expect(
        service.comparePassword(mockUser, loginDto),
      ).rejects.toThrow('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    });

    it('should not throw when password matches', async () => {
      jest.mocked(bcrypt.compare).mockResolvedValue(true as never);

      await expect(
        service.comparePassword(mockUser, loginDto),
      ).resolves.toBeUndefined();
    });

    it('should call bcrypt.compare with correct arguments', async () => {
      jest.mocked(bcrypt.compare).mockResolvedValue(true as never);

      await service.comparePassword(mockUser, loginDto);

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password123',
        '$2b$10$hashedpassword',
      );
    });
  });
});
