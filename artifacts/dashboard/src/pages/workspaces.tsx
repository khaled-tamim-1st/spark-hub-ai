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
  ArrowLeft,
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
        title: '✅ تم الدخول لمساحة العمل',
        description: `تم تفعيل مساحة: ${org.name}`,
      });
      setLocation('/dashboard');
    } catch (err: any) {
      toast({
        title: 'فشل الدخول للمتجر',
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
      toast({ title: '✅ تم إنشاء المتجر/الشركة بنجاح' });
      await handleLaunchWorkspace(newOrg);
    } catch (err: any) {
      toast({ title: 'فشل إنشاء المتجر', description: err.message, variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const organizations = user?.organizations || (user?.organization ? [user.organization] : []);
  const isSuperAdmin = user?.role === 'superadmin';

  const filteredOrgs = organizations.filter((org: any) => {
    const term = search.toLowerCase();
    return (
      (org.name || '').toLowerCase().includes(term) ||
      (org.industry || '').toLowerCase().includes(term) ||
      (org.role || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm border border-border">
            <img src="/logo.png" alt="Spark Hub" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-foreground leading-none">Spark Hub</h1>
            <p className="text-[11px] text-muted-foreground mt-0.5">منصة إدارة وتشغيل المتاجر الذكية</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-foreground">{user?.firstName} {user?.lastName}</p>
            <p className="text-[10px] text-muted-foreground font-mono">{user?.email}</p>
          </div>

          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-xs text-muted-foreground gap-1.5">
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
              مساحات العمل والمتاجر (Workspaces)
            </h2>
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              اختر المتجر أو الشركة التي ترغب في إدارتها ومتابعة عملياتها الآن
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={() => setIsCreateOpen(true)} className="gap-2 h-10 rounded-xl px-4 shadow-sm">
              <Plus className="w-4 h-4" />
              <span>إضافة متجر / شركة جديدة</span>
            </Button>
          </div>
        </div>

        {/* Search Filter */}
        <div className="relative">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="بحث في المتاجر والشركات..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10 h-11 text-xs bg-card"
          />
        </div>

        {/* Workspaces Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-44 bg-muted animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filteredOrgs.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border/80 rounded-2xl space-y-3">
            <Building2 className="w-12 h-12 text-muted-foreground/40 mx-auto" />
            <h3 className="font-bold text-sm text-foreground">لا توجد متاجر مسجلة</h3>
            <p className="text-xs text-muted-foreground">أضف متجرك الأول للبدء في ربط سلة وواتساب وتفعيل المساعد الذكي.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOrgs.map((org: any) => {
              const isSelected = (user?.organizationId === org.id) || (user?.organization?.id === org.id);
              const isLaunching = launchingId === org.id;

              return (
                <div
                  key={org.id}
                  className={cn(
                    "bg-card border rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-5 transition-all hover:shadow-md group",
                    isSelected ? "border-primary ring-2 ring-primary/20" : "border-border/80 hover:border-primary/40"
                  )}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold bg-muted text-muted-foreground">
                        {org.plan || 'pro'}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                        {org.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {org.role === 'superadmin' ? 'مدير النظام' : org.role || 'مالك المتجر'}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleLaunchWorkspace(org)}
                    disabled={isLaunching}
                    className="w-full h-10 rounded-xl text-xs gap-2 shadow-sm font-bold"
                  >
                    {isLaunching ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span>دخول مساحة العمل</span>
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Create Store Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[450px] font-sans">
          <DialogHeader>
            <DialogTitle>إضافة متجر / مساحة عمل جديدة</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateCompany} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>اسم المتجر أو الشركة *</Label>
              <Input
                placeholder="مثال: متجر رداء الفخامة"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>المجال / النشاط التجاري</Label>
              <Input
                placeholder="مثال: عطور، ملابس، إلكترونيات"
                value={createForm.industry}
                onChange={(e) => setCreateForm({ ...createForm, industry: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>رابط المتجر (اختياري)</Label>
              <Input
                placeholder="https://salla.sa/yourstore"
                value={createForm.website}
                onChange={(e) => setCreateForm({ ...createForm, website: e.target.value })}
              />
            </div>

            <DialogFooter className="gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit" disabled={creating}>
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'حفظ وإنشاء المتجر'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
