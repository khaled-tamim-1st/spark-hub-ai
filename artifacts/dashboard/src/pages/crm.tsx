import { useState } from 'react';
import { useListPipelines, useListDeals, useCreateDeal, useUpdateDeal, getListPipelinesQueryKey, getListDealsQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmptyState } from '@/components/empty-state';
import { Plus, Target, DollarSign, ShoppingBag, Truck, CheckCircle2, XCircle, Clock, Search } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function CRM() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    pipelineId: '',
    stage: '',
    value: '',
    currency: 'EGP',
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: pipelines } = useListPipelines();
  const { data: deals, isLoading } = useListDeals();
  const createDeal = useCreateDeal();
  const updateDeal = useUpdateDeal();

  const selectedPipeline = pipelines?.[0];
  const stages = selectedPipeline?.stages || [
    { name: 'lead', label: 'عميل محتمل / جديد' },
    { name: 'processing', label: 'قيد التجهيز' },
    { name: 'shipping', label: 'جاري الشحن مع المندوب' },
    { name: 'won', label: 'تم التسليم بنجاح ✅' },
    { name: 'lost', label: 'ملغي / مرتجع ❌' },
  ];

  const handleCreate = () => {
    if (!formData.title.trim()) {
      toast({ title: 'يرجى كتابة عنوان أو تفاصيل الطلب', variant: 'destructive' });
      return;
    }

    createDeal.mutate(
      {
        data: {
          title: formData.title,
          pipelineId: formData.pipelineId ? Number(formData.pipelineId) : (selectedPipeline?.id || 1),
          stage: formData.stage || 'lead',
          value: formData.value ? Number(formData.value) : 0,
          currency: formData.currency || 'EGP',
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListDealsQueryKey({}) });
          setIsCreateOpen(false);
          setFormData({ title: '', pipelineId: '', stage: '', value: '', currency: 'EGP' });
          toast({ title: '✅ تم إنشاء الطلب / الصفقة بنجاح' });
        },
        onError: (error) => {
          toast({
            title: 'فشل إنشاء الطلب',
            description: error.message,
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleStageChange = (dealId: number, newStage: string) => {
    updateDeal.mutate(
      { id: dealId, data: { stage: newStage } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListDealsQueryKey({}) });
          toast({ title: 'تم تحديث حالة الطلب' });
        },
        onError: (error) => {
          toast({
            title: 'فشل تحديث الحالة',
            description: error.message,
            variant: 'destructive',
          });
        },
      }
    );
  };

  const filteredDeals = (deals || []).filter((d) => {
    if (!searchQuery.trim()) return true;
    const term = searchQuery.toLowerCase();
    return (d.title || '').toLowerCase().includes(term);
  });

  const dealsByStage = stages.reduce((acc, stage) => {
    acc[stage.name] = filteredDeals.filter((d) => d.stage === stage.name);
    return acc;
  }, {} as Record<string, typeof filteredDeals>);

  return (
    <div className="flex-1 overflow-y-auto bg-background/50">
      <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              إدارة الطلبات والصفقات (Orders & CRM Pipeline)
            </h1>
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              تتبع مراحل الطلبات والمبيعات من أول رسالة حتى إتمام الشحن والتسليم
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="بحث في الطلبات والصفقات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9 h-10 text-xs bg-card"
              />
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 h-10 rounded-xl px-4 shadow-sm">
                  <Plus className="w-4 h-4" />
                  <span>تسجيل طلب / صفقة جديدة</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                  <DialogTitle>إنشاء طلب أو صفقة جديدة</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>تفاصيل / اسم الطلب *</Label>
                    <Input
                      placeholder="مثال: باقة البريميوم أو أوردر ملابس #1042"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>المبلغ / القيمة</Label>
                      <Input
                        type="number"
                        placeholder="1500"
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>العملة</Label>
                      <Select
                        value={formData.currency}
                        onValueChange={(val) => setFormData({ ...formData, currency: val })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EGP">EGP (جنيه مصري)</SelectItem>
                          <SelectItem value="SAR">SAR (ريال سعودي)</SelectItem>
                          <SelectItem value="USD">USD (دولار)</SelectItem>
                          <SelectItem value="AED">AED (درهم إماراتي)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>مرحلة الطلب الأولية</Label>
                    <Select
                      value={formData.stage || 'lead'}
                      onValueChange={(val) => setFormData({ ...formData, stage: val })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {stages.map((st) => (
                          <SelectItem key={st.name} value={st.name}>
                            {(st as any).label || st.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                      إلغاء
                    </Button>
                    <Button onClick={handleCreate} disabled={createDeal.isPending}>
                      {createDeal.isPending ? 'جاري الحفظ...' : 'حفظ الطلب'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Pipeline Stages Columns (Kanban Board) */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-80 bg-muted animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4.5 overflow-x-auto pb-6">
            {stages.map((stage) => {
              const stageDeals = dealsByStage[stage.name] || [];
              const totalVal = stageDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);

              return (
                <div
                  key={stage.name}
                  className="bg-card border border-border/80 rounded-2xl p-4 flex flex-col min-h-[500px] shadow-sm"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
                    <div>
                      <h3 className="font-bold text-xs text-foreground">{(stage as any).label || stage.name}</h3>
                      <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                        {totalVal.toLocaleString()} EGP
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-bold">
                      {stageDeals.length}
                    </Badge>
                  </div>

                  <div className="flex-1 space-y-2.5 overflow-y-auto">
                    {stageDeals.length === 0 ? (
                      <div className="py-8 text-center text-xs text-muted-foreground/60">
                        لا توجد طلبات هنا
                      </div>
                    ) : (
                      stageDeals.map((deal) => (
                        <div
                          key={deal.id}
                          className="p-3.5 rounded-xl bg-muted/40 border border-border/80 text-xs space-y-2 hover:bg-muted/70 hover:shadow-sm transition-all group"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="font-bold text-foreground leading-snug">{deal.title}</h4>
                            <span className="font-bold text-primary font-mono shrink-0">
                              {deal.value} {deal.currency || 'EGP'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
                            <span>#{deal.id}</span>
                            <select
                              value={deal.stage}
                              onChange={(e) => handleStageChange(deal.id, e.target.value)}
                              className="text-[10px] rounded border border-border bg-card px-1.5 py-0.5 text-foreground cursor-pointer focus:ring-1 focus:ring-primary"
                            >
                              {stages.map((st) => (
                                <option key={st.name} value={st.name}>
                                  {(st as any).label || st.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
