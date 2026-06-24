import * as bcrypt from 'bcrypt';

import { RegisterCreateFactoryService } from './register-create-factory.service';
import { RegisterRequestDto, RegisterResponseDto, UserEntity } from 'src/core';

jest.mock('bcrypt');

describe('RegisterCreateFactoryService', () => {
  let service: RegisterCreateFactoryService;

  const mockDto: RegisterRequestDto = {
    username: 'jane_doe',
    email: 'jane@example.com',
    password: 'securePass123',
  };

  beforeEach(() => {
    service = new RegisterCreateFactoryService();
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should hash password and return a UserEntity', async () => {
      jest.mocked(bcrypt.hash).mockResolvedValue('$2b$10$mockedhash' as never);

      const result = await service.createUser(mockDto);

      expect(result).toBeInstanceOf(UserEntity);
      expect(result.username).toBe('jane_doe');
      expect(result.email).toBe('jane@example.com');
      expect(result.password).toBe('$2b$10$mockedhash');
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
    });

    it('should call bcrypt.hash with password and salt rounds', async () => {
      jest.mocked(bcrypt.hash).mockResolvedValue('$2b$10$mockedhash' as never);

      await service.createUser(mockDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('securePass123', 10);
    });
  });

  describe('constructResponse', () => {
    it('should return RegisterResponseDto with the given id', () => {
      const id = '550e8400-e29b-41d4-a716-446655440001';
      const result = service.constructResponse(id);

      expect(result).toBeInstanceOf(RegisterResponseDto);
      expect(result.id).toBe(id);
    });
  });
});
