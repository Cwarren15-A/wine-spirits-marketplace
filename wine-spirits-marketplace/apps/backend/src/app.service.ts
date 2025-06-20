import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Wine & Spirits Market Trader API - Phase 3: Marketplace Engine Active';
  }

  getHealthCheck() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Wine & Spirits Marketplace API',
      phase: 'Phase 3: Marketplace Engine',
      version: '1.3.0',
      uptime: process.uptime(),
    };
  }

  getComplianceStatus() {
    return {
      title_transfer: false, // Never takes title per TTB requirements
      escrow_payments: true, // Seller paid first
      age_verification: true, // 21+ verification enabled
      adult_signature: true, // Required for all deliveries
      license_verification: true, // Seller permit validation
      state_compliance: true, // 50-state matrix active
      ttb_circular: '2023-1',
      ca_abc_advisory: '2023-01',
      payment_flow: 'split_payment_compliant',
    };
  }
} 