import { useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { MessageSquare, ArrowRight, ShieldAlert } from 'lucide-react';

export default function Register() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation('/login');
    }, 4000);
    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 font-sans">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl overflow-hidden mb-4 shadow-lg border border-border">
          <img src="/logo.png" alt="Spark Hub" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Spark Hub</h1>
        <p className="text-muted-foreground mb-8 text-sm">منصة إدارة وتشغيل المتاجر الذكية</p>

        <div className="bg-card border border-card-border rounded-2xl p-8 shadow-sm space-y-4 text-right">
          <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>تسجيل المتاجر والمؤسسات</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            التسجيل المباشر مخصص للمتاجر المرخصة ويتم تفعيل الحسابات ومساحات العمل مركزياً من قبل إدارة المنصة.
          </p>
          <p className="text-xs text-muted-foreground">
            إذا كان لديك حساب مسجل بالفعل، يرجى التوجه لصفحة تسجيل الدخول للوصول إلى لوحة التحكم.
          </p>
          <Button asChild className="w-full mt-4 h-11 rounded-xl font-bold">
            <Link href="/login">
              <span>الانتقال لصفحة الدخول</span>
              <ArrowRight className="w-4 h-4 mr-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
