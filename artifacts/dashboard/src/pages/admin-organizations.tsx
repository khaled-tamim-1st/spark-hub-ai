import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  adminApi, 
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
  Sliders
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
            SaaS Tenant Organizations (إدارة الشركات المشتركة)
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
              Register New Tenant Company (إضافة شركة جديدة)
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
    </div>
  );
}
