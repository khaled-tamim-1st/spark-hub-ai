import { getToken } from './auth';

async function fetchWithAuth<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${res.status}`);
  }
  if (res.status === 204) {
    return {} as T;
  }
  return res.json();
}

export interface SaaSMetrics {
  totalOrganizations: number;
  activeOrganizations: number;
  suspendedOrganizations: number;
  totalUsers: number;
  totalConversations: number;
  totalMessages: number;
  totalChannels: number;
  planDistribution: Array<{ plan: string; count: number }>;
}

export interface OrganizationTenant {
  id: number;
  name: string;
  slug: string;
  logoUrl?: string | null;
  website?: string | null;
  plan: string;
  status: 'active' | 'suspended' | 'trial' | 'cancelled';
  maxUsers: number;
  maxChannels: number;
  aiEnabled: boolean;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  userCount: number;
  conversationCount: number;
  channelCount: number;
  owner?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

export interface CreateOrgPayload {
  name: string;
  plan: string;
  status: string;
  maxUsers: number;
  maxChannels: number;
  aiEnabled: boolean;
  notes?: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerEmail: string;
  ownerPassword: string;
}

export interface UpdateOrgPayload {
  name?: string;
  plan?: string;
  status?: string;
  maxUsers?: number;
  maxChannels?: number;
  aiEnabled?: boolean;
  notes?: string;
  website?: string;
}

export const adminApi = {
  getMetrics: () => fetchWithAuth<SaaSMetrics>('/api/admin/metrics'),
  getOrganizations: (params?: { search?: string; status?: string; plan?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.plan) searchParams.set('plan', params.plan);
    const qs = searchParams.toString();
    return fetchWithAuth<OrganizationTenant[]>(`/api/admin/organizations${qs ? `?${qs}` : ''}`);
  },
  getOrganization: (id: number) => fetchWithAuth<OrganizationTenant>(`/api/admin/organizations/${id}`),
  createOrganization: (data: CreateOrgPayload) =>
    fetchWithAuth<{ organization: OrganizationTenant; owner: any }>('/api/admin/organizations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateOrganization: (id: number, data: UpdateOrgPayload) =>
    fetchWithAuth<OrganizationTenant>(`/api/admin/organizations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteOrganization: (id: number) =>
    fetchWithAuth<void>(`/api/admin/organizations/${id}`, {
      method: 'DELETE',
    }),
  getMe: () => fetchWithAuth<any>('/api/auth/me'),
};
