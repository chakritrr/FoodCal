import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'food' })
export class FoodEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  emoji: string;

  @Column()
  category: string;

  @Column({ type: 'float' })
  caloriesPer100g: number;
}
