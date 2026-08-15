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
    createCompany.mutate(
      { data: formData },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListCompaniesQueryKey({}) });
          setIsCreateOpen(false);
          setFormData({ name: '', domain: '', industry: '', size: '' });
          toast({ title: 'Company created successfully' });
        },
        onError: (error) => {
          toast({
            title: 'Failed to create company',
            description: error.message,
            variant: 'destructive',
          });
        },
      }
    );
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Companies</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your customer organizations</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-company">
                <Plus className="w-4 h-4 mr-2" />
                Add Company
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Company</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Company name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    data-testid="input-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain</Label>
                  <Input
                    id="domain"
                    placeholder="example.com"
                    value={formData.domain}
                    onChange={(e) => setFormData((p) => ({ ...p, domain: e.target.value }))}
                    data-testid="input-domain"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    placeholder="Technology"
                    value={formData.industry}
                    onChange={(e) => setFormData((p) => ({ ...p, industry: e.target.value }))}
                    data-testid="input-industry"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size">Company size</Label>
                  <Input
                    id="size"
                    placeholder="10-50 employees"
                    value={formData.size}
                    onChange={(e) => setFormData((p) => ({ ...p, size: e.target.value }))}
                    data-testid="input-size"
                  />
                </div>
                <Button onClick={handleCreate} className="w-full" disabled={createCompany.isPending} data-testid="button-submit">
                  Create Company
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : !companies || companies.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No companies found"
            description="Create your first company to get started"
            action={{ label: 'Add Company', onClick: () => setIsCreateOpen(true) }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="companies-grid">
            {companies.map((company) => (
              <div
                key={company.id}
                className="bg-card border border-card-border rounded-lg p-5 hover:border-primary/50 transition-colors"
                data-testid={`company-${company.id}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">{company.name}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {company.domain && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-3 h-3" />
                      {company.domain}
                    </div>
                  )}
                  {company.industry && (
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3 h-3" />
                      {company.industry}
                    </div>
                  )}
                  {company.contactCount !== undefined && (
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3" />
                      {company.contactCount} contacts
                    </div>
                  )}
                  <p className="text-xs pt-2 border-t border-border">
                    Created {formatDateTime(company.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
