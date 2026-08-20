import { db } from '@workspace/db';
import { contacts, channels, conversations, organizations } from '@workspace/db';
import { eq, and } from 'drizzle-orm';

/**
 * Standardize phone number to international E.164-like format
 */
export function normalizePhoneNumber(rawPhone: string): string {
  if (!rawPhone) return '';
  let cleaned = rawPhone.replace(/[^\d+]/g, '').trim();

  // Normalize Egyptian numbers
  if (cleaned.startsWith('0020')) {
    cleaned = '+20' + cleaned.slice(4);
  } else if (cleaned.startsWith('20') && !cleaned.startsWith('+20')) {
    cleaned = '+20' + cleaned.slice(2);
  } else if (cleaned.startsWith('01') && cleaned.length === 11) {
    cleaned = '+20' + cleaned.slice(1);
  } else if (!cleaned.startsWith('+') && cleaned.length >= 8) {
    cleaned = '+' + cleaned;
  }

  return cleaned;
}

export interface InboundResolutionResult {
  organizationId: number;
  channelId?: number;
  contactId?: number;
  customerName: string;
  isExistingCustomer: boolean;
  normalizedCaller: string;
  normalizedCallee: string;
}

/**
 * Securely resolves tenant organization, channel, and customer for an inbound phone call.
 * Uses the DID (callee number) to identify the tenant securely.
 */
export async function resolveInboundCallContext(params: {
  callerNumber: string;
  calleeNumber: string;
  inboundOrgIdHint?: number;
}): Promise<InboundResolutionResult> {
  const normalizedCaller = normalizePhoneNumber(params.callerNumber);
  const normalizedCallee = normalizePhoneNumber(params.calleeNumber);

  let organizationId = params.inboundOrgIdHint || 1;
  let channelId: number | undefined;

  // 1. Secure Tenant Resolution via Callee DID Phone Number
  if (normalizedCallee) {
    const allVoiceChannels = await db.select().from(channels)
      .where(and(eq(channels.channelType, 'voice'), eq(channels.isActive, true)));

    const matchedChannel = allVoiceChannels.find(ch => {
      if (!ch.config) return false;
      try {
        const config = typeof ch.config === 'string' ? JSON.parse(ch.config) : ch.config;
        const phone = normalizePhoneNumber(config.phoneNumber || config.did || '');
        return phone === normalizedCallee;
      } catch {
        return false;
      }
    });

    if (matchedChannel) {
      organizationId = matchedChannel.organizationId;
      channelId = matchedChannel.id;
      console.log(`[Voice Resolver] Securely matched DID ${normalizedCallee} to Org #${organizationId} (Channel #${channelId})`);
    }
  }

  // 2. Resolve Contact / Customer by Normalized Caller Phone Number
  let contactId: number | undefined;
  let customerName = 'متصل غير مسجل';
  let isExistingCustomer = false;

  if (normalizedCaller) {
    const [existingContact] = await db.select().from(contacts)
      .where(and(
        eq(contacts.organizationId, organizationId),
        eq(contacts.phone, normalizedCaller)
      ))
      .limit(1);

    if (existingContact) {
      contactId = existingContact.id;
      customerName = `${existingContact.firstName} ${existingContact.lastName}`.trim() || 'عميل مسجل';
      isExistingCustomer = true;
      console.log(`[Voice Resolver] Identified existing customer: ${customerName} (ID: #${contactId})`);
    } else {
      // Clean fallback: Do not create fake garbage data in CRM
      customerName = `متصل (${normalizedCaller.slice(-4)})`;
      console.log(`[Voice Resolver] Caller ${normalizedCaller} is an unidentified new lead.`);
    }
  }

  return {
    organizationId,
    channelId,
    contactId,
    customerName,
    isExistingCustomer,
    normalizedCaller,
    normalizedCallee,
  };
}
