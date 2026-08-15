import { useGetDashboardStats } from '@workspace/api-client-react';
import { StatCard } from '@/components/stat-card';
import { MessageSquare, CheckCircle2, Users, DollarSign, Clock, Bot, TrendingUp } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const weekData = [
  { day: 'Mon', conversations: 24, resolved: 18, ai: 14 },
  { day: 'Tue', conversations: 32, resolved: 25, ai: 22 },
  { day: 'Wed', conversations: 28, resolved: 20, ai: 17 },
  { day: 'Thu', conversations: 45, resolved: 38, ai: 31 },
  { day: 'Fri', conversations: 38, resolved: 29, ai: 24 },
  { day: 'Sat', conversations: 22, resolved: 19, ai: 11 },
  { day: 'Sun', conversations: 18, resolved: 14, ai: 9 },
];

const channelData = [
  { channel: 'WhatsApp', count: 87 },
  { channel: 'Messenger', count: 42 },
  { channel: 'Instagram', count: 29 },
  { channel: 'Web Chat', count: 16 },
];

const agentData = [
  { name: 'Alex Johnson', resolved: 47, avgTime: 4.2, csat: 4.8 },
  { name: 'Maria Garcia', resolved: 38, avgTime: 5.1, csat: 4.6 },
  { name: 'Sam Lee', resolved: 55, avgTime: 3.8, csat: 4.9 },
  { name: 'AI Assistant', resolved: 62, avgTime: 0.5, csat: 4.3 },
];

export default function Analytics() {
  const { data: stats, isLoading } = useGetDashboardStats();

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="h-10 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-28 bg-muted animate-pulse rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Performance insights and trends</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard title="Total Conversations" value={stats?.totalConversations ?? 0} icon={MessageSquare} />
          <StatCard title="Open Conversations" value={stats?.openConversations ?? 0} icon={Clock} />
          <StatCard title="Resolved Today" value={stats?.resolvedToday ?? 0} icon={CheckCircle2} />
          <StatCard title="Avg Response Time" value={`${stats?.avgResponseTime ?? 0}m`} icon={TrendingUp} />
          <StatCard title="AI Handled" value={`${stats?.aiHandledPercent ?? 0}%`} icon={Bot} />
          <StatCard title="Total Contacts" value={stats?.totalContacts ?? 0} icon={Users} />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conversation Trend */}
          <div className="bg-card border border-card-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Weekly Conversation Trend</h2>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="conversations" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.15)" strokeWidth={2} />
                <Area type="monotone" dataKey="resolved" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2) / 0.15)" strokeWidth={2} />
                <Area type="monotone" dataKey="ai" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3) / 0.15)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Channel Distribution */}
          <div className="bg-card border border-card-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Conversations by Channel</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={channelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis dataKey="channel" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline Value */}
        {(stats?.totalDealsValue ?? 0) > 0 && (
          <div className="bg-card border border-card-border rounded-lg p-6 flex items-center gap-6">
            <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Pipeline Value</p>
              <p className="text-3xl font-bold font-mono">${stats?.totalDealsValue.toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Agent Performance */}
        <div className="bg-card border border-card-border rounded-lg overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold">Agent Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Agent</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resolved</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Avg Time (min)</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">CSAT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {agentData.map((agent) => (
                  <tr key={agent.name} className="hover:bg-muted/20">
                    <td className="px-6 py-4 font-medium">{agent.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{agent.resolved}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{agent.avgTime}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-yellow-500">
                        ★ {agent.csat}
                      </span>
                    </td>
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
