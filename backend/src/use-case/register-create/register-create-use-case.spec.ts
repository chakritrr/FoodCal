import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { IUserRepository, RegisterRequestDto, UserEntity } from 'src/core';
import { RegisterCreateUseCase } from './register-create-use-case';
import { RegisterCreateFactoryService } from './register-create-factory.service';

interface MockQueryRunner {
  connect: jest.Mock;
  startTransaction: jest.Mock;
  commitTransaction: jest.Mock;
  rollbackTransaction: jest.Mock;
  release: jest.Mock;
  manager: {
    save: jest.Mock;
  };
}

describe('RegisterCreateUseCase', () => {
  let useCase: RegisterCreateUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockFactory: jest.Mocked<RegisterCreateFactoryService>;
  let mockQueryRunner: MockQueryRunner;
  let mockDataSource: jest.Mocked<DataSource>;

  const registerDto: RegisterRequestDto = {
    username: 'jane_doe',
    email: 'jane@example.com',
    password: 'securePass123',
  };

  const mockUserEntity: UserEntity = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    username: 'jane_doe',
    email: 'jane@example.com',
    password: '$2b$10$hashed',
    role: 'user',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    mockQueryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        save: jest.fn(),
      },
    };

    mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    } as unknown as jest.Mocked<DataSource>;

    mockUserRepository = {
      findAll: jest.fn(),
      findOneById: jest.fn(),
      findOneByUsername: jest.fn(),
      findOneByEmail: jest.fn(),
      save: jest.fn(),
    };

    mockFactory = {
      createUser: jest.fn(),
      constructResponse: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterCreateUseCase,
        { provide: DataSource, useValue: mockDataSource },
        { provide: IUserRepository, useValue: mockUserRepository },
        { provide: RegisterCreateFactoryService, useValue: mockFactory },
      ],
    }).compile();

    useCase = module.get<RegisterCreateUseCase>(RegisterCreateUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createRegister', () => {
    it('should throw ConflictException when username already exists', async () => {
      mockUserRepository.findOneByUsername.mockResolvedValue(mockUserEntity);

      await expect(useCase.createRegister(registerDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(useCase.createRegister(registerDto)).rejects.toThrow(
        'ชื่อผู้ใช้นี้ถูกใช้งานแล้ว',
      );

      expect(mockUserRepository.findOneByUsername).toHaveBeenCalledWith('jane_doe');
      expect(mockUserRepository.findOneByEmail).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when email already exists', async () => {
      mockUserRepository.findOneByUsername.mockResolvedValue(null);
      mockUserRepository.findOneByEmail.mockResolvedValue(mockUserEntity);

      await expect(useCase.createRegister(registerDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(useCase.createRegister(registerDto)).rejects.toThrow(
        'อีเมลนี้ถูกใช้งานแล้ว',
      );

      expect(mockUserRepository.findOneByEmail).toHaveBeenCalledWith('jane@example.com');
    });

    it('should create query runner and start transaction', async () => {
      mockUserRepository.findOneByUsername.mockResolvedValue(null);
      mockUserRepository.findOneByEmail.mockResolvedValue(null);
      mockFactory.createUser.mockResolvedValue(mockUserEntity);
      mockQueryRunner.manager.save.mockResolvedValue(mockUserEntity);
      mockFactory.constructResponse.mockReturnValue({ id: mockUserEntity.id });

      await useCase.createRegister(registerDto);

      expect(mockDataSource.createQueryRunner).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.connect).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.startTransaction).toHaveBeenCalledTimes(1);
    });

    it('should create user entity via factory and save via queryRunner', async () => {
      mockUserRepository.findOneByUsername.mockResolvedValue(null);
      mockUserRepository.findOneByEmail.mockResolvedValue(null);
      mockFactory.createUser.mockResolvedValue(mockUserEntity);
      mockQueryRunner.manager.save.mockResolvedValue(mockUserEntity);
      mockFactory.constructResponse.mockReturnValue({ id: mockUserEntity.id });

      await useCase.createRegister(registerDto);

      expect(mockFactory.createUser).toHaveBeenCalledWith(registerDto);
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(mockUserEntity);
    });

    it('should commit transaction and return response on success', async () => {
      const expectedResponse = { id: '550e8400-e29b-41d4-a716-446655440001' };

      mockUserRepository.findOneByUsername.mockResolvedValue(null);
      mockUserRepository.findOneByEmail.mockResolvedValue(null);
      mockFactory.createUser.mockResolvedValue(mockUserEntity);
      mockQueryRunner.manager.save.mockResolvedValue(mockUserEntity);
      mockFactory.constructResponse.mockReturnValue(expectedResponse);

      const result = await useCase.createRegister(registerDto);

      expect(mockQueryRunner.commitTransaction).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.rollbackTransaction).not.toHaveBeenCalled();
      expect(result).toEqual(expectedResponse);
    });

    it('should rollback and propagate error when factory.createUser throws', async () => {
      const error = new Error('bcrypt failed');
      mockUserRepository.findOneByUsername.mockResolvedValue(null);
      mockUserRepository.findOneByEmail.mockResolvedValue(null);
      mockFactory.createUser.mockRejectedValue(error);

      await expect(useCase.createRegister(registerDto)).rejects.toThrow(error);

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
    });

    it('should rollback and propagate error when queryRunner.manager.save throws', async () => {
      const error = new Error('DB write failed');
      mockUserRepository.findOneByUsername.mockResolvedValue(null);
      mockUserRepository.findOneByEmail.mockResolvedValue(null);
      mockFactory.createUser.mockResolvedValue(mockUserEntity);
      mockQueryRunner.manager.save.mockRejectedValue(error);

      await expect(useCase.createRegister(registerDto)).rejects.toThrow(error);

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalledTimes(1);
      expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
    });

    it('should release query runner in finally block after success', async () => {
      mockUserRepository.findOneByUsername.mockResolvedValue(null);
      mockUserRepository.findOneByEmail.mockResolvedValue(null);
      mockFactory.createUser.mockResolvedValue(mockUserEntity);
      mockQueryRunner.manager.save.mockResolvedValue(mockUserEntity);
      mockFactory.constructResponse.mockReturnValue({ id: mockUserEntity.id });

      await useCase.createRegister(registerDto);

      expect(mockQueryRunner.release).toHaveBeenCalledTimes(1);
    });

    it('should release query runner in finally block after error', async () => {
      mockUserRepository.findOneByUsername.mockResolvedValue(null);
      mockUserRepository.findOneByEmail.mockResolvedValue(null);
      mockFactory.createUser.mockRejectedValue(new Error('fail'));

      await expect(useCase.createRegister(registerDto)).rejects.toThrow();

      expect(mockQueryRunner.release).toHaveBeenCalledTimes(1);
    });
  });
});
