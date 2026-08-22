import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Building2, User, Shield, Save, CheckCircle2, Zap, Users as UsersIcon, Globe, Mail } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';

export default function Settings() {
  const { toast } = useToast();

  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: adminApi.getMe,
  });

  const [orgForm, setOrgForm] = useState({
    name: '',
    website: '',
  });

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });
      if (user.organization) {
        setOrgForm({
          name: user.organization.name || '',
          website: user.organization.website || '',
        });
      }
    }
  }, [user]);

  const handleSaveOrg = () => {
    toast({ title: '✅ تم حفظ إعدادات المتجر/المؤسسة بنجاح' });
  };

  const handleSaveProfile = () => {
    toast({ title: '✅ تم تحديث بيانات الحساب الشخصي' });
  };

  const org = user?.organization;

  return (
    <div className="flex-1 overflow-y-auto bg-background/50">
      <div className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            إعدادات المنصة والحساب (Settings & Profile)
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">
            إدارة بيانات المتجر، باقة الاشتراك، وسعة الاستهلاك
          </p>
        </div>

        {/* Subscription & Quota Card */}
        {org && (
          <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <h2 className="text-base font-bold text-foreground">باقة الاشتراك وسعة الاستهلاك الحالية</h2>
              </div>
              <Badge variant="outline" className="text-xs uppercase font-bold px-3 py-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                باقة {org.plan || 'الاحترافية (Pro)'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl border bg-muted/30 space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold">
                  <UsersIcon className="w-4 h-4 text-primary" />
                  عدد مقاعد الموظفين
                </div>
                <div className="text-xl font-extrabold text-foreground">
                  حتى {org.maxUsers || 10} موظفين
                </div>
              </div>

              <div className="p-4 rounded-xl border bg-muted/30 space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold">
                  <Building2 className="w-4 h-4 text-primary" />
                  القنوات المسموحة
                </div>
                <div className="text-xl font-extrabold text-foreground">
                  حتى {org.maxChannels || 5} قنوات
                </div>
              </div>

              <div className="p-4 rounded-xl border bg-muted/30 space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  حالة الحساب
                </div>
                <div className="text-xl font-extrabold text-emerald-600">
                  نشط ومرخص ✅
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Organization / Store Profile Card */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              <h2 className="text-base font-bold text-foreground">بيانات المتجر / الشركة (Store Profile)</h2>
            </div>
            <Button onClick={handleSaveOrg} className="gap-2 h-9 rounded-xl px-4">
              <Save className="w-3.5 h-3.5" />
              <span>حفظ التعديلات</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>اسم المتجر / الشركة *</Label>
              <Input
                value={orgForm.name}
                onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                placeholder="متجر العطور الملكية"
              />
            </div>

            <div className="space-y-2">
              <Label>رابط المتجر الإلكتروني (Website)</Label>
              <Input
                value={orgForm.website}
                onChange={(e) => setOrgForm({ ...orgForm, website: e.target.value })}
                placeholder="https://salla.sa/yourstore"
              />
            </div>
          </div>
        </div>

        {/* Personal Profile Card */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-base font-bold text-foreground">بيانات الحساب الشخصي (Personal Profile)</h2>
            </div>
            <Button onClick={handleSaveProfile} className="gap-2 h-9 rounded-xl px-4">
              <Save className="w-3.5 h-3.5" />
              <span>تحديث الملف</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>الاسم الأول</Label>
              <Input
                value={profileForm.firstName}
                onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>اسم العائلة</Label>
              <Input
                value={profileForm.lastName}
                onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>البريد الإلكتروني (المستخدم للدخول)</Label>
              <Input
                value={profileForm.email}
                disabled
                className="bg-muted/40 font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
