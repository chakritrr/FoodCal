import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsIn, Min } from 'class-validator';

export class GetFoodQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 8 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 8;

  @ApiPropertyOptional({ enum: ['vegetable', 'fruit'] })
  @IsOptional()
  @IsIn(['vegetable', 'fruit'])
  category?: string;
}
