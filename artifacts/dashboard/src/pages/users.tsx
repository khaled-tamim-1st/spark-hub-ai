import { useState } from 'react';
import { useListUsers, useInviteUser, useDeleteUser, getListUsersQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/empty-state';
import { Users as UsersIcon, Plus, Trash2, Shield } from 'lucide-react';
import { getInitials, formatDateTime } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const ROLE_COLORS: Record<string, string> = {
  owner: 'bg-purple-500/10 text-purple-600 border-0',
  admin: 'bg-blue-500/10 text-blue-600 border-0',
  agent: 'bg-green-500/10 text-green-600 border-0',
};

export default function Users() {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [form, setForm] = useState<{ firstName: string; lastName: string; email: string; password: string; role: 'owner' | 'admin' | 'agent' | 'viewer' }>({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    password: '', 
    role: 'agent' 
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: users, isLoading } = useListUsers();
  const createUser = useInviteUser();
  const deleteUser = useDeleteUser();

  const handleInvite = () => {
    createUser.mutate(
      { data: form as any },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
          setIsInviteOpen(false);
          setForm({ firstName: '', lastName: '', email: '', password: '', role: 'agent' });
          toast({ title: 'Team member added' });
        },
        onError: (e) => toast({ title: 'Failed to add member', description: e.message, variant: 'destructive' }),
      }
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm('Remove this team member?')) return;
    deleteUser.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
          toast({ title: 'Team member removed' });
        },
        onError: (e) => toast({ title: 'Failed', description: e.message, variant: 'destructive' }),
      }
    );
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Team</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your support team members</p>
          </div>
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-invite-user">
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First name</Label>
                    <Input
                      value={form.firstName}
                      onChange={(e) => setForm(p => ({ ...p, firstName: e.target.value }))}
                      data-testid="input-first-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last name</Label>
                    <Input
                      value={form.lastName}
                      onChange={(e) => setForm(p => ({ ...p, lastName: e.target.value }))}
                      data-testid="input-last-name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                    data-testid="input-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                    placeholder="Temporary password"
                    data-testid="input-password"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={form.role} onValueChange={(v) => setForm(p => ({ ...p, role: v as any }))}>
                    <SelectTrigger data-testid="select-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="owner">Owner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleInvite} className="w-full" disabled={createUser.isPending} data-testid="button-submit">
                  Add Member
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />)}
          </div>
        ) : !users || users.length === 0 ? (
          <EmptyState
            icon={UsersIcon}
            title="No team members yet"
            description="Add your first team member to get started"
            action={{ label: 'Add Member', onClick: () => setIsInviteOpen(true) }}
          />
        ) : (
          <div className="bg-card border border-card-border rounded-lg overflow-hidden">
            <table className="w-full" data-testid="users-table">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Member</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Joined</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30" data-testid={`user-${user.id}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9">
                          <AvatarImage src={user.avatarUrl || undefined} />
                          <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                        </Avatar>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className={`text-xs ${ROLE_COLORS[user.role] ?? ''}`}>
                        <Shield className="w-3 h-3 mr-1" />
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{formatDateTime(user.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      {user.role !== 'owner' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(user.id)}
                          data-testid={`button-delete-${user.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
