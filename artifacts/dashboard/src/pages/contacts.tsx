import { useState } from 'react';
import { useListContacts, useCreateContact, useDeleteContact, getListContactsQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EmptyState } from '@/components/empty-state';
import { Plus, Search, Mail, Phone, Building2, Trash2, User, ExternalLink } from 'lucide-react';
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
    if (!formData.firstName.trim()) {
      toast({ title: 'يرجى إدخال الاسم الأول على الأقل', variant: 'destructive' });
      return;
    }

    createContact.mutate(
      { data: formData },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListContactsQueryKey({}) });
          setIsCreateOpen(false);
          setFormData({ firstName: '', lastName: '', email: '', phone: '' });
          toast({ title: '✅ تم إنشاء جهة الاتصال بنجاح' });
        },
        onError: (error) => {
          toast({
            title: 'فشل إنشاء جهة الاتصال',
            description: error.message,
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm('هل أنت متأكد من رغبتك في حذف جهة الاتصال هذه؟')) return;

    deleteContact.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListContactsQueryKey({}) });
          toast({ title: 'تم حذف جهة الاتصال' });
        },
        onError: (error) => {
          toast({
            title: 'فشل حذف جهة الاتصال',
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
              جهات الاتصال والعملاء (Contacts)
            </h1>
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              دليل بيانات العملاء المسجلين وسجلات التواصل
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="بحث بالاسم أو الرقم أو الإيميل..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-9 h-10 text-xs bg-card"
              />
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 h-10 rounded-xl px-4 shadow-sm" data-testid="button-create-contact">
                  <Plus className="w-4 h-4" />
                  <span>إضافة عميل جديد</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                  <DialogTitle>إضافة جهة اتصال جديدة</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">الاسم الأول *</Label>
                      <Input
                        id="firstName"
                        placeholder="سعد"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">اسم العائلة</Label>
                      <Input
                        id="lastName"
                        placeholder="العتيبي"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف / الجوال</Label>
                    <Input
                      id="phone"
                      placeholder="+966501234567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="saad@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                      إلغاء
                    </Button>
                    <Button onClick={handleCreate} disabled={createContact.isPending}>
                      {createContact.isPending ? 'جاري الحفظ...' : 'حفظ العميل'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Contacts Table / Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-36 bg-muted animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : !contacts || contacts.length === 0 ? (
          <EmptyState
            icon={User}
            title="لا توجد جهات اتصال مطابقة"
            description="يمكنك إضافة أول جهة اتصال أو مزامنة المحادثات من قنوات التواصل."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 border border-primary/20">
                      <AvatarImage src={contact.avatarUrl || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                        {getInitials(contact.firstName, contact.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                        {contact.firstName} {contact.lastName}
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">
                        {contact.phone || 'بدون رقم هاتف'}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(contact.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-border/60 text-xs text-muted-foreground">
                  {contact.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center justify-between pt-1">
                      <a
                        href={`https://wa.me/${contact.phone.replace(/[^\d]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-emerald-600 hover:underline font-semibold flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" /> فتح في واتساب
                      </a>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {formatDateTime(contact.createdAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
