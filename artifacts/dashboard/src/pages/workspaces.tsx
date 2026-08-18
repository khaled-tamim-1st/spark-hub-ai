import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/admin-api';
import { setToken, clearToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  Building2, 
  MessageSquare, 
  Bot, 
  Shield, 
  ArrowRight, 
  LogOut, 
  Search, 
  Loader2, 
  Layers, 
  CheckCircle2, 
  Sparkles,
  Users,
  Radio,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function Workspaces() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState('');
  const [launchingId, setLaunchingId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    industry: '',
    website: '',
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: user, isLoading } = useQuery({
    queryKey: ['current-user'],
    queryFn: adminApi.getMe,
    staleTime: 30_000,
  });

  const handleLogout = () => {
    clearToken();
    setLocation('/login');
  };

  const handleLaunchWorkspace = async (org: any) => {
    setLaunchingId(org.id);
    try {
      const res = await adminApi.switchOrganization(org.id);
      setToken(res.accessToken);
      queryClient.clear();
      toast({
        title: 'Workspace Active',
        description: `Switched to ${org.name}`,
      });
      setLocation('/dashboard');
    } catch (err: any) {
      toast({
        title: 'Failed to access company',
        description: err.message,
        variant: 'destructive',
      });
      setLaunchingId(null);
    }
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name.trim()) return;
    setCreating(true);
    try {
      const newOrg = await adminApi.createMyOrganization(createForm);
      await queryClient.invalidateQueries({ queryKey: ['current-user'] });
      setIsCreateOpen(false);
      setCreateForm({ name: '', industry: '', website: '' });
      toast({ title: 'Company Created', description: `Created ${newOrg.name}` });
      await handleLaunchWorkspace(newOrg);
    } catch (err: any) {
      toast({ title: 'Failed to create company', description: err.message, variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const organizationsList = user?.organizations || (user?.organization ? [user.organization] : []);
  const isSuperAdmin = user?.role === 'superadmin';

  const filteredOrgs = organizationsList.filter((org: any) =>
    org.name.toLowerCase().includes(search.toLowerCase()) ||
    (org.slug && org.slug.toLowerCase().includes(search.toLowerCase()))
  );

  const userInitials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() : 'U';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your workspaces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-primary selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shadow-md border border-slate-700">
              <img src="/logo.png" alt="Spark Hub" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white">Spark Hub</span>
              <span className="text-[10px] ml-2 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                Workspaces Hub
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isSuperAdmin && (
              <Button asChild variant="outline" size="sm" className="gap-2 border-amber-500/30 text-amber-400 hover:bg-amber-500/10">
                <Link href="/admin/organizations">
                  <Shield className="w-4 h-4 text-amber-400" /> SaaS Admin Portal
                </Link>
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-slate-400 hover:text-white hover:bg-slate-800 gap-1.5 text-xs"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 space-y-8">
        {/* User Profile Card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 relative overflow-hidden backdrop-blur shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-indigo-500/20 shrink-0">
                {userInitials}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-white tracking-tight">
                    Welcome back, {user?.firstName} {user?.lastName}!
                  </h1>
                  <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-xs">
                    {isSuperAdmin ? 'Platform Owner' : 'Account Member'}
                  </Badge>
                </div>
                <p className="text-sm text-slate-400 flex items-center gap-2">
                  <span>{user?.email}</span>
                  <span>&bull;</span>
                  <span>{organizationsList.length} Accessible {organizationsList.length === 1 ? 'Company' : 'Companies'}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs text-slate-400">Current Session</div>
                <div className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5 justify-end">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Authenticated &amp; Secure
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workspaces Section */}
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                Select a Company Workspace to Manage
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Choose the company you want to open. You will get full access to its live dashboard, inbox, team, and AI settings.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Search Input */}
              {organizationsList.length > 2 && (
                <div className="relative w-full sm:w-56">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Filter companies..."
                    className="pl-9 bg-slate-900/80 border-slate-800 text-sm placeholder:text-slate-500 text-white focus:border-indigo-500 h-9"
                  />
                </div>
              )}

              {/* Create New Company Button (SuperAdmin only) */}
              {isSuperAdmin && (
                <Button
                  onClick={() => setIsCreateOpen(true)}
                  className="gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-600/20 font-semibold text-xs h-9 shrink-0"
                >
                  <Plus className="w-4 h-4" /> Add Company
                </Button>
              )}
            </div>
          </div>

          {/* Dialog: Add New Company */}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-white text-lg">
                  <Building2 className="w-5 h-5 text-indigo-400" />
                  Create New Company Workspace
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateCompany} className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label className="text-slate-300">Company / Workspace Name *</Label>
                  <Input
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    placeholder="e.g. Clash Market, The Trio LLC"
                    required
                    className="bg-slate-950 border-slate-800 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Industry / Category (Optional)</Label>
                  <Input
                    value={createForm.industry}
                    onChange={(e) => setCreateForm({ ...createForm, industry: e.target.value })}
                    placeholder="e.g. E-Commerce, Gaming, Agency"
                    className="bg-slate-950 border-slate-800 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Website or Page URL (Optional)</Label>
                  <Input
                    value={createForm.website}
                    onChange={(e) => setCreateForm({ ...createForm, website: e.target.value })}
                    placeholder="https://clashmarket.com"
                    className="bg-slate-950 border-slate-800 text-white"
                  />
                </div>

                <DialogFooter className="pt-4 border-t border-slate-800">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateOpen(false)}
                    className="border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={creating}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white"
                  >
                    {creating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                    Create &amp; Launch
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Companies Grid */}
          {filteredOrgs.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-12 text-center space-y-3">
              <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-semibold text-slate-300">No company workspaces found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No active companies match your search. Please contact the platform administrator to assign you to a company.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredOrgs.map((org: any) => {
                const isCurrentActive = (user?.organizationId === org.id) || (user?.organization?.id === org.id);
                const isLaunching = launchingId === org.id;

                const roleName = isSuperAdmin ? 'SuperAdmin' : (org.role || 'Member');
                const roleBadgeClass = 
                  roleName.toLowerCase() === 'owner' ? 'bg-purple-500/15 text-purple-300 border-purple-500/30' :
                  roleName.toLowerCase() === 'admin' ? 'bg-blue-500/15 text-blue-300 border-blue-500/30' :
                  roleName.toLowerCase() === 'superadmin' ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' :
                  'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';

                return (
                  <div
                    key={org.id}
                    className={cn(
                      "group bg-slate-900/80 hover:bg-slate-800/80 border transition-all duration-200 rounded-2xl p-6 flex flex-col justify-between shadow-lg relative overflow-hidden",
                      isCurrentActive ? "border-indigo-500/60 ring-1 ring-indigo-500/30" : "border-slate-800 hover:border-indigo-500/40"
                    )}
                  >
                    {/* Top Row */}
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 group-hover:from-indigo-600 group-hover:to-violet-600 flex items-center justify-center text-lg font-bold text-white transition-all shadow-md shrink-0 border border-slate-700/50">
                          {org.name.slice(0, 2).toUpperCase()}
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border", roleBadgeClass)}>
                            {roleName}
                          </span>
                          <span className="text-[10px] text-slate-400 capitalize">
                            Plan: {org.plan || 'Starter'}
                          </span>
                        </div>
                      </div>

                      {/* Title & Details */}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                            {org.name}
                          </h3>
                          {isCurrentActive && (
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-1 truncate">
                          {org.slug ? `@${org.slug}` : 'Private Workspace'}
                        </p>
                      </div>

                      {/* Capabilities Checklist */}
                      <div className="pt-2 border-t border-slate-800/60 space-y-1.5 text-xs text-slate-400">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>Omnichannel Inbox (WhatsApp, Messenger)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span>AI Assistant &amp; Knowledge Base</span>
                        </div>
                      </div>
                    </div>

                    {/* Launch Action Button */}
                    <div className="pt-6 mt-4">
                      <Button
                        onClick={() => handleLaunchWorkspace(org)}
                        disabled={isLaunching}
                        className={cn(
                          "w-full h-11 font-semibold text-sm transition-all gap-2 shadow-md",
                          isCurrentActive
                            ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30"
                            : "bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-700/60 hover:border-transparent"
                        )}
                      >
                        {isLaunching ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Launching...
                          </>
                        ) : (
                          <>
                            <span>Open Workspace</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
