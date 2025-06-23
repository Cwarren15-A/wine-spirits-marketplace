import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, Index } from 'typeorm';
import { Seller } from './seller.entity';
import { OrderBookEntry } from './order-book-entry.entity';

export enum ProductType {
  WINE = 'wine',
  SPIRITS = 'spirits',
  BEER = 'beer',
  SAKE = 'sake'
}

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING_APPROVAL = 'pending_approval',
  COMPLIANCE_REVIEW = 'compliance_review'
}

@Entity('products')
@Index(['type', 'region', 'vintage'])
@Index(['status', 'created_at'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ProductType })
  type: ProductType;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.PENDING_APPROVAL })
  status: ProductStatus;

  // Wine/Spirits Taxonomy
  @Column({ type: 'varchar', length: 100, nullable: true })
  varietal: string; // Cabernet Sauvignon, Bourbon, etc.

  @Column({ type: 'varchar', length: 100, nullable: true })
  region: string; // Napa Valley, Kentucky, etc.

  @Column({ type: 'varchar', length: 100, nullable: true })
  appellation: string; // AVA for wines

  @Column({ type: 'int', nullable: true })
  vintage: number; // Year for wines, age for spirits

  @Column({ type: 'varchar', length: 100, nullable: true })
  producer: string; // Winery/Distillery name

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  alcohol_content: number; // ABV percentage

  @Column({ type: 'int', default: 750 })
  volume_ml: number; // Bottle size in ml

  // SKU Management
  @Column({ type: 'varchar', length: 100, unique: true })
  sku: string;

  @Column({ type: 'varchar', length: 13, nullable: true })
  upc: string; // Universal Product Code

  @Column({ type: 'varchar', length: 50, nullable: true })
  bottle_size: string; // 750ml, 1.5L, etc.

  // Pricing & Inventory
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  base_price: number;

  @Column({ type: 'int', default: 0 })
  inventory_count: number;

  @Column({ type: 'boolean', default: true })
  allow_offers: boolean;

  // Compliance & Shipping
  @Column({ type: 'json', nullable: true })
  shipping_restrictions: Record<string, any>; // State-by-state restrictions

  @Column({ type: 'boolean', default: true })
  requires_adult_signature: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true })
  ttb_cola: string; // TTB Certificate of Label Approval

  // Images & Media
  @Column({ type: 'json', nullable: true })
  images: string[]; // Array of image URLs

  @Column({ type: 'varchar', length: 500, nullable: true })
  primary_image_url: string;

  // Ratings & Reviews
  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  average_rating: number;

  @Column({ type: 'int', default: 0 })
  rating_count: number;

  @Column({ type: 'int', nullable: true })
  wine_spectator_score: number;

  @Column({ type: 'int', nullable: true })
  robert_parker_score: number;

  // Search & Discovery
  @Column({ type: 'text', nullable: true })
  tasting_notes: string;

  @Column({ type: 'json', nullable: true })
  food_pairings: string[];

  @Column({ type: 'json', nullable: true })
  tags: string[]; // organic, biodynamic, limited_edition

  // Marketplace Data
  @Column({ type: 'int', default: 0 })
  view_count: number;

  @Column({ type: 'int', default: 0 })
  favorite_count: number;

  @Column({ type: 'timestamp', nullable: true })
  last_sold_at: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  last_sold_price: number;

  // Relationships
  @ManyToOne(() => Seller, seller => seller.products)
  seller: Seller;

  @Column({ type: 'uuid' })
  seller_id: string;

  @OneToMany(() => OrderBookEntry, entry => entry.product)
  order_book_entries: OrderBookEntry[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 