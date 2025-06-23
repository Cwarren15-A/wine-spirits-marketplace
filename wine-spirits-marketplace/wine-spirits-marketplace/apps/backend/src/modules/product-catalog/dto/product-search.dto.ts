import { IsOptional, IsEnum, IsString, IsNumber, Min, Max } from 'class-validator';
import { ProductType } from '../../../entities/product.entity';

export class ProductSearchDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ProductType)
  type?: ProductType;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  varietal?: string;

  @IsOptional()
  @IsNumber()
  @Min(1800)
  @Max(2030)
  vintage?: number;

  @IsOptional()
  @IsString()
  producer?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(95)
  minAlcohol?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(95)
  maxAlcohol?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 50;

  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number = 0;

  @IsOptional()
  @IsString()
  sortBy?: string = 'created_at';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
} 