import { IsEnum, IsString, IsNumber, IsOptional, IsBoolean, IsArray, IsUrl, Min, Max, Length } from 'class-validator';
import { ProductType } from '../../../entities/product.entity';

export class CreateProductDto {
  @IsString()
  @Length(1, 255)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(ProductType)
  type: ProductType;

  // Wine/Spirits Taxonomy
  @IsOptional()
  @IsString()
  @Length(1, 100)
  varietal?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  region?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  appellation?: string;

  @IsOptional()
  @IsNumber()
  @Min(1800)
  @Max(2030)
  vintage?: number;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  producer?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(95)
  alcohol_content?: number;

  @IsOptional()
  @IsNumber()
  @Min(50)
  volume_ml?: number = 750;

  // Pricing & Inventory
  @IsNumber()
  @Min(0.01)
  base_price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  inventory_count?: number = 0;

  @IsOptional()
  @IsBoolean()
  allow_offers?: boolean = true;

  // Compliance
  @IsOptional()
  shipping_restrictions?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  requires_adult_signature?: boolean = true;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  ttb_cola?: string;

  // Images & Media
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];

  @IsOptional()
  @IsUrl()
  primary_image_url?: string;

  // Additional Details
  @IsOptional()
  @IsString()
  tasting_notes?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  food_pairings?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  @Length(1, 50)
  bottle_size?: string;

  @IsOptional()
  @IsString()
  @Length(1, 13)
  upc?: string;

  // Seller Information
  @IsString()
  seller_id: string;
} 