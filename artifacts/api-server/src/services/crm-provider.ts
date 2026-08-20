import { db, contacts, notes, deals, organizations } from '@workspace/db';
import { eq, and } from 'drizzle-orm';

export interface CrmContact {
  id?: string | number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  companyName?: string;
}

export interface CrmCallActivity {
  contactId?: string | number;
  phoneNumber: string;
  direction: 'INBOUND' | 'OUTBOUND';
  durationSeconds: number;
  status: 'COMPLETED' | 'MISSED' | 'FAILED';
  summary: string;
  transcript?: string;
  timestamp: Date;
}

export interface CrmDeal {
  id?: string | number;
  contactId?: string | number;
  title: string;
  amount?: number;
  currency?: string;
  stage?: string;
}

export interface CRMProvider {
  readonly id: string;
  readonly name: string;

  findContact(phoneOrEmail: string, orgId: number): Promise<CrmContact | null>;
  createContact(contact: CrmContact, orgId: number): Promise<CrmContact>;
  updateContact(id: string | number, contact: Partial<CrmContact>, orgId: number): Promise<CrmContact>;
  createNote(contactId: string | number, noteText: string, orgId: number): Promise<void>;
  logCallActivity(activity: CrmCallActivity, orgId: number): Promise<{ activityId: string }>;
  createOrUpdateDeal(deal: CrmDeal, orgId: number): Promise<CrmDeal>;
}

/**
 * Built-in Spark Hub Internal CRM Provider
 */
export class SparkHubInternalCrmProvider implements CRMProvider {
  public readonly id = 'spark_hub';
  public readonly name = 'Spark Hub Native CRM';

  public async findContact(phoneOrEmail: string, orgId: number): Promise<CrmContact | null> {
    const [c] = await db.select().from(contacts)
      .where(and(eq(contacts.organizationId, orgId), eq(contacts.phone, phoneOrEmail)))
      .limit(1);

    if (!c) return null;
    return {
      id: c.id,
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.email || undefined,
      phone: c.phone || undefined,
      companyName: c.companyName || undefined,
    };
  }

  public async createContact(contact: CrmContact, orgId: number): Promise<CrmContact> {
    const [created] = await db.insert(contacts).values({
      organizationId: orgId,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      companyName: contact.companyName,
    }).returning();

    return {
      id: created.id,
      firstName: created.firstName,
      lastName: created.lastName,
      email: created.email || undefined,
      phone: created.phone || undefined,
      companyName: created.companyName || undefined,
    };
  }

  public async updateContact(id: string | number, contact: Partial<CrmContact>, orgId: number): Promise<CrmContact> {
    const [updated] = await db.update(contacts).set({
      ...(contact.firstName && { firstName: contact.firstName }),
      ...(contact.lastName && { lastName: contact.lastName }),
      ...(contact.email && { email: contact.email }),
      ...(contact.phone && { phone: contact.phone }),
      ...(contact.companyName && { companyName: contact.companyName }),
      updatedAt: new Date(),
    }).where(and(eq(contacts.id, Number(id)), eq(contacts.organizationId, orgId))).returning();

    return {
      id: updated.id,
      firstName: updated.firstName,
      lastName: updated.lastName,
    };
  }

  public async createNote(contactId: string | number, noteText: string, orgId: number): Promise<void> {
    await db.insert(notes).values({
      organizationId: orgId,
      contactId: Number(contactId),
      content: noteText,
    });
  }

  public async logCallActivity(activity: CrmCallActivity, orgId: number): Promise<{ activityId: string }> {
    if (activity.contactId) {
      await this.createNote(
        activity.contactId,
        `📞 مكالمة صوتية مسجلة (${activity.durationSeconds} ثانية):\n\n${activity.summary}`,
        orgId
      );
    }
    return { activityId: `call_act_${Date.now()}` };
  }

  public async createOrUpdateDeal(deal: CrmDeal, orgId: number): Promise<CrmDeal> {
    if (deal.id) {
      const [updated] = await db.update(deals).set({
        title: deal.title,
        value: deal.amount ? String(deal.amount) : undefined,
        updatedAt: new Date(),
      }).where(and(eq(deals.id, Number(deal.id)), eq(deals.organizationId, orgId))).returning();
      return { id: updated.id, title: updated.title };
    }

    const [created] = await db.insert(deals).values({
      organizationId: orgId,
      contactId: deal.contactId ? Number(deal.contactId) : undefined,
      title: deal.title,
      value: deal.amount ? String(deal.amount) : '0',
      currency: deal.currency || 'EGP',
      status: 'open',
    }).returning();

    return { id: created.id, title: created.title };
  }
}

/**
 * HubSpot CRM API v3 Provider Adapter
 * Syncs Contacts, Calls (Engagements), Notes, and Deals without exposing HubSpot API details to the AI
 */
