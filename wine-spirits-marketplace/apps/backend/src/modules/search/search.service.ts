import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductType, ProductStatus } from '../../entities/product.entity';
import { SearchProductsDto } from './dto/search-products.dto';

export interface SearchResult {
  products: Product[];
  total: number;
  facets: {
    types: Array<{ key: string; count: number }>;
    regions: Array<{ key: string; count: number }>;
    varietals: Array<{ key: string; count: number }>;
    priceRanges: Array<{ key: string; count: number; from?: number; to?: number }>;
    vintages: Array<{ key: string; count: number }>;
    producers: Array<{ key: string; count: number }>;
  };
  suggestions?: string[];
}

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private configService: ConfigService,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async onModuleInit() {
    this.logger.log('Search service initialized (database mode)');
  }

  async searchProducts(searchDto: SearchProductsDto): Promise<SearchResult> {
    try {
      // Database-based search
      return await this.databaseSearch(searchDto);
    } catch (error) {
      this.logger.error('Search query failed', error);
      return {
        products: [],
        total: 0,
        facets: {
          types: [],
          regions: [],
          varietals: [],
          priceRanges: [],
          vintages: [],
          producers: [],
        },
      };
    }
  }

  async getRecommendations(productId: string, userId?: string): Promise<Product[]> {
    try {
      // Get the source product
      const sourceProduct = await this.productRepository.findOne({
        where: { id: productId },
      });

      if (!sourceProduct) {
        return [];
      }

      // Find similar products based on type, region, or producer
      const query = this.productRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.seller', 'seller')
        .where('product.status = :status', { status: ProductStatus.ACTIVE })
        .andWhere('product.id != :productId', { productId })
        .limit(10);

      // Add similarity criteria
      if (sourceProduct.type) {
        query.andWhere('product.type = :type', { type: sourceProduct.type });
      }

      if (sourceProduct.region) {
        query.orWhere('product.region = :region', { region: sourceProduct.region });
      }

      if (sourceProduct.producer) {
        query.orWhere('product.producer = :producer', { producer: sourceProduct.producer });
      }

      return await query.orderBy('product.view_count', 'DESC').getMany();
    } catch (error) {
      this.logger.error('Recommendations query failed', error);
      return [];
    }
  }

  async getAutocompleteSuggestions(query: string, type?: ProductType): Promise<string[]> {
    try {
      // Simple database-based autocomplete
      const queryBuilder = this.productRepository
        .createQueryBuilder('product')
        .where('product.status = :status', { status: ProductStatus.ACTIVE })
        .andWhere('(product.name ILIKE :query OR product.producer ILIKE :query OR product.varietal ILIKE :query)', 
          { query: `%${query}%` });

      if (type) {
        queryBuilder.andWhere('product.type = :type', { type });
      }

      const products = await queryBuilder.limit(10).getMany();
      
      const suggestions = new Set<string>();
      products.forEach(product => {
        if (product.name.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(product.name);
        }
        if (product.producer?.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(product.producer);
        }
        if (product.varietal?.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(product.varietal);
        }
      });

      return Array.from(suggestions).slice(0, 10);
    } catch (error) {
      this.logger.error('Autocomplete query failed', error);
      return [];
    }
  }

  private async databaseSearch(searchDto: SearchProductsDto): Promise<SearchResult> {
    const queryBuilder = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.seller', 'seller')
      .where('product.status = :status', { status: ProductStatus.ACTIVE });

    // Text search
    if (searchDto.query) {
      queryBuilder.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search OR product.tasting_notes ILIKE :search)',
        { search: `%${searchDto.query}%` }
      );
    }

    // Filters
    if (searchDto.type) {
      queryBuilder.andWhere('product.type = :type', { type: searchDto.type });
    }

    if (searchDto.region) {
      queryBuilder.andWhere('product.region ILIKE :region', { region: `%${searchDto.region}%` });
    }

    if (searchDto.varietal) {
      queryBuilder.andWhere('product.varietal ILIKE :varietal', { varietal: `%${searchDto.varietal}%` });
    }

    if (searchDto.producer) {
      queryBuilder.andWhere('product.producer ILIKE :producer', { producer: `%${searchDto.producer}%` });
    }

    if (searchDto.vintage) {
      queryBuilder.andWhere('product.vintage = :vintage', { vintage: searchDto.vintage });
    }

    if (searchDto.minPrice && searchDto.maxPrice) {
      queryBuilder.andWhere('product.base_price BETWEEN :minPrice AND :maxPrice', {
        minPrice: searchDto.minPrice,
        maxPrice: searchDto.maxPrice,
      });
    } else if (searchDto.minPrice) {
      queryBuilder.andWhere('product.base_price >= :minPrice', { minPrice: searchDto.minPrice });
    } else if (searchDto.maxPrice) {
      queryBuilder.andWhere('product.base_price <= :maxPrice', { maxPrice: searchDto.maxPrice });
    }

    if (searchDto.minRating) {
      queryBuilder.andWhere('product.average_rating >= :minRating', { minRating: searchDto.minRating });
    }

    // Sorting
    if (searchDto.sortBy) {
      const order = searchDto.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      queryBuilder.orderBy(`product.${searchDto.sortBy}`, order);
    } else {
      queryBuilder.orderBy('product.view_count', 'DESC')
                  .addOrderBy('product.created_at', 'DESC');
    }

    // Pagination
    if (searchDto.limit) {
      queryBuilder.limit(searchDto.limit);
    }

    if (searchDto.offset) {
      queryBuilder.offset(searchDto.offset);
    }

    const [products, total] = await queryBuilder.getManyAndCount();

    // Generate facets
    const facets = await this.generateFacets(searchDto);

    return {
      products,
      total,
      facets,
    };
  }

  private async generateFacets(searchDto: SearchProductsDto): Promise<SearchResult['facets']> {
    // Types facet
    const typesQuery = this.productRepository
      .createQueryBuilder('product')
      .select('product.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('product.status = :status', { status: ProductStatus.ACTIVE })
      .groupBy('product.type');

    const types = await typesQuery.getRawMany();

    // Regions facet
    const regionsQuery = this.productRepository
      .createQueryBuilder('product')
      .select('product.region', 'region')
      .addSelect('COUNT(*)', 'count')
      .where('product.status = :status', { status: ProductStatus.ACTIVE })
      .andWhere('product.region IS NOT NULL')
      .groupBy('product.region')
      .orderBy('count', 'DESC')
      .limit(10);

    const regions = await regionsQuery.getRawMany();

    // Varietals facet
    const varietalsQuery = this.productRepository
      .createQueryBuilder('product')
      .select('product.varietal', 'varietal')
      .addSelect('COUNT(*)', 'count')
      .where('product.status = :status', { status: ProductStatus.ACTIVE })
      .andWhere('product.varietal IS NOT NULL')
      .groupBy('product.varietal')
      .orderBy('count', 'DESC')
      .limit(10);

    const varietals = await varietalsQuery.getRawMany();

    // Price ranges facet (simplified)
    const priceRanges = [
      { key: 'Under $25', count: 0 },
      { key: '$25-$50', count: 0 },
      { key: '$50-$100', count: 0 },
      { key: '$100-$250', count: 0 },
      { key: 'Over $250', count: 0 },
    ];

    // Vintages facet
    const vintagesQuery = this.productRepository
      .createQueryBuilder('product')
      .select('product.vintage', 'vintage')
      .addSelect('COUNT(*)', 'count')
      .where('product.status = :status', { status: ProductStatus.ACTIVE })
      .andWhere('product.vintage IS NOT NULL')
      .groupBy('product.vintage')
      .orderBy('product.vintage', 'DESC')
      .limit(10);

    const vintages = await vintagesQuery.getRawMany();

    // Producers facet
    const producersQuery = this.productRepository
      .createQueryBuilder('product')
      .select('product.producer', 'producer')
      .addSelect('COUNT(*)', 'count')
      .where('product.status = :status', { status: ProductStatus.ACTIVE })
      .andWhere('product.producer IS NOT NULL')
      .groupBy('product.producer')
      .orderBy('count', 'DESC')
      .limit(10);

    const producers = await producersQuery.getRawMany();

    return {
      types: types.map(item => ({ key: item.type, count: parseInt(item.count) })),
      regions: regions.map(item => ({ key: item.region, count: parseInt(item.count) })),
      varietals: varietals.map(item => ({ key: item.varietal, count: parseInt(item.count) })),
      priceRanges,
      vintages: vintages.map(item => ({ key: item.vintage.toString(), count: parseInt(item.count) })),
      producers: producers.map(item => ({ key: item.producer, count: parseInt(item.count) })),
    };
  }
} 