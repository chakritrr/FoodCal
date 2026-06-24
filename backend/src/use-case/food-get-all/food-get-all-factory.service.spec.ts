import { FoodGetAllFactoryService } from './food-get-all-factory.service';
import { FoodEntity, GetFoodPaginatedResponseDto } from 'src/core';

describe('FoodGetAllFactoryService', () => {
  let service: FoodGetAllFactoryService;

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

  beforeEach(() => {
    service = new FoodGetAllFactoryService();
  });

  describe('constructResponse', () => {
    it('should map FoodEntity[] to GetFoodResponseDto[]', () => {
      const result = service.constructResponse(mockFoodEntities);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'broccoli',
        name: 'บรอกโคลี',
        emoji: '🥦',
        category: 'vegetable',
        caloriesPer100g: 34,
      });
      expect(result[1]).toEqual({
        id: 'apple',
        name: 'แอปเปิ้ล',
        emoji: '🍎',
        category: 'fruit',
        caloriesPer100g: 52,
      });
    });

    it('should return empty array when given empty array', () => {
      const result = service.constructResponse([]);
      expect(result).toEqual([]);
    });
  });

  describe('constructPaginatedResponse', () => {
    it('should map entities with pagination metadata', () => {
      const result = service.constructPaginatedResponse(mockFoodEntities, 10, 1, 8);

      expect(result.data).toHaveLength(2);
      expect(result.data[0].id).toBe('broccoli');
      expect(result.data[1].id).toBe('apple');
      expect(result.total).toBe(10);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(8);
      expect(result.totalPages).toBe(2); // Math.ceil(10 / 8)
    });

    it('should compute totalPages as 1 when total equals limit', () => {
      const result = service.constructPaginatedResponse(mockFoodEntities, 8, 1, 8);
      expect(result.totalPages).toBe(1);
    });

    it('should compute totalPages as 0 when total is 0', () => {
      const result = service.constructPaginatedResponse([], 0, 1, 8);
      expect(result.totalPages).toBe(0);
    });

    it('should return an instance of GetFoodPaginatedResponseDto', () => {
      const result = service.constructPaginatedResponse(mockFoodEntities, 10, 2, 5);
      expect(result).toBeInstanceOf(GetFoodPaginatedResponseDto);
    });
  });
});