export class HubSpotCRMProvider implements CRMProvider {
  public readonly id = 'hubspot';
  public readonly name = 'HubSpot CRM (API v3)';
  private apiKey: string;
  private baseUrl = 'https://api.hubapi.com';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.HUBSPOT_API_KEY || '';
  }

  public async findContact(phoneOrEmail: string, orgId: number): Promise<CrmContact | null> {
    if (!this.apiKey) return null;

    try {
      const res = await fetch(`${this.baseUrl}/crm/v3/objects/contacts/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          filterGroups: [{
            filters: [
              { propertyName: 'phone', operator: 'EQ', value: phoneOrEmail }
            ]
          }],
        }),
      });

      if (!res.ok) return null;
      const data = await res.json() as any;
      if (data.results && data.results.length > 0) {
        const item = data.results[0];
        return {
          id: item.id,
          firstName: item.properties.firstname || '',
          lastName: item.properties.lastname || '',
          email: item.properties.email,
          phone: item.properties.phone,
        };
      }
    } catch (err) {
      console.warn('[HubSpot CRM] Search contact failed:', err);
    }
    return null;
  }

  public async createContact(contact: CrmContact, orgId: number): Promise<CrmContact> {
    if (!this.apiKey) return { ...contact, id: `hub_mock_${Date.now()}` };

    try {
      const res = await fetch(`${this.baseUrl}/crm/v3/objects/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          properties: {
            firstname: contact.firstName,
            lastname: contact.lastName,
            email: contact.email,
            phone: contact.phone,
            company: contact.companyName,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json() as any;
        return { ...contact, id: data.id };
      }
    } catch (err) {
      console.warn('[HubSpot CRM] Create contact failed:', err);
    }

    return { ...contact, id: `hub_${Date.now()}` };
  }

  public async updateContact(id: string | number, contact: Partial<CrmContact>, orgId: number): Promise<CrmContact> {
    if (this.apiKey && id) {
      try {
        await fetch(`${this.baseUrl}/crm/v3/objects/contacts/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            properties: {
              ...(contact.firstName && { firstname: contact.firstName }),
              ...(contact.lastName && { lastname: contact.lastName }),
            },
          }),
        });
      } catch (err) {
        console.warn('[HubSpot CRM] Update contact failed:', err);
      }
    }
    return { id, firstName: contact.firstName || '', lastName: contact.lastName || '' };
  }

  public async createNote(contactId: string | number, noteText: string, orgId: number): Promise<void> {
    if (!this.apiKey) return;
    try {
      await fetch(`${this.baseUrl}/crm/v3/objects/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          properties: {
            hs_timestamp: new Date().toISOString(),
            hs_note_body: noteText,
          },
          associations: contactId ? [{
            to: { id: contactId },
            types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 202 }]
          }] : [],
        }),
      });
    } catch (err) {
      console.warn('[HubSpot CRM] Create note failed:', err);
    }
  }

  public async logCallActivity(activity: CrmCallActivity, orgId: number): Promise<{ activityId: string }> {
    const activityId = `hub_call_${Date.now()}`;
    if (!this.apiKey) {
      console.log(`[HubSpot CRM] Logged call activity for ${activity.phoneNumber} (${activity.durationSeconds}s)`);
      return { activityId };
    }

    try {
      const res = await fetch(`${this.baseUrl}/crm/v3/objects/calls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          properties: {
            hs_timestamp: activity.timestamp.toISOString(),
            hs_call_duration: (activity.durationSeconds * 1000).toString(),
            hs_call_direction: activity.direction,
            hs_call_status: activity.status,
            hs_call_body: `ملخص المكالمة بالذكاء الاصطناعي:\n${activity.summary}\n\nنص الحوار:\n${activity.transcript || ''}`,
          },
          associations: activity.contactId ? [{
            to: { id: activity.contactId },
            types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 194 }]
          }] : [],
        }),
      });

      if (res.ok) {
        const data = await res.json() as any;
        return { activityId: data.id || activityId };
      }
    } catch (err) {
      console.warn('[HubSpot CRM] Log call engagement failed:', err);
    }

    return { activityId };
  }

  public async createOrUpdateDeal(deal: CrmDeal, orgId: number): Promise<CrmDeal> {
    if (!this.apiKey) return { ...deal, id: `hub_deal_${Date.now()}` };

    try {
      const res = await fetch(`${this.baseUrl}/crm/v3/objects/deals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          properties: {
            dealname: deal.title,
            amount: deal.amount?.toString() || '0',
            dealstage: deal.stage || 'appointmentscheduled',
          },
          associations: deal.contactId ? [{
            to: { id: deal.contactId },
            types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 3 }]
          }] : [],
        }),
      });

      if (res.ok) {
        const data = await res.json() as any;
        return { ...deal, id: data.id };
      }
    } catch (err) {
      console.warn('[HubSpot CRM] Create deal failed:', err);
    }

    return { ...deal, id: `hub_deal_${Date.now()}` };
  }
}

/**
 * Central CRM Manager with Multi-Tenant Provider Routing
 */
export class CrmManager {
  private providers = new Map<string, CRMProvider>();

  constructor() {
    this.registerProvider(new SparkHubInternalCrmProvider());
    this.registerProvider(new HubSpotCRMProvider());
  }

  public registerProvider(provider: CRMProvider): void {
    this.providers.set(provider.id, provider);
  }

  public getProvider(providerId: string = 'spark_hub'): CRMProvider {
    return this.providers.get(providerId) || this.providers.get('spark_hub')!;
  }
}

export const crmManager = new CrmManager();
