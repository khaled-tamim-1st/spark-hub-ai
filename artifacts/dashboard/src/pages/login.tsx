import { useState } from 'react';
import { useLocation } from 'wouter';
import { setToken } from '@/lib/auth';
import { adminApi } from '@/lib/admin-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Loader2, Building2, ArrowRight, ArrowLeft, Shield, Sparkles, Lock, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectingOrg, setSelectingOrg] = useState(false);
  const [availableOrgs, setAvailableOrgs] = useState<any[]>([]);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [switchingId, setSwitchingId] = useState<number | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }

      setToken(data.accessToken);
      setLocation('/workspaces');
    } catch (error: any) {
      toast({
        title: 'فشل تسجيل الدخول',
        description: error.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectWorkspace = async (org: any) => {
    setSwitchingId(org.id);
    try {
      const res = await adminApi.switchOrganization(org.id);
      setToken(res.accessToken);
      setLocation('/dashboard');
    } catch (err: any) {
      toast({
        title: 'فشل الدخول لمساحة العمل',
        description: err.message,
        variant: 'destructive',
      });
      setSwitchingId(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 font-sans">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl overflow-hidden mb-4 shadow-lg border border-border">
            <img src="/logo.png" alt="Spark Hub" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground mb-1 tracking-tight">Spark Hub</h1>
          <p className="text-muted-foreground text-sm font-medium">
            {selectingOrg ? 'اختر مساحة عمل المتجر أو الشركة' : 'منصة العمليات والذكاء الاصطناعي للمتاجر'}
          </p>
        </div>

        {/* Workspace Selection Screen */}
        {selectingOrg ? (
          <div className="bg-card border border-card-border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <div>
                <p className="text-xs text-muted-foreground">تم تسجيل الدخول بحساب:</p>
                <p className="text-sm font-semibold text-foreground">{sessionUser?.email}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectingOrg(false);
                  setAvailableOrgs([]);
                }}
                className="text-xs gap-1 text-muted-foreground hover:text-foreground"
              >
                <ArrowRight className="w-3.5 h-3.5" /> رجوع
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                مساحات العمل المتاحة ({availableOrgs.length})
              </p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availableOrgs.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => handleSelectWorkspace(org)}
                    disabled={switchingId !== null}
                    className="w-full p-3 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-primary/40 flex items-center justify-between transition-all group text-right"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                          {org.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground capitalize">
                          {org.role === 'superadmin' ? 'مدير النظام' : org.role} • باقة {org.plan || 'الأساسية'}
                        </p>
                      </div>
                    </div>
                    {switchingId === org.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    ) : (
                      <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:-translate-x-0.5 transition-all" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Login Form */
          <div className="bg-card border border-card-border rounded-2xl p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-primary" /> البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="input-email"
                  className="h-11 text-xs bg-muted/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-primary" /> كلمة المرور
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="input-password"
                  className="h-11 text-xs bg-muted/20"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all"
                disabled={loading}
                data-testid="button-submit"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> جاري التحقق...
                  </span>
                ) : (
                  'تسجيل الدخول للمنصة'
                )}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
