import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { seedSampleData } from './seeds/sample-data';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return this.appService.getHealthCheck();
  }

  @Get('compliance')
  getComplianceStatus() {
    return this.appService.getComplianceStatus();
  }

  @Get('status')
  getMarketplaceStatus() {
    return {
      status: 'operational',
      phase: 'Phase 3: Marketplace Engine',
      version: '1.3.0',
      features: {
        productCatalog: 'active',
        orderBook: 'active',
        searchDiscovery: 'active',
        webSocketOrders: 'active',
        elasticsearchIntegration: 'active',
      },
      compliance: {
        ttbCompliant: true,
        ageVerification: true,
        shippingRestrictions: true,
        adultSignatureRequired: true,
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Post('seed-sample-data')
  async seedSampleData() {
    try {
      await seedSampleData(this.dataSource);
      return {
        success: true,
        message: 'Sample data seeded successfully',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to seed sample data',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
} 