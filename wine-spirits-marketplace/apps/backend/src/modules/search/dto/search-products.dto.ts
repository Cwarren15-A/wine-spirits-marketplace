import { IsOptional, IsEnum, IsString, IsNumber, Min, Max } from 'class-validator';
import { ProductType } from '../../../entities/product.entity';

export class SearchProductsDto {
  @IsOptional()
  @IsString()
  query?: string;

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
  @IsString()
  producer?: string;

  @IsOptional()
  @IsNumber()
  @Min(1800)
  @Max(2030)
  vintage?: number;

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
  @Max(5)
  minRating?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  minScore?: number; // Wine Spectator or Parker score

  @IsOptional()
  @IsString()
  tags?: string; // Comma-separated tags

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';

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
  facets?: string; // Comma-separated list of facets to include
} 