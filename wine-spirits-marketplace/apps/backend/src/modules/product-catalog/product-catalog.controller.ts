import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductCatalogService } from './product-catalog.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductSearchDto } from './dto/product-search.dto';
import { ProductType } from '../../entities/product.entity';

@Controller('products')
export class ProductCatalogController {
  constructor(private readonly productCatalogService: ProductCatalogService) {}

  @Post()
  create(@Body(ValidationPipe) createProductDto: CreateProductDto) {
    return this.productCatalogService.create(createProductDto);
  }

  @Get()
  findAll(@Query(ValidationPipe) searchDto: ProductSearchDto) {
    return this.productCatalogService.findAll(searchDto);
  }

  @Get('search')
  search(@Query(ValidationPipe) searchDto: ProductSearchDto) {
    return this.productCatalogService.findAll(searchDto);
  }

  @Get('taxonomy/varietals/:type')
  getVarietals(@Param('type') type: ProductType) {
    return this.productCatalogService.getVarietals(type);
  }

  @Get('taxonomy/regions')
  getRegions(@Query('type') type?: ProductType) {
    return this.productCatalogService.getRegions(type);
  }

  @Get('taxonomy/vintages')
  getVintages(@Query('type') type?: ProductType) {
    return this.productCatalogService.getVintages(type);
  }

  @Get('taxonomy/producers')
  getProducers(
    @Query('type') type?: ProductType,
    @Query('region') region?: string,
  ) {
    return this.productCatalogService.getProducers(type, region);
  }

  @Get('sku/:sku')
  findBySKU(@Param('sku') sku: string) {
    return this.productCatalogService.findBySKU(sku);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productCatalogService.findOne(id);
  }

  @Get(':id/similar')
  findSimilar(@Param('id') id: string) {
    // This would need the product details to find similar ones
    // Implementation would require getting the product first, then finding similar
    return { message: 'Similar products endpoint - to be implemented' };
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateProductDto: UpdateProductDto,
  ) {
    return this.productCatalogService.update(id, updateProductDto);
  }

  @Patch(':id/inventory')
  updateInventory(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ) {
    return this.productCatalogService.updateInventory(id, quantity);
  }

  @Post(':id/images')
  @UseInterceptors(FilesInterceptor('images', 10))
  uploadImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    // Image upload logic would go here
    // For now, return a placeholder response
    return {
      message: 'Image upload endpoint - to be implemented',
      productId: id,
      fileCount: files?.length || 0,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productCatalogService.remove(id);
  }
} 