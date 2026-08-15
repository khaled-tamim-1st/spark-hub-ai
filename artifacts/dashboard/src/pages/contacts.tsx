import { useState } from 'react';
import { useListContacts, useCreateContact, useDeleteContact, getListContactsQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EmptyState } from '@/components/empty-state';
import { Plus, Search, Mail, Phone, Building2, Trash2, User } from 'lucide-react';
import { getInitials, formatDateTime } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function Contacts() {
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: contacts, isLoading } = useListContacts(
    search ? { search } : {},
    { query: { queryKey: getListContactsQueryKey(search ? { search } : {}) } }
  );

  const createContact = useCreateContact();
  const deleteContact = useDeleteContact();

  const handleCreate = () => {
    createContact.mutate(
      { data: formData },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListContactsQueryKey({}) });
          setIsCreateOpen(false);
          setFormData({ firstName: '', lastName: '', email: '', phone: '' });
          toast({ title: 'Contact created successfully' });
        },
        onError: (error) => {
          toast({
            title: 'Failed to create contact',
            description: error.message,
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    deleteContact.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListContactsQueryKey({}) });
          toast({ title: 'Contact deleted successfully' });
        },
        onError: (error) => {
          toast({
            title: 'Failed to delete contact',
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
            <h1 className="text-2xl font-bold">Contacts</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your customer contacts</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-contact">
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Contact</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData((p) => ({ ...p, firstName: e.target.value }))}
                      data-testid="input-first-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData((p) => ({ ...p, lastName: e.target.value }))}
                      data-testid="input-last-name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    data-testid="input-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    data-testid="input-phone"
                  />
                </div>
                <Button onClick={handleCreate} className="w-full" disabled={createContact.isPending} data-testid="button-submit">
                  Create Contact
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search"
          />
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : !contacts || contacts.length === 0 ? (
          <EmptyState
            icon={User}
            title="No contacts found"
            description="Create your first contact to get started"
            action={{ label: 'Add Contact', onClick: () => setIsCreateOpen(true) }}
          />
        ) : (
          <div className="bg-card border border-card-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="contacts-table">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Last Activity
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {contacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-muted/30" data-testid={`contact-${contact.id}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={contact.avatarUrl || undefined} />
                            <AvatarFallback>{getInitials(contact.firstName, contact.lastName)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{contact.firstName} {contact.lastName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {contact.email ? (
                            <>
                              <Mail className="w-3 h-3" />
                              {contact.email}
                            </>
                          ) : (
                            '—'
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {contact.phone ? (
                            <>
                              <Phone className="w-3 h-3" />
                              {contact.phone}
                            </>
                          ) : (
                            '—'
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {contact.companyName ? (
                            <>
                              <Building2 className="w-3 h-3" />
                              {contact.companyName}
                            </>
                          ) : (
                            '—'
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {contact.lastActivityAt ? formatDateTime(contact.lastActivityAt) : 'Never'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(contact.id)}
                          data-testid={`button-delete-${contact.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
