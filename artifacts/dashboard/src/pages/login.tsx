import { useState } from 'react';
import { useLocation } from 'wouter';
import { setToken } from '@/lib/auth';
import { adminApi } from '@/lib/admin-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Loader2, Building2, ArrowRight, ArrowLeft, Shield } from 'lucide-react';
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
        throw new Error(data.error || 'Invalid email or password');
      }

      setToken(data.accessToken);
      setLocation('/workspaces');
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid email or password',
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
        title: 'Failed to access workspace',
        description: err.message,
        variant: 'destructive',
      });
      setSwitchingId(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl overflow-hidden mb-4 shadow-lg border border-border">
            <img src="/logo.png" alt="Spark Hub" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Spark Hub</h1>
          <p className="text-muted-foreground">
            {selectingOrg ? 'Select Company Workspace' : 'Sign in to your intelligent platform'}
          </p>
        </div>

        {/* Workspace Selection Screen */}
        {selectingOrg ? (
          <div className="bg-card border border-card-border rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border/50">
              <div>
                <p className="text-xs text-muted-foreground">Signed in as</p>
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
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              You have access to <strong className="text-foreground">{availableOrgs.length} workspaces</strong>. Choose the company you want to manage:
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {availableOrgs.map((org) => {
                const isCurrentSwitching = switchingId === org.id;
                return (
                  <button
                    key={org.id}
                    onClick={() => handleSelectWorkspace(org)}
                    disabled={switchingId !== null}
                    className="w-full flex items-center justify-between p-3.5 rounded-lg border border-border/70 hover:border-primary bg-background/50 hover:bg-primary/5 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div className="truncate">
                        <div className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                          {org.name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-medium uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                            {org.role || 'Member'}
                          </span>
                          <span className="text-[10px] text-muted-foreground capitalize">
                            Plan: {org.plan || 'starter'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 pl-2">
                      {isCurrentSwitching ? (
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      ) : (
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Normal Login Screen */
          <div className="bg-card border border-card-border rounded-xl p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  data-testid="input-email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  data-testid="input-password"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold"
                disabled={loading}
                data-testid="button-submit"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Sign in to Workspace
              </Button>
            </form>

            <div className="mt-6 text-center pt-2 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Spark Hub Enterprise Platform &bull; Accounts are provisioned centrally by your administrator.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
