import { useState } from 'react';
import { useListCompanies, useCreateCompany, getListCompaniesQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { EmptyState } from '@/components/empty-state';
import { Plus, Search, Building2, Users, Globe } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function Companies() {
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    industry: '',
    size: '',
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: companies, isLoading } = useListCompanies(
    search ? { search } : {},
    { query: { queryKey: getListCompaniesQueryKey(search ? { search } : {}) } }
  );

  const createCompany = useCreateCompany();

  const handleCreate = () => {
    if (!formData.name.trim()) {
      toast({ title: 'يرجى إدخال اسم الشركة', variant: 'destructive' });
      return;
    }

    createCompany.mutate(
      { data: formData },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListCompaniesQueryKey({}) });
          setIsCreateOpen(false);
          setFormData({ name: '', domain: '', industry: '', size: '' });
          toast({ title: '✅ تم إنشاء الشركة بنجاح' });
        },
        onError: (error) => {
          toast({
            title: 'فشل إنشاء الشركة',
            description: error.message,
            variant: 'destructive',
          });
        },
      }
    );
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background/50">
      <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              الشركات والمؤسسات (Companies)
            </h1>
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              إدارة حسابات الشركات والعملاء التجاريين (B2B)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="بحث باسم الشركة أو النطاق..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-9 h-10 text-xs bg-card"
              />
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 h-10 rounded-xl px-4 shadow-sm" data-testid="button-create-company">
                  <Plus className="w-4 h-4" />
                  <span>إضافة شركة جديدة</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                  <DialogTitle>إضافة شركة جديدة</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">اسم الشركة *</Label>
                    <Input
                      id="name"
                      placeholder="شركة التقنية المتقدمة"
                      value={formData.name}
                      onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                      data-testid="input-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="domain">الموقع / النطاق الإلكتروني (Domain)</Label>
                    <Input
                      id="domain"
                      placeholder="tech-company.sa"
                      value={formData.domain}
                      onChange={(e) => setFormData((p) => ({ ...p, domain: e.target.value }))}
                      data-testid="input-domain"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">قطاع العمل / الصناعة</Label>
                    <Input
                      id="industry"
                      placeholder="تجارة إلكترونية / خدمات لوجستية"
                      value={formData.industry}
                      onChange={(e) => setFormData((p) => ({ ...p, industry: e.target.value }))}
                      data-testid="input-industry"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                      إلغاء
                    </Button>
                    <Button onClick={handleCreate} disabled={createCompany.isPending}>
                      {createCompany.isPending ? 'جاري الحفظ...' : 'حفظ الشركة'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Companies Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-36 bg-muted animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : !companies || companies.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="لا توجد شركات مسجلة"
            description="أضف شركات وعملاء تجاريين لربط جهات الاتصال والصفقات بها."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((company) => (
              <div
                key={company.id}
                className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                      {company.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {company.industry || 'قطاع عام'}
                    </p>
                  </div>
                </div>

                <div className="space-y-1 pt-2 border-t border-border/60 text-xs text-muted-foreground">
                  {company.domain && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="font-mono">{company.domain}</span>
                    </div>
                  )}
                  <div className="text-[10px] text-muted-foreground font-mono pt-1">
                    تاريخ التسجيل: {formatDateTime(company.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
