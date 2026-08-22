import { db, channels, contacts, conversations, messages, deals } from '@workspace/db';
import { eq, and } from 'drizzle-orm';

export interface SallaOrder {
  id: string | number;
  referenceId: string;
  status: {
    name: string;
    slug: string;
  };
  customer: {
    name: string;
    mobile: string;
    email?: string;
    city?: string;
  };
  total: {
    amount: number;
    currency: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    sku?: string;
  }>;
  shipment?: {
    courierName: string;
    trackingNumber: string;
    trackingUrl?: string;
  };
  createdAt: string;
}

export interface SallaProduct {
  id: string | number;
  name: string;
  price: number;
  currency: string;
  quantity: number;
  isAvailable: boolean;
  sku?: string;
  url?: string;
}

export class SallaService {
  private baseUrl = 'https://api.salla.dev/admin/v2';

  /**
   * Retrieves active Salla API credentials for the tenant organization
   */
  private async getSallaConfig(organizationId: number): Promise<{ accessToken: string; merchantId?: string } | null> {
    const [channel] = await db.select().from(channels)
      .where(and(eq(channels.organizationId, organizationId), eq(channels.provider, 'salla')))
      .limit(1);

    if (!channel || !channel.config) {
      // Return env fallback if configured for single-store testing
      if (process.env.SALLA_ACCESS_TOKEN) {
        return { accessToken: process.env.SALLA_ACCESS_TOKEN };
      }
      return null;
    }

    try {
      const creds = JSON.parse(channel.config);
      return {
        accessToken: creds.accessToken || creds.token,
        merchantId: creds.merchantId,
      };
    } catch {
      return null;
    }
  }

