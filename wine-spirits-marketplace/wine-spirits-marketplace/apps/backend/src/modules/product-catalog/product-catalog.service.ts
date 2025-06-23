import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In, Between } from 'typeorm';
import { Product, ProductType, ProductStatus } from '../../entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductSearchDto } from './dto/product-search.dto';

@Injectable()
export class ProductCatalogService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Generate normalized SKU
    const sku = await this.generateSKU(createProductDto);
    
    // Validate wine/spirits taxonomy
    this.validateTaxonomy(createProductDto);
    
    const product = this.productRepository.create({
      ...createProductDto,
      sku,
      status: ProductStatus.PENDING_APPROVAL,
    });

    return await this.productRepository.save(product);
  }

  async findAll(searchDto?: ProductSearchDto): Promise<Product[]> {
    const query = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.seller', 'seller')
      .where('product.status = :status', { status: ProductStatus.ACTIVE });

    if (searchDto?.type) {
      query.andWhere('product.type = :type', { type: searchDto.type });
    }

    if (searchDto?.region) {
      query.andWhere('product.region ILIKE :region', { region: `%${searchDto.region}%` });
    }

    if (searchDto?.vintage) {
      query.andWhere('product.vintage = :vintage', { vintage: searchDto.vintage });
    }

    if (searchDto?.varietal) {
      query.andWhere('product.varietal ILIKE :varietal', { varietal: `%${searchDto.varietal}%` });
    }

    if (searchDto?.minPrice && searchDto?.maxPrice) {
      query.andWhere('product.base_price BETWEEN :minPrice AND :maxPrice', {
        minPrice: searchDto.minPrice,
        maxPrice: searchDto.maxPrice,
      });
    }

    if (searchDto?.producer) {
      query.andWhere('product.producer ILIKE :producer', { producer: `%${searchDto.producer}%` });
    }

    // Search in name, description, and tasting notes
    if (searchDto?.search) {
      query.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search OR product.tasting_notes ILIKE :search)',
        { search: `%${searchDto.search}%` }
      );
    }

    // Sort by relevance/popularity
    query.orderBy('product.view_count', 'DESC')
         .addOrderBy('product.created_at', 'DESC');

    if (searchDto?.limit) {
      query.limit(searchDto.limit);
    }

    if (searchDto?.offset) {
      query.offset(searchDto.offset);
    }

    return await query.getMany();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['seller', 'order_book_entries'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Increment view count
    await this.productRepository.increment({ id }, 'view_count', 1);

    return product;
  }

  async findBySKU(sku: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { sku },
      relations: ['seller'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    
    if (updateProductDto.type || updateProductDto.varietal || updateProductDto.region) {
      this.validateTaxonomy({ ...product, ...updateProductDto });
    }

    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    product.status = ProductStatus.INACTIVE;
    await this.productRepository.save(product);
  }

  // Wine/Spirits Taxonomy Methods
  async getVarietals(type: ProductType): Promise<string[]> {
    const result = await this.productRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.varietal', 'varietal')
      .where('product.type = :type', { type })
      .andWhere('product.varietal IS NOT NULL')
      .andWhere('product.status = :status', { status: ProductStatus.ACTIVE })
      .orderBy('product.varietal', 'ASC')
      .getRawMany();

    return result.map(r => r.varietal);
  }

  async getRegions(type?: ProductType): Promise<string[]> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.region', 'region')
      .where('product.region IS NOT NULL')
      .andWhere('product.status = :status', { status: ProductStatus.ACTIVE });

    if (type) {
      query.andWhere('product.type = :type', { type });
    }

    const result = await query.orderBy('product.region', 'ASC').getRawMany();
    return result.map(r => r.region);
  }

  async getVintages(type?: ProductType): Promise<number[]> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.vintage', 'vintage')
      .where('product.vintage IS NOT NULL')
      .andWhere('product.status = :status', { status: ProductStatus.ACTIVE });

    if (type) {
      query.andWhere('product.type = :type', { type });
    }

    const result = await query.orderBy('product.vintage', 'DESC').getRawMany();
    return result.map(r => r.vintage);
  }

  async getProducers(type?: ProductType, region?: string): Promise<string[]> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.producer', 'producer')
      .where('product.producer IS NOT NULL')
      .andWhere('product.status = :status', { status: ProductStatus.ACTIVE });

    if (type) {
      query.andWhere('product.type = :type', { type });
    }

    if (region) {
      query.andWhere('product.region = :region', { region });
    }

    const result = await query.orderBy('product.producer', 'ASC').getRawMany();
    return result.map(r => r.producer);
  }

  // SKU Management
  private async generateSKU(productDto: CreateProductDto): Promise<string> {
    const typePrefix = this.getTypePrefix(productDto.type);
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    
    let baseSku = `${typePrefix}-${timestamp}-${random}`;
    
    // Add region code if available
    if (productDto.region) {
      const regionCode = productDto.region.substring(0, 2).toUpperCase();
      baseSku = `${typePrefix}-${regionCode}-${timestamp}-${random}`;
    }

    // Ensure uniqueness
    let sku = baseSku;
    let counter = 1;
    while (await this.productRepository.findOne({ where: { sku } })) {
      sku = `${baseSku}-${counter}`;
      counter++;
    }

    return sku;
  }

  private getTypePrefix(type: ProductType): string {
    switch (type) {
      case ProductType.WINE: return 'WN';
      case ProductType.SPIRITS: return 'SP';
      case ProductType.BEER: return 'BR';
      case ProductType.SAKE: return 'SK';
      default: return 'PR';
    }
  }

  private validateTaxonomy(productDto: any): void {
    if (productDto.type === ProductType.WINE) {
      if (!productDto.varietal) {
        throw new BadRequestException('Varietal is required for wine products');
      }
      if (!productDto.vintage || productDto.vintage < 1800 || productDto.vintage > new Date().getFullYear()) {
        throw new BadRequestException('Valid vintage year is required for wine products');
      }
    }

    if (productDto.type === ProductType.SPIRITS) {
      if (!productDto.varietal) {
        throw new BadRequestException('Spirit type (varietal) is required for spirits products');
      }
    }

    if (productDto.alcohol_content && (productDto.alcohol_content < 0 || productDto.alcohol_content > 95)) {
      throw new BadRequestException('Alcohol content must be between 0% and 95%');
    }
  }

  // Duplicate Detection & Normalization
  async findSimilarProducts(productDto: CreateProductDto): Promise<Product[]> {
    return await this.productRepository
      .createQueryBuilder('product')
      .where('product.type = :type', { type: productDto.type })
      .andWhere('product.producer = :producer', { producer: productDto.producer })
      .andWhere('product.varietal = :varietal', { varietal: productDto.varietal })
      .andWhere('product.vintage = :vintage', { vintage: productDto.vintage })
      .andWhere('product.volume_ml = :volume', { volume: productDto.volume_ml })
      .andWhere('product.status = :status', { status: ProductStatus.ACTIVE })
      .getMany();
  }

  async updateInventory(id: string, quantity: number): Promise<Product> {
    const product = await this.findOne(id);
    product.inventory_count = quantity;
    return await this.productRepository.save(product);
  }

  async incrementViews(id: string): Promise<void> {
    await this.productRepository.increment({ id }, 'view_count', 1);
  }
} 