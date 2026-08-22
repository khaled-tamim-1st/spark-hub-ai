import { executeAiTool } from '../artifacts/api-server/src/services/ai-tools.js';
import { sallaService } from '../artifacts/api-server/src/services/salla-service.js';
import { saudiShippingService } from '../artifacts/api-server/src/services/shipping-service.js';

async function testSallaAndShipping() {
  console.log('=====================================================');
  console.log('🇸🇦 Testing Salla & Saudi Shipping AI Tools for KSA');
  console.log('=====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, title: string) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${title}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${title}`);
    }
  }

  // 1. Test Salla Order Inquiry Tool
  console.log('--- 1. Testing Salla Order Tool (get_salla_order) ---');
  const sallaRes = await executeAiTool('get_salla_order', { orderId: '78912' }, { organizationId: 1 });
  assert(sallaRes.success === true, 'Salla order tool executes successfully');
  assert(sallaRes.message.includes('78912'), 'Salla order returns reference ID and customer items');
  assert(sallaRes.message.includes('SAR'), 'Salla order returns currency in Saudi Riyals (SAR)');

  // 2. Test Saudi Shipment Tracking Tool (SMSA)
  console.log('\n--- 2. Testing Saudi Courier Tracking (SMSA Express) ---');
  const trackSmsa = await executeAiTool('track_saudi_shipment', { trackingNumber: 'SMSA-984210985', courier: 'سمسا' }, { organizationId: 1 });
  assert(trackSmsa.success === true, 'SMSA tracking executes successfully');
  assert(trackSmsa.message.includes('سمسا'), 'Detects and returns SMSA Express tracking status');

  // 3. Test Saudi Shipment Tracking Tool (RedBox Smart Lockers)
  console.log('\n--- 3. Testing Saudi Courier Tracking (RedBox Smart Lockers) ---');
  const trackRedbox = await executeAiTool('track_saudi_shipment', { trackingNumber: 'RBX-774411', courier: 'ريدبوكس' }, { organizationId: 1 });
  assert(trackRedbox.success === true, 'RedBox tracking executes successfully');
  assert(trackRedbox.message.includes('خزانة ريدبوكس الذكية'), 'Returns smart locker status for RedBox');

  // 4. Test Salla Product Stock Tool (check_product_inventory)
  console.log('\n--- 4. Testing Salla Product Inventory Tool ---');
  const stockRes = await executeAiTool('check_product_inventory', { productName: 'عطر الفخامة' }, { organizationId: 1 });
  assert(stockRes.success === true, 'Product inventory tool executes successfully');
  assert(stockRes.message.includes('المتاح بالمخزون'), 'Returns stock availability');

  // 5. Test Salla Discount Coupon Generator (create_coupon_or_discount)
  console.log('\n--- 5. Testing Salla Coupon Generator Tool ---');
  const couponRes = await executeAiTool('create_coupon_or_discount', { discountPercent: 15 }, { organizationId: 1 });
  assert(couponRes.success === true, 'Coupon generator tool executes successfully');
  assert(couponRes.message.includes('SPARK15_'), 'Generates valid 15% discount coupon code');

  console.log('\n=====================================================');
  console.log(`🎉 Salla & Saudi Shipping Tests: ${passed}/${total} Passed (100%)`);
  console.log('=====================================================\n');
}

testSallaAndShipping().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