  /**
   * Fetches live order details by Order ID, Reference ID, or Customer Mobile
   */
  public async getOrderDetails(organizationId: number, query: { orderId?: string; mobile?: string }): Promise<SallaOrder | null> {
    const config = await this.getSallaConfig(organizationId);

    // If live Salla token is not yet connected by user, generate realistic mock payload for immediate test
    if (!config?.accessToken) {
      return this.getMockSallaOrder(query.orderId || '78912', query.mobile || '+966501234567');
    }

    try {
      let endpoint = `${this.baseUrl}/orders`;
      if (query.orderId) {
        endpoint = `${this.baseUrl}/orders/${query.orderId}`;
      } else if (query.mobile) {
        endpoint = `${this.baseUrl}/orders?keyword=${encodeURIComponent(query.mobile)}`;
      }

      const res = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Accept': 'application/json',
        },
      });

      if (!res.ok) return null;
      const data = await res.json() as any;
      const order = data.data?.id ? data.data : (data.data?.[0] || null);
      if (!order) return null;

      return {
        id: order.id,
        referenceId: order.reference_id || String(order.id),
        status: {
          name: order.status?.name || 'قيد المعالجة',
          slug: order.status?.customized?.slug || order.status?.slug || 'in_progress',
        },
        customer: {
          name: `${order.customer?.first_name || ''} ${order.customer?.last_name || ''}`.trim() || 'عميل سلة',
          mobile: order.customer?.mobile || '',
          email: order.customer?.email,
          city: order.shipping?.address?.city,
        },
        total: {
          amount: Number(order.amounts?.total?.amount || order.total?.amount || 0),
          currency: order.amounts?.total?.currency || 'SAR',
        },
        items: (order.items || []).map((it: any) => ({
          name: it.name,
          quantity: it.quantity,
          price: Number(it.amounts?.price_without_tax?.amount || it.price?.amount || 0),
          sku: it.sku,
        })),
        shipment: order.shipment?.courier_name ? {
          courierName: order.shipment.courier_name,
          trackingNumber: order.shipment.tracking_number,
          trackingUrl: order.shipment.tracking_link,
        } : undefined,
        createdAt: order.date?.date || new Date().toISOString(),
      };
    } catch (err) {
      console.warn('[Salla Service] Failed to fetch live Salla order:', err);
      return null;
    }
  }

  /**
   * Checks product availability and stock in Salla catalog
   */
  public async checkProductInventory(organizationId: number, productNameOrSku: string): Promise<SallaProduct[]> {
    const config = await this.getSallaConfig(organizationId);

    if (!config?.accessToken) {
      return [{
        id: 'prod_101',
        name: productNameOrSku,
        price: 199,
        currency: 'SAR',
        quantity: 14,
        isAvailable: true,
        sku: 'SKU-SALLA-01',
      }];
    }

    try {
      const res = await fetch(`${this.baseUrl}/products?keyword=${encodeURIComponent(productNameOrSku)}`, {
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Accept': 'application/json',
        },
      });

      if (!res.ok) return [];
      const data = await res.json() as any;
      return (data.data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price?.amount || 0),
        currency: p.price?.currency || 'SAR',
        quantity: p.quantity || 0,
        isAvailable: Boolean(p.is_available && (p.quantity > 0 || p.quantity === null)),
        sku: p.sku,
        url: p.urls?.customer,
      }));
    } catch (err) {
      console.warn('[Salla Service] Product search error:', err);
      return [];
    }
  }

  /**
   * Generates a discount coupon in Salla for abandoned cart recovery or special deals
   */
  public async createDiscountCoupon(organizationId: number, discountPercent: number = 10): Promise<{ code: string; expiry: string }> {
    const code = `SPARK${discountPercent}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const expiry = new Date(Date.now() + 48 * 3600 * 1000).toISOString().split('T')[0];

    const config = await this.getSallaConfig(organizationId);
    if (!config?.accessToken) {
      return { code, expiry };
    }

    try {
      await fetch(`${this.baseUrl}/coupons`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `خصم ذكي ${discountPercent}%`,
          code: code,
          type: 'percentage',
          amount: discountPercent,
          expiry_date: expiry,
          free_shipping: false,
        }),
      });
    } catch (err) {
      console.warn('[Salla Service] Failed to create live coupon in Salla:', err);
    }

    return { code, expiry };
  }

  /**
   * Processes Inbound Salla Webhook Events
   */
  public async handleSallaWebhook(event: string, payload: any, organizationId: number): Promise<void> {
    console.log(`[Salla Webhook] Received event [${event}] for Org #${organizationId}`);

    switch (event) {
      case 'order.created': {
        const order = payload.data || payload;
        const customerPhone = order.customer?.mobile;
        const customerName = `${order.customer?.first_name || ''} ${order.customer?.last_name || ''}`.trim();
        const total = `${order.amounts?.total?.amount || order.total || 0} SAR`;

        // Sync to internal CRM deals
        await db.insert(deals).values({
          organizationId,
          title: `طلب سلة #${order.reference_id || order.id} (${customerName})`,
          value: String(order.amounts?.total?.amount || 0),
          currency: 'SAR',
          status: 'open',
        });
        break;
      }

      case 'abandoned.cart': {
        // Abandoned cart recovery event
        const cart = payload.data || payload;
        console.log(`[Salla Webhook] Triggering smart abandoned cart recovery for cart #${cart.id}`);
        break;
      }

      default:
        break;
    }
  }

  private getMockSallaOrder(orderId: string, mobile: string): SallaOrder {
    return {
      id: orderId,
      referenceId: orderId,
      status: {
        name: 'جاري التوصيل مع المندوب',
        slug: 'delivering',
      },
      customer: {
        name: 'سعد العتيبي',
        mobile: mobile,
        city: 'الرياض',
      },
      total: {
        amount: 285,
        currency: 'SAR',
      },
      items: [
        { name: 'عطر الفخامة الملكي 100 مل', quantity: 1, price: 235 },
        { name: 'تغليف هدايا فاخر', quantity: 1, price: 50 },
      ],
      shipment: {
        courierName: 'سمسا إكسبريس (SMSA)',
        trackingNumber: 'SMSA-984210985',
        trackingUrl: 'https://track.smsaexpress.com/track/SMSA-984210985',
      },
      createdAt: new Date().toISOString(),
    };
  }
}

export const sallaService = new SallaService();
