import { ApiProperty } from '@nestjs/swagger';

export class GetFoodResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  emoji: string;

  @ApiProperty()
  category: string;

  @ApiProperty()
  caloriesPer100g: number;
}
