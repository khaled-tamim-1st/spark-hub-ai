import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AppShell } from '@/components/app-shell';
import { ProtectedRoute } from '@/components/protected-route';
import Login from '@/pages/login';
import Register from '@/pages/register';
import Dashboard from '@/pages/dashboard';
import Inbox from '@/pages/inbox';
import Voice from '@/pages/voice';
import Contacts from '@/pages/contacts';
import Companies from '@/pages/companies';
import Crm from '@/pages/crm';
import KnowledgeBase from '@/pages/knowledge-base';
import AiSettings from '@/pages/ai-settings';
import Analytics from '@/pages/analytics';
import Integrations from '@/pages/integrations';
import Users from '@/pages/users';
import Settings from '@/pages/settings';
import AdminOrganizations from '@/pages/admin-organizations';
import Workspaces from '@/pages/workspaces';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}

function AppRoutes() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/workspaces">
        <ProtectedRoute>
          <Workspaces />
        </ProtectedRoute>
      </Route>
      <Route path="/">
        <ProtectedRoute>
          <Workspaces />
        </ProtectedRoute>
      </Route>
      <Route path="/admin/organizations">
        <Shell><AdminOrganizations /></Shell>
      </Route>
      <Route path="/dashboard">
        <Shell><Dashboard /></Shell>
      </Route>
      <Route path="/inbox">
        <Shell><Inbox /></Shell>
      </Route>
      <Route path="/voice">
        <Shell><Voice /></Shell>
      </Route>
      <Route path="/contacts">
        <Shell><Contacts /></Shell>
      </Route>
      <Route path="/companies">
        <Shell><Companies /></Shell>
      </Route>
      <Route path="/crm">
        <Shell><Crm /></Shell>
      </Route>
      <Route path="/knowledge-base">
        <Shell><KnowledgeBase /></Shell>
      </Route>
      <Route path="/ai-settings">
        <Shell><AiSettings /></Shell>
      </Route>
      <Route path="/analytics">
        <Shell><Analytics /></Shell>
      </Route>
      <Route path="/integrations">
        <Shell><Integrations /></Shell>
      </Route>
      <Route path="/users">
        <Shell><Users /></Shell>
      </Route>
      <Route path="/settings">
        <Shell><Settings /></Shell>
      </Route>
      <Route path="/">
        <Shell><Dashboard /></Shell>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <AppRoutes />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
