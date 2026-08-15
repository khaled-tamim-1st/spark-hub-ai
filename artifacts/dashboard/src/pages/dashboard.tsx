import { useGetDashboardStats } from '@workspace/api-client-react';
import { StatCard } from '@/components/stat-card';
import { StatusBadge } from '@/components/status-badge';
import { MessageSquare, CheckCircle2, Users, DollarSign, Clock, Bot } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="h-10 bg-muted animate-pulse rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  // Mock chart data
  const chartData = [
    { date: 'Mon', conversations: 24, ai: 18 },
    { date: 'Tue', conversations: 32, ai: 22 },
    { date: 'Wed', conversations: 28, ai: 19 },
    { date: 'Thu', conversations: 45, ai: 31 },
    { date: 'Fri', conversations: 38, ai: 27 },
    { date: 'Sat', conversations: 22, ai: 14 },
    { date: 'Sun', conversations: 18, ai: 11 },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor your support operations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Total Conversations"
            value={stats.totalConversations}
            icon={MessageSquare}
          />
          <StatCard
            title="Open Conversations"
            value={stats.openConversations}
            icon={Clock}
          />
          <StatCard
            title="Resolved Today"
            value={stats.resolvedToday}
            icon={CheckCircle2}
          />
          <StatCard
            title="Avg Response Time"
            value={`${stats.avgResponseTime}m`}
            icon={Clock}
          />
          <StatCard
            title="AI Handled"
            value={`${stats.aiHandledPercent}%`}
            icon={Bot}
          />
          <StatCard
            title="Total Contacts"
            value={stats.totalContacts}
            icon={Users}
          />
        </div>

        {/* Chart and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-card border border-card-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">Conversation Trends</h2>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="conversations"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary) / 0.2)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="ai"
                  stroke="hsl(var(--chart-2))"
                  fill="hsl(var(--chart-2) / 0.2)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Activity */}
          <div className="bg-card border border-card-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">Recent Activity</h2>
            <div className="space-y-4" data-testid="recent-activity-list">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex gap-3" data-testid={`activity-${activity.id}`}>
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-card-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.actorName && `${activity.actorName} · `}
                      {formatDateTime(activity.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
              {stats.recentActivity.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
              )}
            </div>
          </div>
        </div>

        {/* Deals Value */}
        {stats.totalDealsValue > 0 && (
          <div className="bg-card border border-card-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Pipeline Value</p>
                <p className="text-3xl font-bold text-card-foreground mt-2 font-mono">
                  ${stats.totalDealsValue.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
