import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoodEntity } from '../core/entities/food.entity';

const foodsData: Partial<FoodEntity>[] = [
  { id: 'broccoli', name: 'บรอกโคลี', emoji: '🥦', category: 'vegetable', caloriesPer100g: 34 },
  { id: 'carrot', name: 'แครอท', emoji: '🥕', category: 'vegetable', caloriesPer100g: 41 },
  { id: 'spinach', name: 'ผักโขม', emoji: '🌿', category: 'vegetable', caloriesPer100g: 23 },
  { id: 'tomato', name: 'มะเขือเทศ', emoji: '🍅', category: 'vegetable', caloriesPer100g: 18 },
  { id: 'cucumber', name: 'แตงกวา', emoji: '🥒', category: 'vegetable', caloriesPer100g: 16 },
  { id: 'corn', name: 'ข้าวโพด', emoji: '🌽', category: 'vegetable', caloriesPer100g: 86 },
  { id: 'cabbage', name: 'กะหล่ำปลี', emoji: '🥬', category: 'vegetable', caloriesPer100g: 25 },
  { id: 'longbean', name: 'ถั่วฝักยาว', emoji: '🫘', category: 'vegetable', caloriesPer100g: 47 },
  { id: 'mushroom', name: 'เห็ดหอม', emoji: '🍄', category: 'vegetable', caloriesPer100g: 35 },
  { id: 'pumpkin', name: 'ฟักทอง', emoji: '🎃', category: 'vegetable', caloriesPer100g: 26 },
  { id: 'apple', name: 'แอปเปิ้ล', emoji: '🍎', category: 'fruit', caloriesPer100g: 52 },
  { id: 'banana', name: 'กล้วย', emoji: '🍌', category: 'fruit', caloriesPer100g: 89 },
  { id: 'orange', name: 'ส้ม', emoji: '🍊', category: 'fruit', caloriesPer100g: 47 },
  { id: 'grape', name: 'องุ่น', emoji: '🍇', category: 'fruit', caloriesPer100g: 69 },
  { id: 'mango', name: 'มะม่วง', emoji: '🥭', category: 'fruit', caloriesPer100g: 60 },
  { id: 'strawberry', name: 'สตรอว์เบอร์รี่', emoji: '🍓', category: 'fruit', caloriesPer100g: 32 },
  { id: 'watermelon', name: 'แตงโม', emoji: '🍉', category: 'fruit', caloriesPer100g: 30 },
  { id: 'papaya', name: 'มะละกอ', emoji: '🍈', category: 'fruit', caloriesPer100g: 43 },
  { id: 'pineapple', name: 'สับปะรด', emoji: '🍍', category: 'fruit', caloriesPer100g: 50 },
  { id: 'durian', name: 'ทุเรียน', emoji: '🟡', category: 'fruit', caloriesPer100g: 147 },
];

@Injectable()
export class AutoSeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AutoSeedService.name);

  constructor(
    @InjectRepository(FoodEntity)
    private readonly foodRepo: Repository<FoodEntity>,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.foodRepo.count();
    if (count > 0) {
      this.logger.log(`Database already has ${count} food items, skipping seed`);
      return;
    }

    this.logger.log('No food data found — auto-seeding...');
    for (const food of foodsData) {
      await this.foodRepo.save(food);
      this.logger.log(`  Inserted: ${food.name} ${food.emoji}`);
    }
    this.logger.log('Auto-seed completed ✓');
  }
}
