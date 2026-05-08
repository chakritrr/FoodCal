import { ApiProperty } from '@nestjs/swagger';
import { GetFoodResponseDto } from './get-food-response.dto';

export class GetFoodPaginatedResponseDto {
  @ApiProperty({ type: [GetFoodResponseDto] })
  data: GetFoodResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
