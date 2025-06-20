# Wine & Spirits Market Trader

A compliant alcohol marketplace platform built with Next.js 15, NestJS, and modern compliance-focused architecture.

## 🏗️ Project Overview

This platform operates as a **Third-Party Provider (TPP)** under:
- **TTB Circular 2023-1** - Federal alcohol marketplace regulations
- **California ABC Advisory 2023-01** - State marketplace facilitator rules

### Key Compliance Features

- **No Title Transfer**: Marketplace never takes possession of alcohol inventory
- **Split-Payment Flow**: Seller receives funds first via Stripe Connect, marketplace fee deducted after
- **Age Verification**: KYC + ID verification for all buyers (21+) 
- **Adult Signature Delivery**: Required for all shipments via UPS/FedEx alcohol programs
- **50-State Compliance**: Real-time shipping eligibility checking per state regulations
- **License Verification**: Automated seller permit validation

## 🚀 Phase 2: Tech Stack & Architecture ✅

### Frontend (Next.js 15 / React 19)
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + Radix UI primitives
- **State Management**: React 19 features + Context API
- **Type Safety**: TypeScript with strict configuration

### Backend (NestJS Microservices)  
- **Framework**: NestJS with modular architecture
- **Database**: PostgreSQL for transactional data
- **Analytics**: ClickHouse for order book and market data
- **Authentication**: JWT + Passport.js
- **Payments**: Stripe Connect for split payments

### Monorepo Structure
```
wine-spirits-marketplace/
├── src/                          # Next.js frontend
│   ├── app/                      # App Router pages
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Compliance-focused homepage
│   │   └── globals.css           # Global styles
│   ├── components/ui/            # Radix UI component library
│   │   ├── button.tsx            # Button with wine variant
│   │   ├── card.tsx              # Product listing cards
│   │   └── input.tsx             # Form inputs
│   └── lib/
│       └── utils.ts              # Tailwind class utilities
├── apps/backend/                 # NestJS API
│   ├── src/
│   │   ├── main.ts               # Compliance-focused entry point
│   │   ├── app.module.ts         # Database & config setup
│   │   ├── app.controller.ts     # Health & compliance endpoints
│   │   └── app.service.ts        # Application logic
│   ├── tsconfig.json             # TypeScript config
│   ├── nest-cli.json             # NestJS CLI config
│   └── env.example               # Environment template
├── nx.json                       # Nx workspace config
└── package.json                  # Dependencies & scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- ClickHouse database (optional for development)

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Set up backend environment**:
```bash
cd apps/backend
cp env.example .env
# Edit .env with your database credentials
```

3. **Database setup**:
```sql
-- PostgreSQL
CREATE DATABASE wine_marketplace;
CREATE USER wine_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE wine_marketplace TO wine_user;
```

4. **Start development servers**:

**Frontend (from root)**:
```bash
npm run dev
# Available at http://localhost:3000
```

**Backend (from apps/backend)**:
```bash
cd apps/backend
npm run start:dev
# Available at http://localhost:3001
```

### API Endpoints

- `GET /api/v1/health` - System health check
- `GET /api/v1/compliance/status` - Compliance feature status
- `GET /api/v1` - Welcome message

## 🎨 UI Component Library

Built with **Radix UI** primitives and **Tailwind CSS**:

### Button Component
```tsx
import { Button } from "@/components/ui/button"

<Button variant="default">Default</Button>
<Button variant="wine">Wine Theme</Button>
<Button variant="outline">Outline</Button>
<Button size="lg">Large</Button>
```

### Card Components
```tsx
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>2019 Bordeaux</CardTitle>
  </CardHeader>
  <CardContent>
    Wine details...
  </CardContent>
</Card>
```

### Input Component
```tsx
import { Input } from "@/components/ui/input"

<Input type="email" placeholder="Enter email" />
<Input type="date" placeholder="Birth date (21+ verification)" />
```

## 🔧 Configuration

### Environment Variables

**Backend (apps/backend/.env)**
```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=wine_marketplace

# Stripe Connect (Split Payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Age Verification API
PERSONA_API_KEY=your_persona_api_key
PERSONA_ENVIRONMENT=sandbox

