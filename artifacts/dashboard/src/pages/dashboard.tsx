import { useGetDashboardStats } from '@workspace/api-client-react';
import { StatusBadge } from '@/components/status-badge';
import { MessageSquare, CheckCircle2, Users, DollarSign, Clock, Bot, Plus, TrendingUp, TrendingDown, ArrowRight, Inbox } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/admin-api';

const CARD_COLORS = [
  { bg: 'bg-cyan-500/10', text: 'text-cyan-500', border: 'border-cyan-500' },
  { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500' },
  { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500' },
  { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500' },
  { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500' },
  { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500' },
];

export default function Dashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();
  const { data: user } = useQuery({ queryKey: ['current-user'], queryFn: adminApi.getMe });

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          <div className="h-12 bg-muted animate-pulse rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-36 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const chartData = [
    { date: 'Mon', total: 124, ai: 88 },
    { date: 'Tue', total: 152, ai: 112 },
    { date: 'Wed', total: 138, ai: 99 },
    { date: 'Thu', total: 185, ai: 141 },
    { date: 'Fri', total: 168, ai: 127 },
    { date: 'Sat', total: 92, ai: 74 },
    { date: 'Sun', total: 78, ai: 61 },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  const currentDate = new Intl.DateTimeFormat('en-US', { 
    weekday: 'long', month: 'long', day: 'numeric' 
  }).format(new Date());

  const kpis = [
    { title: 'Total Conversations', value: stats.totalConversations, icon: MessageSquare, trend: '+12%', isUp: true },
    { title: 'Open Conversations', value: stats.openConversations, icon: Clock, trend: '-5%', isUp: false },
    { title: 'Resolved Today', value: stats.resolvedToday, icon: CheckCircle2, trend: '+18%', isUp: true },
    { title: 'Avg Response Time', value: `${stats.avgResponseTime}m`, icon: Clock, trend: '-2m', isUp: true },
    { title: 'AI Handled', value: `${stats.aiHandledPercent}%`, icon: Bot, trend: '+4%', isUp: true },
    { title: 'Total Contacts', value: stats.totalContacts, icon: Users, trend: '+24', isUp: true },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-background/50">
      <div className="p-8 max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              {getGreeting()}, {user?.firstName || 'there'}!
            </h1>
            <p className="text-muted-foreground mt-1 text-sm font-medium">{currentDate}</p>
          </div>
          <Link href="/inbox">
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2 shadow-sm">
              <Plus className="w-4 h-4" />
              New Conversation
            </button>
          </Link>
        </div>

        {/* 3x2 KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpis.map((kpi, i) => {
            const Icon = kpi.icon;
            const color = CARD_COLORS[i % CARD_COLORS.length];
            return (
              <div 
                key={kpi.title} 
                className={`relative bg-card border border-card-border rounded-xl p-6 shadow-sm overflow-hidden hover:shadow-md transition-shadow group`}
              >
                <div className={`absolute bottom-0 left-0 right-0 h-1 ${color.bg.replace('/10', '')} opacity-80`} />
                <div className="flex justify-between items-start">
                  <div className={`w-12 h-12 rounded-lg ${color.bg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${color.text}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${kpi.isUp ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
                    {kpi.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {kpi.trend}
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-4xl font-bold text-card-foreground tracking-tight">{kpi.value}</h3>
                  <p className="text-sm font-medium text-muted-foreground mt-1">{kpi.title}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Chart Area */}
        <div className="bg-card border border-card-border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-card-foreground">Conversations This Week</h2>
              <p className="text-sm text-muted-foreground">Total volume vs AI autonomous resolution</p>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" /> Total
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" /> AI Handled
              </div>
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} dx={-10} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 500 }}
                />
                <Area type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                <Area type="monotone" dataKey="ai" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorAi)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Conversations */}
          <div className="lg:col-span-2 bg-card border border-card-border rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-card-foreground">Recent Conversations</h2>
                <p className="text-sm text-muted-foreground">Latest interactions needing attention</p>
              </div>
              <Link href="/inbox" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-border flex-1" data-testid="recent-activity-list">
              {stats.recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-muted/30 transition-colors flex items-center gap-4" data-testid={`activity-${activity.id}`}>
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold shrink-0">
                    {activity.actorName ? activity.actorName.charAt(0) : 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-semibold text-foreground truncate">{activity.actorName || 'Unknown User'}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {formatDateTime(activity.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
                  </div>
                  <div className="shrink-0">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-dot" />
                      Active
                    </div>
                  </div>
                </div>
              ))}
              {stats.recentActivity.length === 0 && (
                <div className="p-8 text-center text-muted-foreground text-sm flex flex-col items-center">
                  <Inbox className="w-10 h-10 mb-3 opacity-20" />
                  No recent conversations found.
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats / Right Column */}
          <div className="bg-card border border-card-border rounded-xl shadow-sm p-6 flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-bold text-card-foreground">Resolution Breakdown</h2>
              <p className="text-sm text-muted-foreground mb-6">How tickets are being solved</p>
              
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="flex items-center gap-2"><Bot className="w-4 h-4 text-purple-500"/> AI Agent</span>
                    <span>{stats.aiHandledPercent}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${stats.aiHandledPercent}%` }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="flex items-center gap-2"><Users className="w-4 h-4 text-primary"/> Human Agent</span>
                    <span>{100 - stats.aiHandledPercent}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${100 - stats.aiHandledPercent}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {stats.totalDealsValue > 0 && (
              <div className="mt-auto pt-6 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pipeline Value</p>
                    <p className="text-2xl font-bold text-card-foreground mt-1 font-mono">
                      ${stats.totalDealsValue.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-emerald-500" />
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
