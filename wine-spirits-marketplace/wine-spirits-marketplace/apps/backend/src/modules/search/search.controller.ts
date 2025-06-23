import {
  Controller,
  Get,
  Query,
  Param,
  ValidationPipe,
} from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchProductsDto } from './dto/search-products.dto';
import { ProductType } from '../../entities/product.entity';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('products')
  searchProducts(@Query(ValidationPipe) searchDto: SearchProductsDto) {
    return this.searchService.searchProducts(searchDto);
  }

  @Get('autocomplete')
  getAutocompleteSuggestions(
    @Query('q') query: string,
    @Query('type') type?: ProductType,
  ) {
    return this.searchService.getAutocompleteSuggestions(query, type);
  }

  @Get('recommendations/:productId')
  getRecommendations(
    @Param('productId') productId: string,
    @Query('userId') userId?: string,
  ) {
    return this.searchService.getRecommendations(productId, userId);
  }
} 