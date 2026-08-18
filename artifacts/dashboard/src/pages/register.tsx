import { useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { MessageSquare, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function Register() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Automatically redirect after short delay or let user click
    const timer = setTimeout(() => {
      setLocation('/login');
    }, 4000);
    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 mb-4 shadow-lg shadow-indigo-500/25">
          <MessageSquare className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">SupportHub AI</h1>
        <p className="text-muted-foreground mb-8">Enterprise B2B Customer Support Platform</p>

        <div className="bg-card border border-card-border rounded-xl p-8 shadow-sm space-y-4 text-left">
          <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 font-semibold text-sm">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>Company Account Provisioning</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Public self-registration is closed. Company workspaces and admin credentials are provisioned centrally by the platform administrator.
          </p>
          <p className="text-xs text-muted-foreground">
            If you already have credentials, please sign in to access your company dashboard.
          </p>
          <Button asChild className="w-full mt-4">
            <Link href="/login">
              <ArrowLeft className="w-4 h-4 mr-2" /> Return to Sign In
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
