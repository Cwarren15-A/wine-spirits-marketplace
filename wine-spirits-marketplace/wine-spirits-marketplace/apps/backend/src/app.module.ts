import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Phase 3 Modules
import { ProductCatalogModule } from './modules/product-catalog/product-catalog.module';
import { OrderBookModule } from './modules/order-book/order-book.module';
import { SearchModule } from './modules/search/search.module';

// Entities
import { Product } from './entities/product.entity';
import { Seller } from './entities/seller.entity';
import { OrderBookEntry } from './entities/order-book-entry.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'password'),
        database: configService.get('DB_NAME', 'wine_marketplace'),
        entities: [Product, Seller, OrderBookEntry],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
        // Compliance: Enable SSL for production
        ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
      }),
      inject: [ConfigService],
    }),
    // Phase 3: Marketplace Engine Modules
    ProductCatalogModule,
    OrderBookModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} 