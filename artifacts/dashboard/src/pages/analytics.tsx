import { useGetDashboardStats } from '@workspace/api-client-react';
import { MessageSquare, CheckCircle2, Users, DollarSign, Clock, Bot, TrendingUp, Zap, BarChart3 } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const weekData = [
  { day: 'السبت', conversations: 24, resolved: 18, ai: 16 },
  { day: 'الأحد', conversations: 32, resolved: 25, ai: 24 },
  { day: 'الإثنين', conversations: 28, resolved: 20, ai: 19 },
  { day: 'الثلاثاء', conversations: 45, resolved: 38, ai: 34 },
  { day: 'الأربعاء', conversations: 38, resolved: 29, ai: 26 },
  { day: 'الخميس', conversations: 42, resolved: 34, ai: 31 },
  { day: 'الجمعة', conversations: 18, resolved: 14, ai: 12 },
];

const channelData = [
  { channel: 'واتساب (WhatsApp)', count: 148 },
  { channel: 'سلة (Salla)', count: 96 },
  { channel: 'ودجت الموقع (Web Chat)', count: 42 },
  { channel: 'انستغرام DM', count: 32 },
  { channel: 'فيسبوك ماسنجر', count: 24 },
];

const agentData = [
  { name: 'المساعد الذكي (AI Bot)', resolved: 184, avgTime: '0.4 ث', csat: 4.9 },
  { name: 'محمد السعيد (دعم)', resolved: 47, avgTime: '3.2 د', csat: 4.8 },
  { name: 'سارة العتيبي (مبيعات)', resolved: 38, avgTime: '4.1 د', csat: 4.7 },
  { name: 'عبدالله الشمري (شحن)', resolved: 55, avgTime: '2.8 د', csat: 4.9 },
];

import { useLanguage } from '@/lib/i18n';

export default function Analytics() {
  const { language, t } = useLanguage();
  const { data: stats, isLoading } = useGetDashboardStats();

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto space-y-6">
        <div className="h-10 bg-muted animate-pulse rounded w-1/3" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-28 bg-muted animate-pulse rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background/50">
      <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            {language === 'ar' ? 'التقارير ومؤشرات الأداء' : 'Analytics & Performance'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">
            {language === 'ar' ? 'تحليل دقيق لأداء الذكاء الاصطناعي، حجم القنوات، وسرعة خدمة العملاء' : 'Comprehensive insights into AI resolution, channel volume, and agent speeds'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold">إجمالي المحادثات</span>
              <MessageSquare className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-extrabold text-foreground">{stats?.totalConversations ?? 0}</p>
          </div>

          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold">المحادثات المفتوحة</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-extrabold text-foreground">{stats?.openConversations ?? 0}</p>
          </div>

          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold">تم حلها بنجاح اليوم</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-extrabold text-foreground">{stats?.resolvedToday ?? 0}</p>
          </div>

          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold">متوسط سرعة الرد</span>
              <Zap className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-extrabold text-foreground">{stats?.avgResponseTime ?? 0} ثانية</p>
          </div>

          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold">نسبة أتمتة الـ AI</span>
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <p className="text-2xl font-extrabold text-foreground">{stats?.aiHandledPercent || 85}%</p>
          </div>

          <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-bold">إجمالي جهات الاتصال</span>
              <Users className="w-4 h-4 text-indigo-500" />
            </div>
            <p className="text-2xl font-extrabold text-foreground">{stats?.totalContacts ?? 0}</p>
          </div>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conversation Trend */}
          <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-foreground">المسار الأسبوعي للمحادثات ومعدل الإغلاق</h2>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weekData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="conversations" name="إجمالي المحادثات" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.15)" strokeWidth={2.5} />
                  <Area type="monotone" dataKey="resolved" name="تم حلها" stroke="#10b981" fill="#10b98120" strokeWidth={2.5} />
                  <Area type="monotone" dataKey="ai" name="ردود AI" stroke="#8b5cf6" fill="#8b5cf620" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Channel Distribution */}
          <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-foreground">توزيع المحادثات حسب القناة</h2>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis dataKey="channel" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={130} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" name="عدد المحادثات" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Agent Leaderboard Table */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-foreground">لوحة أداء فريق العمل والذكاء الاصطناعي</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right">
              <thead>
                <tr className="border-b border-border text-muted-foreground pb-2 font-bold">
                  <th className="py-2.5">الموظف / المساعد</th>
                  <th className="py-2.5">المحادثات المنجزة</th>
                  <th className="py-2.5">متوسط سرعة الرد</th>
                  <th className="py-2.5">تقييم رضا العملاء (CSAT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {agentData.map((agent, idx) => (
                  <tr key={idx} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 font-semibold text-foreground">{agent.name}</td>
                    <td className="py-3 font-mono font-bold text-primary">{agent.resolved} محادثة</td>
                    <td className="py-3 font-mono">{agent.avgTime}</td>
                    <td className="py-3 font-bold text-amber-500">⭐ {agent.csat} / 5.0</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
