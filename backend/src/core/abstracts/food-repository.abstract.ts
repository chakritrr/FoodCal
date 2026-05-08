import { FoodEntity } from '../entities';

export abstract class IFoodRepository {
  abstract findAll(): Promise<FoodEntity[]>;
  abstract findOneById(id: string): Promise<FoodEntity>;
  abstract findByCategory(category: string): Promise<FoodEntity[]>;
  abstract findPaginated(page: number, limit: number, category?: string): Promise<[FoodEntity[], number]>;
}
