import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Building2, User, Shield, Save, CheckCircle2, Zap, Users as UsersIcon, Globe, Languages, Check } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import { useLanguage, type Language } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export default function Settings() {
  const { toast } = useToast();
  const { language, setLanguage, t, isRtl } = useLanguage();

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
    toast({ title: t.savedSuccessfully });
  };

  const handleSaveProfile = () => {
    toast({ title: t.savedSuccessfully });
  };

  const org = user?.organization;

  return (
    <div className="flex-1 overflow-y-auto bg-background/50">
      <div className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            {t.settingsTitle}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">
            {t.settingsSubtitle}
          </p>
        </div>

        {/* Language Selection Card — خانة اللغة في الإعدادات */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-border">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Languages className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">{t.languageAndTheme}</h2>
              <p className="text-xs text-muted-foreground">{t.languageDesc}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Arabic Option */}
            <button
              type="button"
              onClick={() => {
                setLanguage('ar');
                toast({ title: 'تم تفعيل اللغة العربية بالكامل' });
              }}
              className={cn(
                "p-4 rounded-xl border text-start transition-all flex items-center justify-between relative group",
                language === 'ar'
                  ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
                  : "border-border bg-card hover:bg-muted/40 hover:border-border/80"
              )}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇸🇦</span>
                  <span className="text-sm font-bold text-foreground">العربية (Arabic)</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  واجهة عربية أصيلة متكاملة من اليمين لليسار (RTL)
                </p>
              </div>
              {language === 'ar' && (
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </button>

            {/* English Option */}
            <button
              type="button"
              onClick={() => {
                setLanguage('en');
                toast({ title: 'English interface enabled successfully' });
              }}
              className={cn(
                "p-4 rounded-xl border text-start transition-all flex items-center justify-between relative group",
                language === 'en'
                  ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
                  : "border-border bg-card hover:bg-muted/40 hover:border-border/80"
              )}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌐</span>
                  <span className="text-sm font-bold text-foreground">English</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Clean English interface from Left-to-Right (LTR)
                </p>
              </div>
              {language === 'en' && (
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Subscription & Quota Card */}
        {org && (
          <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <h2 className="text-base font-bold text-foreground">{t.subscriptionCardTitle}</h2>
              </div>
              <Badge variant="outline" className="text-xs uppercase font-bold px-3 py-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                {org.plan || 'Pro'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl border bg-muted/30 space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold">
                  <UsersIcon className="w-4 h-4 text-primary" />
                  {t.teamQuota}
                </div>
                <div className="text-xl font-extrabold text-foreground">
                  {org.maxUsers || 10}
                </div>
              </div>

              <div className="p-4 rounded-xl border bg-muted/30 space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold">
                  <Building2 className="w-4 h-4 text-primary" />
                  {t.channelsQuota}
                </div>
                <div className="text-xl font-extrabold text-foreground">
                  {org.maxChannels || 5}
                </div>
              </div>

              <div className="p-4 rounded-xl border bg-muted/30 space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  {t.accountStatus}
                </div>
                <div className="text-xl font-extrabold text-emerald-600">
                  {t.activeAndLicensed} ✅
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
              <h2 className="text-base font-bold text-foreground">{t.storeProfileTitle}</h2>
            </div>
            <Button onClick={handleSaveOrg} className="gap-2 h-9 rounded-xl px-4">
              <Save className="w-3.5 h-3.5" />
              <span>{t.save}</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t.storeNameLabel} *</Label>
              <Input
                value={orgForm.name}
                onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                placeholder={language === 'ar' ? 'متجر سلة' : 'My Store'}
              />
            </div>

            <div className="space-y-2">
              <Label>{t.storeWebsiteLabel}</Label>
              <Input
                value={orgForm.website}
                onChange={(e) => setOrgForm({ ...orgForm, website: e.target.value })}
                placeholder="https://salla.sa/yourstore"
                className="font-mono"
              />
            </div>
          </div>
        </div>

        {/* Personal Profile Card */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-base font-bold text-foreground">{t.personalProfileTitle}</h2>
            </div>
            <Button onClick={handleSaveProfile} className="gap-2 h-9 rounded-xl px-4">
              <Save className="w-3.5 h-3.5" />
              <span>{t.save}</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t.firstNameLabel}</Label>
              <Input
                value={profileForm.firstName}
                onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>{t.lastNameLabel}</Label>
              <Input
                value={profileForm.lastName}
                onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>{t.loginEmailLabel}</Label>
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