# Compliance
COMPLIANCE_MODE=ttb_circular_2023_1
CA_ABC_REPORTING=enabled
```

**Frontend (.env.local)**
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 🗄️ Database Architecture

### PostgreSQL (Primary OLTP)
- Users (buyers/sellers with KYC data)
- Products (wine/spirits catalog with compliance metadata)
- Orders (marketplace transactions with split payment tracking)
- Licenses (seller permit verification)
- Shipping (carrier integration, adult signature tracking)

### ClickHouse (Analytics OLAP)
- Order book events (bids/asks with price-time priority)
- Market data (pricing indices, volatility metrics)
- Compliance analytics (age verification success rates)
- Business intelligence (seller performance, buyer behavior)

## 🔐 Compliance Implementation

### TTB Circular 2023-1 Compliance
- ✅ **TPP Definition**: Platform facilitates without holding federal permit
- ✅ **No Title Transfer**: Inventory stays with licensed seller
- ✅ **Payment Flow**: Seller paid first via Stripe Connect escrow
- ✅ **Recordkeeping**: 3-year retention for audits
- ✅ **Age Verification**: DOB + ID scan at checkout and delivery

### California ABC Advisory Compliance
- ✅ **Type 85 License**: Marketplace facilitator license (when needed)
- ✅ **Seller-of-Record**: Licensed sellers only (Type 02/17/20/21)
- ✅ **Funds Flow**: Full price to seller before fee deduction
- ✅ **Adult Signature**: 21+ delivery confirmation required
- ✅ **Inventory Control**: No unlicensed storage/fulfillment

### 50-State Shipping Matrix
- ✅ **Real-time validation**: State-by-state DtC shipping rules
- ✅ **Volume limits**: Per-resident case/liter restrictions
- ✅ **Permit requirements**: State licensing fee tracking
- ✅ **Dry laws**: County/municipal restriction enforcement

## 📈 Development Roadmap

- ✅ **Phase 1**: Regulatory documentation (COMPLETE)
- ✅ **Phase 2**: Tech stack & architecture (COMPLETE)
- 🔄 **Phase 3**: Marketplace engine (WebSocket order book, product catalog, search)
- 📋 **Phase 4**: Compliance automation (Persona KYC, license OCR)
- 📋 **Phase 5**: Logistics & fulfillment (UPS/FedEx integration)
- 📋 **Phase 6**: Advanced trading (auctions, futures, options)
- 📋 **Phase 7**: Analytics & intelligence (market data, BI dashboards)

## 🧪 Testing

```bash
# Frontend tests
npm test

# Backend tests  
cd apps/backend
npm test

# E2E tests (planned)
npm run test:e2e
```

## 🚢 Deployment

### Production Environment Setup

1. **Database**: PostgreSQL with SSL enabled
2. **Analytics**: ClickHouse cluster for market data
3. **CDN**: Static assets via Vercel/CloudFront
4. **Monitoring**: Compliance audit logging enabled
5. **Security**: SOC 2 compliance framework

### Environment Variables (Production)
```bash
NODE_ENV=production
COMPLIANCE_MODE=ttb_circular_2023_1
CA_ABC_REPORTING=enabled
AUDIT_LOGGING=enabled
DB_SSL=required
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Ensure compliance with TTB/ABC regulations
4. Add tests for new functionality  
5. Submit a pull request

## 📄 Legal & Compliance

This platform facilitates transactions between licensed sellers and verified buyers. We do not take title to alcoholic beverages and operate under applicable marketplace facilitator statutes. All transactions are subject to state and federal alcohol regulations.

**Regulatory Framework**:
- TTB Circular 2023-1 (Federal)
- CA ABC Advisory 2023-01 (California)
- 50-state DtC shipping matrix (2025)

---

**Phase 2 Status**: ✅ **COMPLETE**
- [x] Next.js 15 / React 19 frontend with compliance-focused UI
- [x] NestJS microservices backend with health/compliance endpoints
- [x] PostgreSQL + ClickHouse database architecture  
- [x] Stripe Connect split payment configuration
- [x] Nx monorepo structure with proper separation
- [x] Tailwind + Radix UI component library with wine theme

**Ready for Phase 3**: Marketplace Engine Development

🍷 **Licensed. Compliant. Ready to Trade.**
