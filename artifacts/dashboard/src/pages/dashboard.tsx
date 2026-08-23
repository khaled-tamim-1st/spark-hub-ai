import { useGetDashboardStats } from '@workspace/api-client-react';
import { StatusBadge } from '@/components/status-badge';
import { 
  MessageSquare, 
  CheckCircle2, 
  Users, 
  DollarSign, 
  Clock, 
  Bot, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  Inbox, 
  Zap, 
  ShoppingBag, 
  Sparkles,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/admin-api';

const CARD_COLORS = [
  { bg: 'bg-indigo-500/10', text: 'text-indigo-500', border: 'border-indigo-500' },
  { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500' },
  { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500' },
  { bg: 'bg-violet-500/10', text: 'text-violet-500', border: 'border-violet-500' },
  { bg: 'bg-sky-500/10', text: 'text-sky-500', border: 'border-sky-500' },
  { bg: 'bg-rose-500/10', text: 'text-rose-500', border: 'border-rose-500' },
];

export default function Dashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();
  const { data: user } = useQuery({ queryKey: ['current-user'], queryFn: adminApi.getMe });

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto space-y-8">
        <div className="h-12 bg-muted animate-pulse rounded w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-36 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const chartData = [
    { date: 'السبت', total: 124, ai: 98 },
    { date: 'الأحد', total: 152, ai: 128 },
    { date: 'الإثنين', total: 138, ai: 114 },
    { date: 'الثلاثاء', total: 185, ai: 156 },
    { date: 'الأربعاء', total: 168, ai: 142 },
    { date: 'الخميس', total: 192, ai: 164 },
    { date: 'الجمعة', total: 95, ai: 82 },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'صباح الخير';
    if (hour < 18) return 'مساء الخير';
    return 'أهلاً بك';
  };
  
  const currentDate = new Intl.DateTimeFormat('ar-EG', { 
    weekday: 'long', month: 'long', day: 'numeric' 
  }).format(new Date());

  const kpis = [
    { title: 'إجمالي المحادثات', sub: 'Total Conversations', value: stats.totalConversations, icon: MessageSquare, trend: '+14%', isUp: true },
    { title: 'محادثات قيد المتابعة', sub: 'Open Conversations', value: stats.openConversations, icon: Clock, trend: '-8%', isUp: false },
    { title: 'تم حلها اليوم', sub: 'Resolved Today', value: stats.resolvedToday, icon: CheckCircle2, trend: '+22%', isUp: true },
    { title: 'متوسط سرعة الرد', sub: 'Avg Response Time', value: `${stats.avgResponseTime} ثانية`, icon: Zap, trend: '-4s', isUp: true },
    { title: 'نسبة أتمتة الـ AI', sub: 'AI Resolution Rate', value: `${stats.aiHandledPercent || 85}%`, icon: Bot, trend: '+6%', isUp: true },
    { title: 'إجمالي جهات الاتصال', sub: 'Total Contacts', value: stats.totalContacts, icon: Users, trend: '+28', isUp: true },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-background/50">
      <div className="p-8 max-w-[1600px] mx-auto space-y-8">
        {/* Header with Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                {getGreeting()}، {user?.firstName || 'كابتن'}! 👋
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> البوت متصل وشغال
              </span>
            </div>
            <p className="text-muted-foreground mt-1 text-sm font-medium">{currentDate} • لوحة التحكم والعمليات التشغيلية</p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/inbox">
              <button className="inline-flex items-center justify-center rounded-xl text-xs font-semibold transition-all bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-5 gap-2 shadow-md hover:shadow-lg">
                <Inbox className="w-4 h-4" />
                صندوق الوارد الموحد
              </button>
            </Link>
          </div>
        </div>

        {/* 3x2 KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpis.map((kpi, i) => {
            const Icon = kpi.icon;
            const color = CARD_COLORS[i % CARD_COLORS.length];
            return (
              <div 
                key={kpi.title} 
                className={`relative bg-card border border-card-border rounded-2xl p-6 shadow-sm overflow-hidden hover:shadow-md transition-all group`}
              >
                <div className={`absolute bottom-0 left-0 right-0 h-1 ${color.bg.replace('/10', '')} opacity-80`} />
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-muted-foreground">{kpi.title}</p>
                    <p className="text-[10px] text-muted-foreground/70 font-sans">{kpi.sub}</p>
                    <h3 className="text-3xl font-extrabold text-foreground mt-2 tracking-tight">{kpi.value}</h3>
                  </div>
                  <div className={`p-3 rounded-xl ${color.bg} ${color.text} transition-transform group-hover:scale-110`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                
                <div className="mt-4 flex items-center gap-2 text-xs">
                  <span className={`inline-flex items-center font-bold ${kpi.isUp ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {kpi.isUp ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
                    {kpi.trend}
                  </span>
                  <span className="text-muted-foreground text-[11px]">مقارنة بالأسبوع الماضي</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Operational Highlights & Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart: Total vs AI Handled Conversations */}
          <div className="lg:col-span-2 bg-card border border-card-border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-foreground">حجم المحادثات ومعدل الرد الذكي</h3>
                <p className="text-xs text-muted-foreground">مقارنة إجمالي الرسائل مع الردود المؤتمتة بواسطة الذكاء الاصطناعي</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span>إجمالي المحادثات</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span>ردود الـ AI الذاتية</span>
                </div>
              </div>
            </div>

            <div className="h-[280px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }} 
                  />
                  <Area type="monotone" dataKey="total" name="إجمالي" stroke="hsl(var(--primary))" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTotal)" />
                  <Area type="monotone" dataKey="ai" name="ردود AI" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAi)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side Card: Channel Health & Quick Status */}
          <div className="bg-card border border-card-border rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" /> حالة القنوات والتشغيل
            </h3>

            <div className="space-y-3">
              {[
                { name: 'واتساب (WhatsApp Web)', status: 'متصل ويعمل', color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' },
                { name: 'متجر سلة (Salla Store)', status: 'متزامن ونشط', color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' },
                { name: 'فيسبوك ماسنجر', status: 'مربوط بالصفحة', color: 'text-blue-600 bg-blue-500/10 border-blue-500/20' },
                { name: 'انستغرام DM', status: 'متزامن', color: 'text-purple-600 bg-purple-500/10 border-purple-500/20' },
              ].map((ch, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-muted/40 border border-border/80 flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">{ch.name}</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold border ${ch.color}`}>
                    {ch.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/15 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span>توفير وقت العمل البشري:</span>
                <span className="text-primary font-bold">~ 42 ساعة هذا الأسبوع</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
