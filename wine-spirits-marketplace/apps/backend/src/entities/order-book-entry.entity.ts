import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, Index } from 'typeorm';
import { Product } from './product.entity';

export enum OrderType {
  BID = 'bid',
  ASK = 'ask'
}

export enum OrderStatus {
  ACTIVE = 'active',
  PARTIALLY_FILLED = 'partially_filled',
  FILLED = 'filled',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired'
}

@Entity('order_book_entries')
@Index(['product_id', 'order_type', 'price'])
@Index(['status', 'created_at'])
@Index(['expires_at'])
export class OrderBookEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  product_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'enum', enum: OrderType })
  order_type: OrderType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int', default: 0 })
  filled_quantity: number;

  @Column({ type: 'int' })
  remaining_quantity: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.ACTIVE })
  status: OrderStatus;

  // Time-based priority
  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  expires_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  filled_at: Date;

  // Compliance & Verification
  @Column({ type: 'boolean', default: false })
  age_verified: boolean;

  @Column({ type: 'varchar', length: 10, nullable: true })
  shipping_state: string;

  @Column({ type: 'boolean', default: true })
  accepts_adult_signature: boolean;

  // Order Metadata
  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'boolean', default: false })
  is_anonymous: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  average_fill_price: number;

  // Relationships
  @ManyToOne(() => Product, product => product.order_book_entries)
  product: Product;

  @UpdateDateColumn()
  updated_at: Date;
} 