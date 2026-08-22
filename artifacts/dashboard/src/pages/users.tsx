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
import { Users as UsersIcon, Plus, Trash2, Shield, UserCheck, Mail } from 'lucide-react';
import { getInitials, formatDateTime } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  owner: { label: 'مالك المتجر / المدير', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
  admin: { label: 'مشرف عمليات', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  agent: { label: 'ممثل خدمة عملاء', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  viewer: { label: 'مراقب فقط', color: 'bg-gray-500/10 text-gray-600 border-gray-500/20' },
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
    if (!form.firstName.trim() || !form.email.trim() || !form.password.trim()) {
      toast({ title: 'يرجى ملء جميع الحقول الإلزامية', variant: 'destructive' });
      return;
    }

    createUser.mutate(
      { data: form as any },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
          setIsInviteOpen(false);
          setForm({ firstName: '', lastName: '', email: '', password: '', role: 'agent' });
          toast({ title: '✅ تم إضافة عضو الفريق بنجاح' });
        },
        onError: (e) => toast({ title: 'فشل إضافة العضو', description: e.message, variant: 'destructive' }),
      }
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm('هل أنت متأكد من رغبتك في إزالة هذا العضو من الفريق؟')) return;
    deleteUser.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListUsersQueryKey() });
          toast({ title: 'تم حذف العضو' });
        },
        onError: (e) => toast({ title: 'فشل الحذف', description: e.message, variant: 'destructive' }),
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
              فريق العمل والموظفين (Team & Access)
            </h1>
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              إدارة صلاحيات موظفي الدعم، المشرفين، ومسؤولي المبيعات
            </p>
          </div>

          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 h-10 rounded-xl px-5 shadow-sm" data-testid="button-invite-user">
                <Plus className="w-4 h-4" />
                <span>إضافة موظف جديد</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle>إضافة عضو جديد لفريق العمل</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>الاسم الأول *</Label>
                    <Input
                      placeholder="أحمد"
                      value={form.firstName}
                      onChange={(e) => setForm(p => ({ ...p, firstName: e.target.value }))}
                      data-testid="input-first-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>اسم العائلة</Label>
                    <Input
                      placeholder="الغامدي"
                      value={form.lastName}
                      onChange={(e) => setForm(p => ({ ...p, lastName: e.target.value }))}
                      data-testid="input-last-name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>البريد الإلكتروني *</Label>
                  <Input
                    type="email"
                    placeholder="ahmed@company.com"
                    value={form.email}
                    onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                    data-testid="input-email"
                  />
                </div>

                <div className="space-y-2">
                  <Label>كلمة المرور الأولية *</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                    data-testid="input-password"
                  />
                </div>

                <div className="space-y-2">
                  <Label>الدور والصلاحية</Label>
                  <Select
                    value={form.role}
                    onValueChange={(val: any) => setForm(p => ({ ...p, role: val }))}
                  >
                    <SelectTrigger data-testid="select-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agent">ممثل خدمة عملاء (Agent)</SelectItem>
                      <SelectItem value="admin">مشرف ومسؤول (Admin)</SelectItem>
                      <SelectItem value="viewer">مراقب قراءة فقط (Viewer)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
                    إلغاء
                  </Button>
                  <Button onClick={handleInvite} disabled={createUser.isPending} data-testid="button-submit-invite">
                    {createUser.isPending ? 'جاري الإضافة...' : 'حفظ وإضافة الموظف'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Team Members List Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-36 bg-muted animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : !users || users.length === 0 ? (
          <EmptyState
            icon={UsersIcon}
            title="لا يوجد أعضاء بالفريق"
            description="أضف أعضاء فريق العمل للبدء في الرد على العملاء ومتابعة العمليات."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => {
              const roleInfo = ROLE_LABELS[user.role] || ROLE_LABELS.agent;

              return (
                <div
                  key={user.id}
                  className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12 border border-primary/20">
                        <AvatarImage src={user.avatarUrl || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                          {getInitials(user.firstName, user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(user.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs">
                    <Badge variant="outline" className={`text-[10px] font-bold ${roleInfo.color}`}>
                      {roleInfo.label}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {formatDateTime(user.createdAt)}
                    </span>
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
