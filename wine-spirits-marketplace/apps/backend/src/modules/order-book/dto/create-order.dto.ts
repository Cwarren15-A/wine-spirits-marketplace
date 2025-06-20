import { IsEnum, IsString, IsNumber, IsOptional, IsBoolean, IsDateString, Min } from 'class-validator';
import { OrderType } from '../../../entities/order-book-entry.entity';

export class CreateOrderDto {
  @IsString()
  product_id: string;

  @IsString()
  user_id: string;

  @IsEnum(OrderType)
  order_type: OrderType;

  @IsNumber()
  @Min(0.01)
  price: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsDateString()
  expires_at?: Date;

  @IsOptional()
  @IsBoolean()
  age_verified?: boolean = false;

  @IsOptional()
  @IsString()
  shipping_state?: string;

  @IsOptional()
  @IsBoolean()
  accepts_adult_signature?: boolean = true;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  is_anonymous?: boolean = false;
} 