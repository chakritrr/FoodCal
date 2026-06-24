import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

import { IUserRepository, LoginRequestDto, UserEntity } from 'src/core';
import { LoginCreateUseCase } from './login-create-use-case';
import { LoginCreateFactoryService } from './login-create-factory.service';

describe('LoginCreateUseCase', () => {
  let useCase: LoginCreateUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockJwtService: jest.Mocked<JwtService>;
  let mockFactory: jest.Mocked<LoginCreateFactoryService>;

  const mockUser: UserEntity = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    username: 'john_doe',
    email: 'john@example.com',
    password: '$2b$10$hashedpassword',
    role: 'user',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const loginDto: LoginRequestDto = {
    username: 'john_doe',
    password: 'password123',
  };

  beforeEach(async () => {
    mockUserRepository = {
      findAll: jest.fn(),
      findOneById: jest.fn(),
      findOneByUsername: jest.fn(),
      findOneByEmail: jest.fn(),
      save: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    mockFactory = {
      comparePassword: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginCreateUseCase,
        { provide: JwtService, useValue: mockJwtService },
        { provide: IUserRepository, useValue: mockUserRepository },
        { provide: LoginCreateFactoryService, useValue: mockFactory },
      ],
    }).compile();

    useCase = module.get<LoginCreateUseCase>(LoginCreateUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loginCreate', () => {
    it('should look up user by username', async () => {
      mockUserRepository.findOneByUsername.mockResolvedValue(mockUser);
      mockFactory.comparePassword.mockResolvedValue(undefined);
      mockJwtService.sign.mockReturnValue('jwt-token');

      await useCase.loginCreate(loginDto);

      expect(mockUserRepository.findOneByUsername).toHaveBeenCalledWith('john_doe');
    });

    it('should compare password via factory', async () => {
      mockUserRepository.findOneByUsername.mockResolvedValue(mockUser);
      mockFactory.comparePassword.mockResolvedValue(undefined);
      mockJwtService.sign.mockReturnValue('jwt-token');

      await useCase.loginCreate(loginDto);

      expect(mockFactory.comparePassword).toHaveBeenCalledWith(mockUser, loginDto);
    });

    it('should sign a JWT with email and sub (user id)', async () => {
      mockUserRepository.findOneByUsername.mockResolvedValue(mockUser);
      mockFactory.comparePassword.mockResolvedValue(undefined);
      mockJwtService.sign.mockReturnValue('jwt-token');

      await useCase.loginCreate(loginDto);

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: 'john@example.com',
        sub: '550e8400-e29b-41d4-a716-446655440000',
      });
    });

    it('should return the token from JwtService', async () => {
      mockUserRepository.findOneByUsername.mockResolvedValue(mockUser);
      mockFactory.comparePassword.mockResolvedValue(undefined);
      mockJwtService.sign.mockReturnValue('signed-jwt-token');

      const result = await useCase.loginCreate(loginDto);

      expect(result).toEqual({ token: 'signed-jwt-token' });
    });

    it('should propagate error when user is not found (factory throws)', async () => {
      mockUserRepository.findOneByUsername.mockResolvedValue(null);
      mockFactory.comparePassword.mockRejectedValue(
        new Error('ไม่พบผู้ใช้งาน'),
      );

      await expect(useCase.loginCreate(loginDto)).rejects.toThrow('ไม่พบผู้ใช้งาน');
    });

    it('should propagate error when password is invalid (factory throws)', async () => {
      mockUserRepository.findOneByUsername.mockResolvedValue(mockUser);
      mockFactory.comparePassword.mockRejectedValue(
        new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'),
      );

      await expect(useCase.loginCreate(loginDto)).rejects.toThrow(
        'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
      );
    });
  });
});
