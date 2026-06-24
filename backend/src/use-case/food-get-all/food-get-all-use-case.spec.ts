import { Test, TestingModule } from '@nestjs/testing';

import { IFoodRepository, GetFoodQueryDto, FoodEntity, GetFoodResponseDto } from 'src/core';
import { FoodGetAllUseCase } from './food-get-all-use-case';
import { FoodGetAllFactoryService } from './food-get-all-factory.service';

describe('FoodGetAllUseCase', () => {
  let useCase: FoodGetAllUseCase;
  let mockFoodRepository: jest.Mocked<IFoodRepository>;
  let mockFactory: {
    constructResponse: jest.Mock;
    constructPaginatedResponse: jest.Mock;
  };

  const mockFoodEntities: FoodEntity[] = [
    {
      id: 'broccoli',
      name: 'บรอกโคลี',
      emoji: '🥦',
      category: 'vegetable',
      caloriesPer100g: 34,
    },
    {
      id: 'apple',
      name: 'แอปเปิ้ล',
      emoji: '🍎',
      category: 'fruit',
      caloriesPer100g: 52,
    },
  ];

  beforeEach(async () => {
    mockFoodRepository = {
      findAll: jest.fn(),
      findOneById: jest.fn(),
      findByCategory: jest.fn(),
      findPaginated: jest.fn(),
    };

    mockFactory = {
      constructResponse: jest.fn(),
      constructPaginatedResponse: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FoodGetAllUseCase,
        { provide: IFoodRepository, useValue: mockFoodRepository },
        { provide: FoodGetAllFactoryService, useValue: mockFactory },
      ],
    }).compile();

    useCase = module.get<FoodGetAllUseCase>(FoodGetAllUseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllFood', () => {
    it('should call repository.findAll() and factory.constructResponse()', async () => {
      const mockDtos: GetFoodResponseDto[] = [
        {
          id: 'broccoli',
          name: 'บรอกโคลี',
          emoji: '🥦',
          category: 'vegetable',
          caloriesPer100g: 34,
        },
      ];

      mockFoodRepository.findAll.mockResolvedValue(mockFoodEntities);
      mockFactory.constructResponse.mockReturnValue(mockDtos);

      const result = await useCase.getAllFood();

      expect(mockFoodRepository.findAll).toHaveBeenCalledTimes(1);
      expect(mockFactory.constructResponse).toHaveBeenCalledWith(mockFoodEntities);
      expect(result).toEqual(mockDtos);
    });

    it('should return empty array when no foods exist', async () => {
      mockFoodRepository.findAll.mockResolvedValue([]);
      mockFactory.constructResponse.mockReturnValue([]);

      const result = await useCase.getAllFood();

      expect(result).toEqual([]);
    });
  });

  describe('getAllFoodPaginated', () => {
    const query: GetFoodQueryDto = { page: 1, limit: 8, category: 'vegetable' };

    it('should call repository.findPaginated() with correct params', async () => {
      mockFoodRepository.findPaginated.mockResolvedValue([mockFoodEntities, 2]);
      mockFactory.constructPaginatedResponse.mockReturnValue({
        data: [],
        total: 2,
        page: 1,
        limit: 8,
        totalPages: 1,
      });

      await useCase.getAllFoodPaginated(query);

      expect(mockFoodRepository.findPaginated).toHaveBeenCalledWith(1, 8, 'vegetable');
    });

    it('should call factory.constructPaginatedResponse() with correct args', async () => {
      mockFoodRepository.findPaginated.mockResolvedValue([mockFoodEntities, 2]);
      mockFactory.constructPaginatedResponse.mockReturnValue({
        data: [],
        total: 2,
        page: 1,
        limit: 8,
        totalPages: 1,
      });

      await useCase.getAllFoodPaginated(query);

      expect(mockFactory.constructPaginatedResponse).toHaveBeenCalledWith(
        mockFoodEntities,
        2,
        1,
        8,
      );
    });

    it('should return the paginated response from factory', async () => {
      const expectedResponse = {
        data: [
          {
            id: 'broccoli',
            name: 'บรอกโคลี',
            emoji: '🥦',
            category: 'vegetable',
            caloriesPer100g: 34,
          },
        ],
        total: 2,
        page: 1,
        limit: 8,
        totalPages: 1,
      };

      mockFoodRepository.findPaginated.mockResolvedValue([mockFoodEntities, 2]);
      mockFactory.constructPaginatedResponse.mockReturnValue(expectedResponse);

      const result = await useCase.getAllFoodPaginated(query);
      expect(result).toEqual(expectedResponse);
    });

    it('should work without category filter', async () => {
      const queryNoCategory: GetFoodQueryDto = { page: 2, limit: 5, category: undefined };

      mockFoodRepository.findPaginated.mockResolvedValue([mockFoodEntities, 10]);
      mockFactory.constructPaginatedResponse.mockReturnValue({
        data: [],
        total: 10,
        page: 2,
        limit: 5,
        totalPages: 2,
      });

      await useCase.getAllFoodPaginated(queryNoCategory);

      expect(mockFoodRepository.findPaginated).toHaveBeenCalledWith(2, 5, undefined);
    });
  });
});
