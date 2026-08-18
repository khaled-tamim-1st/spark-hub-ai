import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { useLogin } from '@workspace/api-client-react';
import { setToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageSquare, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    login.mutate(
      { data: { email, password } },
      {
        onSuccess: (data) => {
          setToken(data.accessToken);
          setLocation('/dashboard');
        },
        onError: (error) => {
          toast({
            title: 'Login failed',
            description: error.message || 'Invalid email or password',
            variant: 'destructive',
          });
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 mb-4 shadow-lg shadow-indigo-500/25">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">SupportHub AI</h1>
          <p className="text-muted-foreground">Sign in to your company workspace</p>
        </div>

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
                disabled={login.isPending}
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
                disabled={login.isPending}
                data-testid="input-password"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold"
              disabled={login.isPending}
              data-testid="button-submit"
            >
              {login.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Sign in to Workspace
            </Button>
          </form>

          <div className="mt-6 text-center pt-2 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              SupportHub AI Enterprise Platform &bull; Accounts are provisioned centrally by your administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
