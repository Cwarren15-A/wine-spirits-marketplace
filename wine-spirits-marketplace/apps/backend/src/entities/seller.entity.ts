import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Product } from './product.entity';

export enum SellerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING_VERIFICATION = 'pending_verification',
  SUSPENDED = 'suspended'
}

export enum LicenseType {
  WINERY = 'winery',
  DISTILLERY = 'distillery',
  WHOLESALER = 'wholesaler',
  RETAILER = 'retailer',
  IMPORTER = 'importer'
}

@Entity('sellers')
export class Seller {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  business_name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  contact_name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  // License Information (TTB Compliance)
  @Column({ type: 'varchar', length: 50, unique: true })
  ttb_permit_number: string;

  @Column({ type: 'enum', enum: LicenseType })
  license_type: LicenseType;

  @Column({ type: 'date' })
  license_expiration: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state_license_number: string;

  @Column({ type: 'json', nullable: true })
  additional_licenses: Record<string, any>; // State-specific licenses

  // Business Information
  @Column({ type: 'varchar', length: 500, nullable: true })
  business_address: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  state: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  postal_code: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  // Marketplace Profile
  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logo_url: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  website_url: string;

  // Status & Verification
  @Column({ type: 'enum', enum: SellerStatus, default: SellerStatus.PENDING_VERIFICATION })
  status: SellerStatus;

  @Column({ type: 'boolean', default: false })
  is_verified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  verified_at: Date;

  // Stripe Connect (Payment Processing)
  @Column({ type: 'varchar', length: 100, nullable: true })
  stripe_account_id: string;

  @Column({ type: 'boolean', default: false })
  stripe_onboarding_complete: boolean;

  // Marketplace Metrics
  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  seller_rating: number;

  @Column({ type: 'int', default: 0 })
  total_sales: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  total_revenue: number;

  // Shipping & Fulfillment
  @Column({ type: 'json', nullable: true })
  shipping_zones: string[]; // States they can ship to

  @Column({ type: 'boolean', default: true })
  handles_own_shipping: boolean;

  @Column({ type: 'json', nullable: true })
  shipping_methods: Record<string, any>;

  // Relationships
  @OneToMany(() => Product, product => product.seller)
  products: Product[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
} 