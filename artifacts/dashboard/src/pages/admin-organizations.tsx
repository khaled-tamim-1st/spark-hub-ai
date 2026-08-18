import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  adminApi, 
  fetchWithAuth,
  OrganizationTenant, 
  CreateOrgPayload, 
  UpdateOrgPayload 
} from '@/lib/admin-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { StatCard } from '@/components/stat-card';
import { EmptyState } from '@/components/empty-state';
import { 
  Building2, 
  Users, 
  MessageSquare, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Zap, 
  RefreshCw,
  Sliders,
  Bot,
  Loader2
} from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const PLAN_BADGES: Record<string, { label: string; className: string }> = {
  free: { label: 'Free', className: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300' },
  starter: { label: 'Starter', className: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
  pro: { label: 'Pro', className: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300' },
  enterprise: { label: 'Enterprise', className: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
};

const STATUS_BADGES: Record<string, { label: string; icon: any; className: string }> = {
  active: { label: 'Active', icon: CheckCircle2, className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
  suspended: { label: 'Suspended', icon: XCircle, className: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300' },
  trial: { label: 'Trial', icon: Sparkles, className: 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300' },
  cancelled: { label: 'Cancelled', icon: ShieldAlert, className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
};

export default function AdminOrganizations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<OrganizationTenant | null>(null);

  // Form states
  const [createForm, setCreateForm] = useState<CreateOrgPayload>({
    name: '',
    plan: 'starter',
    status: 'active',
    maxUsers: 5,
    maxChannels: 2,
    aiEnabled: true,
    notes: '',
    ownerFirstName: '',
    ownerLastName: '',
    ownerEmail: '',
    ownerPassword: '',
  });

  const [editForm, setEditForm] = useState<UpdateOrgPayload>({
    name: '',
    plan: 'starter',
    status: 'active',
    maxUsers: 5,
    maxChannels: 2,
    aiEnabled: true,
    notes: '',
  });

  // Queries
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: adminApi.getMetrics,
  });

  const { data: orgs, isLoading: orgsLoading, refetch } = useQuery({
    queryKey: ['admin-organizations', search, statusFilter, planFilter],
    queryFn: () => adminApi.getOrganizations({ search, status: statusFilter, plan: planFilter }),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: adminApi.createOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-organizations'] });
      queryClient.invalidateQueries({ queryKey: ['admin-metrics'] });
      setIsCreateOpen(false);
      setCreateForm({
        name: '',
        plan: 'starter',
        status: 'active',
        maxUsers: 5,
        maxChannels: 2,
        aiEnabled: true,
        notes: '',
        ownerFirstName: '',
        ownerLastName: '',
        ownerEmail: '',
        ownerPassword: '',
      });
      toast({ title: 'Company registered', description: 'Tenant company and owner account created successfully.' });
    },
    onError: (err: Error) => {
      toast({ title: 'Failed to create company', description: err.message, variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateOrgPayload }) =>
      adminApi.updateOrganization(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-organizations'] });
      queryClient.invalidateQueries({ queryKey: ['admin-metrics'] });
      setEditingOrg(null);
      toast({ title: 'Company updated', description: 'Tenant settings saved successfully.' });
    },
    onError: (err: Error) => {
      toast({ title: 'Update failed', description: err.message, variant: 'destructive' });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      adminApi.updateOrganization(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-organizations'] });
      queryClient.invalidateQueries({ queryKey: ['admin-metrics'] });
      toast({ title: 'Status updated' });
    },
    onError: (err: Error) => {
      toast({ title: 'Failed to update status', description: err.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-organizations'] });
      queryClient.invalidateQueries({ queryKey: ['admin-metrics'] });
      toast({ title: 'Company deleted' });
    },
    onError: (err: Error) => {
      toast({ title: 'Delete failed', description: err.message, variant: 'destructive' });
    },
  });

  const [aiConfigOrg, setAiConfigOrg] = useState<OrganizationTenant | null>(null);
  const [aiConfigForm, setAiConfigForm] = useState({
    provider: 'ollama',
    model: 'llama3',
    baseUrl: 'http://localhost:11434',
    apiKey: '',
    maxTokens: 1000,
    temperature: 0.7,
    autoReply: true,
  });
  const [loadingAi, setLoadingAi] = useState(false);
  const [discoveredModels, setDiscoveredModels] = useState<string[]>([]);
  const [fetchingModels, setFetchingModels] = useState(false);

  const handleFetchModels = async () => {
    if (!aiConfigForm.apiKey && aiConfigForm.provider !== 'ollama') {
      toast({ title: 'API Key Required', description: 'Please enter an API key first.', variant: 'destructive' });
      return;
    }
    setFetchingModels(true);
    try {
      const res = await fetchWithAuth<{ models: string[] }>('/api/ai-settings/fetch-models', {
        method: 'POST',
        body: JSON.stringify({ provider: aiConfigForm.provider, apiKey: aiConfigForm.apiKey }),
      });
      setDiscoveredModels(res.models || []);
      if (res.models && res.models.length > 0) {
        toast({ title: 'Models Discovered', description: `Found ${res.models.length} active models on your account!` });
      }
    } catch (err: any) {
      toast({ title: 'Failed to fetch models', description: err.message, variant: 'destructive' });
    } finally {
      setFetchingModels(false);
    }
  };

  const handleOpenAiConfig = async (org: OrganizationTenant) => {
    setAiConfigOrg(org);
    setLoadingAi(true);
    setDiscoveredModels([]);
    try {
      const data = await adminApi.getOrgAiSettings(org.id);
      setAiConfigForm({
        provider: data.provider || 'ollama',
        model: data.model || 'llama3',
        baseUrl: data.baseUrl || (data.provider === 'openai' ? 'https://api.openai.com' : 'http://localhost:11434'),
        apiKey: data.apiKey || '',
        maxTokens: data.maxTokens || 1000,
        temperature: data.temperature ?? 0.7,
        autoReply: data.autoReply ?? true,
      });
    } catch {
      // fallback
    } finally {
      setLoadingAi(false);
    }
  };

  const updateAiMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      adminApi.updateOrgAiSettings(id, data),
    onSuccess: () => {
      setAiConfigOrg(null);
      toast({ title: 'AI Model & Provider Configured', description: 'Updated AI model for tenant.' });
    },
    onError: (err: Error) => {
      toast({ title: 'Failed to configure AI', description: err.message, variant: 'destructive' });
    }
  });

  const handleOpenEdit = (org: OrganizationTenant) => {
    setEditingOrg(org);
    setEditForm({
      name: org.name,
      plan: org.plan,
      status: org.status,
      maxUsers: org.maxUsers,
      maxChannels: org.maxChannels,
      aiEnabled: org.aiEnabled,
      notes: org.notes || '',
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrg) return;
    updateMutation.mutate({ id: editingOrg.id, data: editForm });
  };

  const handleDeleteOrg = (org: OrganizationTenant) => {
    if (confirm(`Are you sure you want to completely delete "${org.name}" and all its users and data?`)) {
      deleteMutation.mutate(org.id);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-background">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Building2 className="w-7 h-7 text-primary" />
            SaaS Tenant Organizations
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Global management portal: monitor subscribers, plans, resource quotas, and activate/suspend companies.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
          <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Add New Company
          </Button>
        </div>
      </div>

      {/* SaaS Global Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tenant Companies"
          value={metricsLoading ? '...' : (metrics?.totalOrganizations ?? 0)}
          icon={Building2}
          description={`${metrics?.activeOrganizations ?? 0} active, ${metrics?.suspendedOrganizations ?? 0} suspended`}
        />
        <StatCard
          title="Total Users / Agents"
          value={metricsLoading ? '...' : (metrics?.totalUsers ?? 0)}
          icon={Users}
          description="Across all registered organizations"
        />
        <StatCard
          title="Total Conversations"
          value={metricsLoading ? '...' : (metrics?.totalConversations ?? 0)}
          icon={MessageSquare}
          description={`${metrics?.totalMessages ?? 0} messages processed`}
        />
        <StatCard
          title="Active Channels"
          value={metricsLoading ? '...' : (metrics?.totalChannels ?? 0)}
          icon={Zap}
          description="WhatsApp & Web chat connected"
        />
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-card border border-border rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search company by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-36">
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Plans" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="starter">Starter</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-36">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {orgsLoading ? (
          <div className="p-12 text-center text-muted-foreground">Loading organizations...</div>
        ) : !orgs || orgs.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No Companies Found"
            description="No tenant companies match your filter criteria or none have registered yet."
            action={{
              label: 'Create First Company',
              onClick: () => setIsCreateOpen(true),
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-xs border-b border-border">
                <tr>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Owner Account</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Members (Usage)</th>
                  <th className="px-4 py-3">Channels</th>
                  <th className="px-4 py-3">AI Support</th>
                  <th className="px-4 py-3">Registered</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orgs.map((org) => {
                  const planInfo = PLAN_BADGES[org.plan] || PLAN_BADGES.free;
                  const statusInfo = STATUS_BADGES[org.status] || STATUS_BADGES.active;
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr key={org.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">
                        <div className="font-semibold">{org.name}</div>
                        <div className="text-xs text-muted-foreground">{org.slug}</div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {org.owner ? (
                          <div>
                            <div className="text-foreground font-medium">
                              {org.owner.firstName} {org.owner.lastName}
                            </div>
                            <div className="text-xs">{org.owner.email}</div>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">No owner</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={planInfo.className}>
                          {planInfo.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className={`gap-1 ${statusInfo.className}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-foreground">{org.userCount}</span>
                        <span className="text-muted-foreground"> / {org.maxUsers} max</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-foreground">{org.channelCount}</span>
                        <span className="text-muted-foreground"> / {org.maxChannels} max</span>
                      </td>
                      <td className="px-4 py-3">
                        {org.aiEnabled ? (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            Enabled
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-zinc-100 text-zinc-600">
                            Disabled
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {formatDateTime(org.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Quick Toggle Status */}
                          <Button
                            variant="ghost"
                            size="sm"
                            title={org.status === 'active' ? 'Suspend Company' : 'Activate Company'}
                            onClick={() =>
                              toggleStatusMutation.mutate({
                                id: org.id,
                                status: org.status === 'active' ? 'suspended' : 'active',
                              })
                            }
                            className={org.status === 'active' ? 'text-amber-600 hover:text-amber-700' : 'text-emerald-600 hover:text-emerald-700'}
                          >
                            {org.status === 'active' ? 'Suspend' : 'Activate'}
                          </Button>

                          {/* Edit Details & Quota */}
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Edit Plan & Quota"
                            onClick={() => handleOpenEdit(org)}
                          >
                            <Sliders className="w-4 h-4 text-primary" />
                          </Button>

                          {/* Configure AI Model & Provider */}
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Configure AI Model & Provider"
                            onClick={() => handleOpenAiConfig(org)}
                            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/50"
                          >
                            <Bot className="w-4 h-4" />
                          </Button>

                          {/* Delete Company */}
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete Company"
                            onClick={() => handleDeleteOrg(org)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Create Company */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Register New Tenant Company
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createMutation.mutate(createForm);
            }}
            className="space-y-4 pt-2"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="orgName">Company Name *</Label>
                <Input
                  id="orgName"
                  placeholder="e.g. Acme Corporation"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Subscription Plan</Label>
                <Select
                  value={createForm.plan}
                  onValueChange={(val) => setCreateForm({ ...createForm, plan: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={createForm.status}
                  onValueChange={(val) => setCreateForm({ ...createForm, status: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxUsers">Max Users / Seats</Label>
                <Input
                  id="maxUsers"
                  type="number"
                  min="1"
                  value={createForm.maxUsers}
                  onChange={(e) => setCreateForm({ ...createForm, maxUsers: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxChannels">Max WhatsApp / Channels</Label>
                <Input
                  id="maxChannels"
                  type="number"
                  min="1"
                  value={createForm.maxChannels}
                  onChange={(e) => setCreateForm({ ...createForm, maxChannels: Number(e.target.value) })}
                />
              </div>

              <div className="col-span-2 flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                <div className="space-y-0.5">
                  <Label>Enable AI Support & Auto-Reply</Label>
                  <p className="text-xs text-muted-foreground">Allow company to use AI Bot & Knowledge Base</p>
                </div>
                <Switch
                  checked={createForm.aiEnabled}
                  onCheckedChange={(checked) => setCreateForm({ ...createForm, aiEnabled: checked })}
                />
              </div>
            </div>

            {/* Owner Details */}
            <div className="border-t pt-4 space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-1">
                <Users className="w-4 h-4 text-primary" /> Company Owner Account
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ownerFirst">First Name *</Label>
                  <Input
                    id="ownerFirst"
                    placeholder="John"
                    value={createForm.ownerFirstName}
                    onChange={(e) => setCreateForm({ ...createForm, ownerFirstName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerLast">Last Name *</Label>
                  <Input
                    id="ownerLast"
                    placeholder="Doe"
                    value={createForm.ownerLastName}
                    onChange={(e) => setCreateForm({ ...createForm, ownerLastName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerEmail">Owner Email *</Label>
                  <Input
                    id="ownerEmail"
                    type="email"
                    placeholder="admin@company.com"
                    value={createForm.ownerEmail}
                    onChange={(e) => setCreateForm({ ...createForm, ownerEmail: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerPass">Owner Password *</Label>
                  <Input
                    id="ownerPass"
                    type="password"
                    placeholder="••••••••"
                    value={createForm.ownerPassword}
                    onChange={(e) => setCreateForm({ ...createForm, ownerPassword: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Company'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Edit Company */}
      <Dialog open={!!editingOrg} onOpenChange={(open) => !open && setEditingOrg(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-primary" />
              Edit Company & Quotas: {editingOrg?.name}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveEdit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="editName">Company Name</Label>
              <Input
                id="editName"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Plan</Label>
                <Select
                  value={editForm.plan}
                  onValueChange={(val) => setEditForm({ ...editForm, plan: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="starter">Starter</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(val) => setEditForm({ ...editForm, status: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editMaxUsers">Max Users / Seats</Label>
                <Input
                  id="editMaxUsers"
                  type="number"
                  min="1"
                  value={editForm.maxUsers}
                  onChange={(e) => setEditForm({ ...editForm, maxUsers: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="editMaxChannels">Max Channels</Label>
                <Input
                  id="editMaxChannels"
                  type="number"
                  min="1"
                  value={editForm.maxChannels}
                  onChange={(e) => setEditForm({ ...editForm, maxChannels: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
              <div className="space-y-0.5">
                <Label>AI Features & Knowledge Base</Label>
                <p className="text-xs text-muted-foreground">Toggle AI auto-reply for this company</p>
              </div>
              <Switch
                checked={editForm.aiEnabled}
                onCheckedChange={(checked) => setEditForm({ ...editForm, aiEnabled: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editNotes">Internal Admin Notes</Label>
              <Input
                id="editNotes"
                placeholder="Notes about custom agreement, contract, etc."
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={() => setEditingOrg(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Configure AI Model & Provider for Tenant */}
      <Dialog open={!!aiConfigOrg} onOpenChange={(open) => !open && setAiConfigOrg(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-600" />
              Configure AI Model & Provider: {aiConfigOrg?.name}
            </DialogTitle>
          </DialogHeader>
          {loadingAi ? (
            <div className="py-8 text-center text-sm text-muted-foreground">Loading AI configuration...</div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!aiConfigOrg) return;
                updateAiMutation.mutate({ id: aiConfigOrg.id, data: aiConfigForm });
              }}
              className="space-y-4 pt-2"
            >
              <div className="space-y-2">
                <Label>AI Provider</Label>
                <Select
                  value={aiConfigForm.provider}
                  onValueChange={(v) => {
                    let defaultBaseUrl = aiConfigForm.baseUrl;
                    let defaultModel = aiConfigForm.model;
                    if (v === 'openai') { defaultBaseUrl = 'https://api.openai.com'; defaultModel = 'gpt-4o-mini'; }
                    else if (v === 'groq') { defaultBaseUrl = 'https://api.groq.com/openai'; defaultModel = 'llama-3.3-70b-versatile'; }
                    else if (v === 'deepseek') { defaultBaseUrl = 'https://api.deepseek.com'; defaultModel = 'deepseek-chat'; }
                    else if (v === 'openrouter') { defaultBaseUrl = 'https://openrouter.ai/api'; defaultModel = 'anthropic/claude-3.5-sonnet'; }
                    else if (v === 'ollama') { defaultBaseUrl = 'http://localhost:11434'; defaultModel = 'llama3'; }
                    setAiConfigForm(p => ({ ...p, provider: v, baseUrl: defaultBaseUrl, model: defaultModel }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI (GPT-4o, GPT-4o-mini)</SelectItem>
                    <SelectItem value="groq">Groq (Ultra-Fast LLaMA 3.3, Mixtral)</SelectItem>
                    <SelectItem value="deepseek">DeepSeek (DeepSeek V3 / R1)</SelectItem>
                    <SelectItem value="openrouter">OpenRouter (Multi-Model Hub)</SelectItem>
                    <SelectItem value="ollama">Ollama (Local VPS)</SelectItem>
                    <SelectItem value="openai_compat">Custom OpenAI-Compatible API</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Model Name</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleFetchModels}
                    disabled={fetchingModels}
                    className="h-6 text-[11px] text-primary hover:text-primary px-2"
                  >
                    {fetchingModels ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
                    Discover Live Models
                  </Button>
                </div>

                {discoveredModels.length > 0 ? (
                  <Select
                    value={aiConfigForm.model}
                    onValueChange={(v) => setAiConfigForm({ ...aiConfigForm, model: v })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an active model from your account" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {discoveredModels.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={aiConfigForm.model}
                    onChange={(e) => setAiConfigForm({ ...aiConfigForm, model: e.target.value })}
                    placeholder="e.g. llama-3.1-8b-instant, llama-3.3-70b-versatile, gpt-4o-mini..."
                    required
                  />
                )}

                {aiConfigForm.provider === 'groq' && discoveredModels.length === 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] text-muted-foreground self-center mr-1">Recommended:</span>
                    <button
                      type="button"
                      onClick={() => setAiConfigForm(p => ({ ...p, model: 'llama-3.1-8b-instant' }))}
                      className="text-[10px] px-2 py-0.5 rounded bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 transition-colors"
                    >
                      ⚡ llama-3.1-8b-instant
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiConfigForm(p => ({ ...p, model: 'llama-3.3-70b-versatile' }))}
                      className="text-[10px] px-2 py-0.5 rounded bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 transition-colors"
                    >
                      🧠 llama-3.3-70b-versatile
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Base URL</Label>
                <Input
                  value={aiConfigForm.baseUrl}
                  onChange={(e) => setAiConfigForm({ ...aiConfigForm, baseUrl: e.target.value })}
                  placeholder="https://api.openai.com or http://localhost:11434"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>API Key (Secret Token / مفتاح الـ API)</Label>
                <Input
                  type="password"
                  value={aiConfigForm.apiKey}
                  onChange={(e) => setAiConfigForm({ ...aiConfigForm, apiKey: e.target.value })}
                  placeholder={aiConfigForm.provider === 'ollama' ? 'Optional for local Ollama (Not required)' : 'sk-... or gsk_... (Enter your API Token)'}
                />
                <p className="text-xs text-muted-foreground">
                  {aiConfigForm.provider === 'ollama' 
                    ? 'Local Ollama runs on your VPS without a token by default.'
                    : 'Your API token will be securely encrypted on the server and hidden from the tenant company.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label>Max Output Tokens</Label>
                  <Input
                    type="number"
                    min="100"
                    max="8000"
                    value={aiConfigForm.maxTokens}
                    onChange={(e) => setAiConfigForm({ ...aiConfigForm, maxTokens: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Default Temperature</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                    value={aiConfigForm.temperature}
                    onChange={(e) => setAiConfigForm({ ...aiConfigForm, temperature: Number(e.target.value) })}
                  />
                </div>
              </div>

              <DialogFooter className="pt-4">
                <Button variant="outline" type="button" onClick={() => setAiConfigOrg(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateAiMutation.isPending}>
                  {updateAiMutation.isPending ? 'Saving...' : 'Save AI Configuration'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
