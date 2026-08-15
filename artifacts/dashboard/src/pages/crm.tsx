import { useState } from 'react';
import { useListPipelines, useListDeals, useCreateDeal, useUpdateDeal, getListPipelinesQueryKey, getListDealsQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmptyState } from '@/components/empty-state';
import { Plus, Target, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function CRM() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    pipelineId: '',
    stage: '',
    value: '',
    currency: 'USD',
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: pipelines } = useListPipelines();
  const { data: deals, isLoading } = useListDeals();
  const createDeal = useCreateDeal();
  const updateDeal = useUpdateDeal();

  const selectedPipeline = pipelines?.[0];
  const stages = selectedPipeline?.stages || [];

  const handleCreate = () => {
    if (!formData.pipelineId || !formData.stage) {
      toast({ title: 'Please select a pipeline and stage', variant: 'destructive' });
      return;
    }

    createDeal.mutate(
      {
        data: {
          title: formData.title,
          pipelineId: Number(formData.pipelineId),
          stage: formData.stage,
          value: formData.value ? Number(formData.value) : undefined,
          currency: formData.currency,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListDealsQueryKey({}) });
          setIsCreateOpen(false);
          setFormData({ title: '', pipelineId: '', stage: '', value: '', currency: 'USD' });
          toast({ title: 'Deal created successfully' });
        },
        onError: (error) => {
          toast({
            title: 'Failed to create deal',
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
          toast({ title: 'Deal updated' });
        },
        onError: (error) => {
          toast({
            title: 'Failed to update deal',
            description: error.message,
            variant: 'destructive',
          });
        },
      }
    );
  };

  const dealsByStage = stages.reduce((acc, stage) => {
    acc[stage.name] = deals?.filter((d) => d.stage === stage.name) || [];
    return acc;
  }, {} as Record<string, typeof deals>);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">CRM Pipeline</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your sales opportunities</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-deal">
                <Plus className="w-4 h-4 mr-2" />
                Add Deal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Deal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Deal title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                    data-testid="input-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pipeline">Pipeline</Label>
                  <Select value={formData.pipelineId} onValueChange={(v) => setFormData((p) => ({ ...p, pipelineId: v, stage: '' }))}>
                    <SelectTrigger data-testid="select-pipeline">
                      <SelectValue placeholder="Select pipeline" />
                    </SelectTrigger>
                    <SelectContent>
                      {pipelines?.map((p) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {formData.pipelineId && (
                  <div className="space-y-2">
                    <Label htmlFor="stage">Stage</Label>
                    <Select value={formData.stage} onValueChange={(v) => setFormData((p) => ({ ...p, stage: v }))}>
                      <SelectTrigger data-testid="select-stage">
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        {pipelines?.find((p) => p.id === Number(formData.pipelineId))?.stages.map((s) => (
                          <SelectItem key={s.id} value={s.name}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="value">Deal value</Label>
                  <Input
                    id="value"
                    type="number"
                    placeholder="0"
                    value={formData.value}
                    onChange={(e) => setFormData((p) => ({ ...p, value: e.target.value }))}
                    data-testid="input-value"
                  />
                </div>
                <Button onClick={handleCreate} className="w-full" disabled={createDeal.isPending} data-testid="button-submit">
                  Create Deal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="h-96 bg-muted animate-pulse rounded-lg" />
        ) : !selectedPipeline || !deals ? (
          <EmptyState
            icon={Target}
            title="No pipeline found"
            description="Create a pipeline to start managing deals"
          />
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4" data-testid="pipeline-board">
            {stages.map((stage) => (
              <div key={stage.id} className="flex-shrink-0 w-80" data-testid={`stage-${stage.name.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="bg-card border border-card-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{stage.name}</h3>
                    <span className="text-xs font-mono text-muted-foreground">
                      {dealsByStage[stage.name]?.length || 0}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {dealsByStage[stage.name]?.map((deal) => (
                      <div
                        key={deal.id}
                        className="bg-background border border-border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer"
                        data-testid={`deal-${deal.id}`}
                      >
                        <h4 className="font-medium mb-2">{deal.title}</h4>
                        {deal.value && (
                          <p className="text-lg font-bold text-primary font-mono">
                            {formatCurrency(deal.value, deal.currency || 'USD')}
                          </p>
                        )}
                        {deal.contactName && (
                          <p className="text-sm text-muted-foreground mt-2">{deal.contactName}</p>
                        )}
                        <Select value={deal.stage} onValueChange={(v) => handleStageChange(deal.id, v)}>
                          <SelectTrigger className="mt-3 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {stages.map((s) => (
                              <SelectItem key={s.id} value={s.name}>
                                {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                    {dealsByStage[stage.name]?.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-8">No deals</p>
                    )}
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
