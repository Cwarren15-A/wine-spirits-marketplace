import { DataSource } from 'typeorm';
import { Product, ProductType, ProductStatus } from '../entities/product.entity';
import { Seller, SellerStatus, LicenseType } from '../entities/seller.entity';
import { OrderBookEntry, OrderType, OrderStatus } from '../entities/order-book-entry.entity';

export async function seedSampleData(dataSource: DataSource) {
  const sellerRepository = dataSource.getRepository(Seller);
  const productRepository = dataSource.getRepository(Product);
  const orderRepository = dataSource.getRepository(OrderBookEntry);

  // Clear existing data
  await orderRepository.clear();
  await productRepository.clear();
  await sellerRepository.clear();

  console.log('Creating sample sellers...');

  // Create Sample Sellers
  const sellers = await sellerRepository.save([
    {
      business_name: 'Napa Valley Premium Wines',
      contact_name: 'Robert Anderson',
      email: 'robert@napavalleypremium.com',
      phone: '+1-707-555-0101',
      ttb_permit_number: 'CA-WB-23-001',
      license_type: LicenseType.WINERY,
      license_expiration: new Date('2025-12-31'),
      state_license_number: 'CA-ABC-12345',
      business_address: '1234 Vineyard Drive',
      city: 'Napa',
      state: 'CA',
      postal_code: '94558',
      country: 'USA',
      description: 'Family-owned winery producing premium Cabernet Sauvignon and Chardonnay',
      website_url: 'https://napavalleypremium.com',
      status: SellerStatus.ACTIVE,
      is_verified: true,
      verified_at: new Date(),
      shipping_zones: ['CA', 'NY', 'TX', 'FL', 'WA'],
      seller_rating: 4.8,
      total_sales: 156,
      total_revenue: 45230.50,
    },
    {
      business_name: 'Kentucky Bourbon Distillery',
      contact_name: 'James Mitchell',
      email: 'james@kentuckybourbon.com',
      phone: '+1-502-555-0102',
      ttb_permit_number: 'KY-DSP-23-002',
      license_type: LicenseType.DISTILLERY,
      license_expiration: new Date('2025-08-15'),
      state_license_number: 'KY-ABC-67890',
      business_address: '5678 Bourbon Trail',
      city: 'Bardstown',
      state: 'KY',
      postal_code: '40004',
      country: 'USA',
      description: 'Craft distillery specializing in small-batch bourbon and rye whiskey',
      website_url: 'https://kentuckybourbon.com',
      status: SellerStatus.ACTIVE,
      is_verified: true,
      verified_at: new Date(),
      shipping_zones: ['KY', 'TX', 'NY', 'CA', 'FL', 'CO'],
      seller_rating: 4.9,
      total_sales: 89,
      total_revenue: 32150.75,
    },
    {
      business_name: 'Oregon Artisan Wines',
      contact_name: 'Sarah Thompson',
      email: 'sarah@oregonartisan.com',
      phone: '+1-503-555-0103',
      ttb_permit_number: 'OR-WB-23-003',
      license_type: LicenseType.WINERY,
      license_expiration: new Date('2025-10-30'),
      state_license_number: 'OR-OLCC-11111',
      business_address: '9876 Willamette Valley Road',
      city: 'McMinnville',
      state: 'OR',
      postal_code: '97128',
      country: 'USA',
      description: 'Boutique winery focusing on Pinot Noir and sustainable viticulture',
      website_url: 'https://oregonartisan.com',
      status: SellerStatus.ACTIVE,
      is_verified: true,
      verified_at: new Date(),
      shipping_zones: ['OR', 'WA', 'CA', 'ID'],
      seller_rating: 4.7,
      total_sales: 234,
      total_revenue: 67890.25,
    },
  ]);

  console.log('Creating sample products...');

  // Create Sample Products
  const products = await productRepository.save([
    // Napa Valley Wines
    {
      name: '2019 Napa Valley Cabernet Sauvignon Reserve',
      description: 'Rich, full-bodied Cabernet with notes of blackcurrant, cedar, and vanilla. Aged 18 months in French oak.',
      type: ProductType.WINE,
      status: ProductStatus.ACTIVE,
      varietal: 'Cabernet Sauvignon',
      region: 'Napa Valley',
      appellation: 'Napa Valley AVA',
      vintage: 2019,
      producer: 'Napa Valley Premium Wines',
      alcohol_content: 14.5,
      volume_ml: 750,
      sku: 'WN-NV-001-CAB19',
      base_price: 89.99,
      inventory_count: 48,
      tasting_notes: 'Deep ruby color. Aromas of blackcurrant, dark chocolate, and tobacco. Full-bodied with firm tannins and a long finish.',
      food_pairings: ['Grilled steak', 'Aged cheese', 'Dark chocolate'],
      tags: ['premium', 'cellar-worthy', 'limited-production'],
      wine_spectator_score: 92,
      robert_parker_score: 94,
      seller: sellers[0],
      seller_id: sellers[0].id,
    },
    {
      name: '2021 Napa Valley Chardonnay',
      description: 'Elegant Chardonnay with bright acidity and mineral notes. Partial oak aging provides subtle complexity.',
      type: ProductType.WINE,
      status: ProductStatus.ACTIVE,
      varietal: 'Chardonnay',
      region: 'Napa Valley',
      appellation: 'Napa Valley AVA',
      vintage: 2021,
      producer: 'Napa Valley Premium Wines',
      alcohol_content: 13.5,
      volume_ml: 750,
      sku: 'WN-NV-002-CHARD21',
      base_price: 45.99,
      inventory_count: 72,
      tasting_notes: 'Bright golden color. Fresh citrus and stone fruit aromas with hints of vanilla. Crisp acidity and a clean finish.',
      food_pairings: ['Seafood', 'Roasted chicken', 'Soft cheese'],
      tags: ['organic', 'sustainable', 'food-friendly'],
      wine_spectator_score: 89,
      seller: sellers[0],
      seller_id: sellers[0].id,
    },
    // Kentucky Bourbon
    {
      name: 'Small Batch Bourbon Whiskey 12 Year',
      description: 'Hand-selected barrels aged 12 years. Rich caramel and vanilla notes with a smooth finish.',
      type: ProductType.SPIRITS,
      status: ProductStatus.ACTIVE,
      varietal: 'Bourbon',
      region: 'Kentucky',
      producer: 'Kentucky Bourbon Distillery',
      alcohol_content: 46.0,
      volume_ml: 750,
      sku: 'SP-KY-001-BOURB12',
      base_price: 129.99,
      inventory_count: 24,
      tasting_notes: 'Amber color. Sweet vanilla and caramel on the nose. Full-bodied with oak, spice, and honey notes.',
      food_pairings: ['Dark chocolate', 'Grilled meats', 'Aged cigars'],
      tags: ['small-batch', 'aged', 'premium'],
      seller: sellers[1],
      seller_id: sellers[1].id,
    },
    {
      name: 'Rye Whiskey Single Barrel',
      description: 'Single barrel rye whiskey with bold spice and fruit notes. Each bottle is unique.',
      type: ProductType.SPIRITS,
      status: ProductStatus.ACTIVE,
      varietal: 'Rye Whiskey',
      region: 'Kentucky',
      producer: 'Kentucky Bourbon Distillery',
      alcohol_content: 50.0,
      volume_ml: 750,
      sku: 'SP-KY-002-RYE',
      base_price: 95.99,
      inventory_count: 18,
      tasting_notes: 'Golden amber. Spicy rye and dried fruit aromas. Bold palate with pepper, cinnamon, and cherry notes.',
      food_pairings: ['Spicy foods', 'BBQ', 'Sharp cheese'],
      tags: ['single-barrel', 'limited', 'craft'],
      seller: sellers[1],
      seller_id: sellers[1].id,
    },
    // Oregon Wines
    {
      name: '2020 Willamette Valley Pinot Noir',
      description: 'Elegant Pinot Noir showcasing the terroir of Willamette Valley. Sustainable farming practices.',
      type: ProductType.WINE,
      status: ProductStatus.ACTIVE,
      varietal: 'Pinot Noir',
      region: 'Willamette Valley',
      appellation: 'Willamette Valley AVA',
      vintage: 2020,
      producer: 'Oregon Artisan Wines',
      alcohol_content: 13.0,
      volume_ml: 750,
      sku: 'WN-OR-001-PINOT20',
      base_price: 38.99,
      inventory_count: 96,
      tasting_notes: 'Bright ruby color. Red cherry and earth aromas. Medium-bodied with silky tannins and bright acidity.',
      food_pairings: ['Salmon', 'Duck', 'Mushroom dishes'],
      tags: ['sustainable', 'organic', 'biodynamic'],
      wine_spectator_score: 91,
      seller: sellers[2],
      seller_id: sellers[2].id,
    },
    {
      name: '2015 Bordeaux First Growth (Investment Grade)',
      description: 'Rare investment-grade Bordeaux from a prestigious château. Perfect for collectors.',
      type: ProductType.WINE,
      status: ProductStatus.ACTIVE,
      varietal: 'Bordeaux Blend',
      region: 'Bordeaux',
      appellation: 'Pauillac',
      vintage: 2015,
      producer: 'Château Premium',
      alcohol_content: 14.0,
      volume_ml: 750,
      sku: 'WN-BX-001-FG15',
      base_price: 449.99,
      inventory_count: 12,
      tasting_notes: 'Deep purple. Complex aromas of cassis, graphite, and violet. Full-bodied with exceptional structure.',
      food_pairings: ['Prime beef', 'Game meats', 'Aged cheese'],
      tags: ['investment-grade', 'first-growth', 'collectible'],
      wine_spectator_score: 98,
      robert_parker_score: 100,
      seller: sellers[0], // Sold through Napa seller as authorized distributor
      seller_id: sellers[0].id,
    },
  ]);

  console.log('Creating sample order book entries...');

  // Create Sample Order Book Entries
  const sampleUserId1 = '550e8400-e29b-41d4-a716-446655440001';
  const sampleUserId2 = '550e8400-e29b-41d4-a716-446655440002';
  const sampleUserId3 = '550e8400-e29b-41d4-a716-446655440003';

  await orderRepository.save([
    // Napa Cabernet - Active orders
    {
      product_id: products[0].id,
      user_id: sampleUserId1,
      order_type: OrderType.BID,
      price: 85.00,
      quantity: 2,
      remaining_quantity: 2,
      status: OrderStatus.ACTIVE,
      age_verified: true,
      shipping_state: 'CA',
      created_at: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    },
    {
      product_id: products[0].id,
      user_id: sampleUserId2,
      order_type: OrderType.ASK,
      price: 92.00,
      quantity: 1,
      remaining_quantity: 1,
      status: OrderStatus.ACTIVE,
      age_verified: true,
      shipping_state: 'NY',
      created_at: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    },
    // Kentucky Bourbon - Active orders
    {
      product_id: products[2].id,
      user_id: sampleUserId3,
      order_type: OrderType.BID,
      price: 125.00,
      quantity: 1,
      remaining_quantity: 1,
      status: OrderStatus.ACTIVE,
      age_verified: true,
      shipping_state: 'TX',
      created_at: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    },
    {
      product_id: products[2].id,
      user_id: sampleUserId1,
      order_type: OrderType.ASK,
      price: 132.00,
      quantity: 1,
      remaining_quantity: 1,
      status: OrderStatus.ACTIVE,
      age_verified: true,
      shipping_state: 'CA',
      created_at: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
    },
    // Oregon Pinot - Recent trade
    {
      product_id: products[4].id,
      user_id: sampleUserId2,
      order_type: OrderType.BID,
      price: 38.50,
      quantity: 3,
      remaining_quantity: 0,
      filled_quantity: 3,
      status: OrderStatus.FILLED,
      age_verified: true,
      shipping_state: 'WA',
      average_fill_price: 38.50,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      filled_at: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    },
    {
      product_id: products[4].id,
      user_id: sampleUserId3,
      order_type: OrderType.ASK,
      price: 38.50,
      quantity: 3,
      remaining_quantity: 0,
      filled_quantity: 3,
      status: OrderStatus.FILLED,
      age_verified: true,
      shipping_state: 'OR',
      average_fill_price: 38.50,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2.5), // 2.5 hours ago
      filled_at: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    },
  ]);

  console.log('Sample data seeded successfully!');
  console.log(`Created ${sellers.length} sellers`);
  console.log(`Created ${products.length} products`);
  console.log('Created sample order book entries');
} 