import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  LayoutDashboard, 
  Inbox, 
  Users, 
  Building2, 
  Target, 
  BookOpen, 
  Bot, 
  BarChart3, 
  Puzzle, 
  Settings,
  LogOut,
  MessageSquare,
  Shield,
  Layers,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Check,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { clearToken, setToken } from '@/lib/auth';
import { adminApi } from '@/lib/admin-api';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AppShellProps {
  children: ReactNode;
}

const navSections = [
  {
    title: 'Support',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Inbox', href: '/inbox', icon: Inbox, badge: true },
      { name: 'Contacts', href: '/contacts', icon: Users },
      { name: 'Companies', href: '/companies', icon: Building2 },
    ]
  },
  {
    title: 'Sales',
    items: [
      { name: 'CRM', href: '/crm', icon: Target },
    ]
  },
  {
    title: 'Intelligence',
    items: [
      { name: 'Knowledge Base', href: '/knowledge-base', icon: BookOpen },
      { name: 'AI Settings', href: '/ai-settings', icon: Bot },
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    ]
  },
  {
    title: 'Platform',
    items: [
      { name: 'Integrations', href: '/integrations', icon: Puzzle },
      { name: 'Team', href: '/users', icon: MessageSquare },
      { name: 'Settings', href: '/settings', icon: Settings },
    ]
  }
];

export function AppShell({ children }: AppShellProps) {
  const [location, setLocation] = useLocation();
  const [isPinned, setIsPinned] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: adminApi.getMe,
    staleTime: 60_000,
  });

  const isSuperAdmin = user?.role === 'superadmin';
  const organizationsList = user?.organizations || (user?.organization ? [user.organization] : []);

  const handleLogout = () => {
    clearToken();
    setLocation('/login');
  };

  const handleSwitchOrg = async (orgId: number, orgName: string) => {
    if (user?.organizationId === orgId || user?.organization?.id === orgId) return;
    try {
      const res = await adminApi.switchOrganization(orgId);
      setToken(res.accessToken);
      queryClient.clear();
      toast({ title: 'Workspace switched', description: `Now managing ${orgName}` });
      window.location.reload();
    } catch (e: any) {
      toast({ title: 'Failed to switch workspace', description: e.message, variant: 'destructive' });
    }
  };

  const isExpanded = isPinned || isHovered;

  const initials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : 'U';

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside 
        className={cn(
          "flex-shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col relative z-20",
          "transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        )}
        style={{ width: isExpanded ? '230px' : '56px' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Logo Area */}
        <div className="flex items-center h-16 px-3 border-b border-sidebar-border overflow-hidden shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 flex items-center justify-center shrink-0 shadow-sm shadow-indigo-500/30">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div 
            className={cn(
              "ml-3 flex flex-col transition-opacity duration-300 whitespace-nowrap",
              isExpanded ? "opacity-100" : "opacity-0"
            )}
          >
            <span className="font-bold text-sidebar-foreground text-sm tracking-tight leading-tight">SupportHub AI</span>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Enterprise</span>
          </div>
        </div>

        {/* Workspace / Company Switcher */}
        {organizationsList.length > 0 && (
          <div className="p-2 border-b border-sidebar-border shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {isExpanded ? (
                  <button
                    type="button"
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-sidebar-accent/50 hover:bg-sidebar-accent border border-sidebar-border/60 text-left transition-all group"
                    title="Switch Company Workspace"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs">
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-semibold text-sidebar-foreground truncate leading-none">
                          {user?.organization?.name || 'Company Workspace'}
                        </div>
                        <div className="text-[10px] text-muted-foreground capitalize mt-0.5 leading-none">
                          {isSuperAdmin ? 'SuperAdmin' : (user?.role || 'Member')}
                        </div>
                      </div>
                    </div>
                    <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-sidebar-foreground shrink-0 ml-1" />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="w-10 h-10 mx-auto rounded-lg bg-sidebar-accent/50 hover:bg-sidebar-accent border border-sidebar-border/60 flex items-center justify-center text-primary transition-all group"
                    title={`Current: ${user?.organization?.name || 'Workspace'}`}
                  >
                    <Building2 className="w-4 h-4" />
                  </button>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 p-1.5 shadow-xl border-border/80 z-50">
                <DropdownMenuLabel className="text-[10px] uppercase font-bold text-muted-foreground px-2 py-1 tracking-wider">
                  Company Workspaces ({organizationsList.length})
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-56 overflow-y-auto space-y-0.5">
                  {organizationsList.map((org: any) => {
                    const isSelected = (user?.organizationId === org.id) || (user?.organization?.id === org.id);
                    return (
                      <DropdownMenuItem
                        key={org.id}
                        onClick={() => handleSwitchOrg(org.id, org.name)}
                        className={cn(
                          "flex items-center justify-between px-2.5 py-2 rounded-md cursor-pointer text-xs",
                          isSelected && "bg-primary/10 text-primary font-semibold"
                        )}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
                          <div className="truncate">
                            <span className="truncate block font-medium">{org.name}</span>
                            <span className="text-[10px] text-muted-foreground capitalize block">
                              {org.role || 'Member'} • {org.plan || 'starter'}
                            </span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0 ml-1" />}
                      </DropdownMenuItem>
                    );
                  })}
                </div>
                {isSuperAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin/organizations"
                        className="flex items-center gap-2 px-2.5 py-2 text-xs text-amber-600 font-medium cursor-pointer"
                      >
                        <Shield className="w-4 h-4" />
                        Manage All Companies
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-6 scrollbar-thin">
          
          {isSuperAdmin && (
            <div className="px-2 space-y-1">
              {isExpanded && (
                <div className="px-2 pb-1 text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5 opacity-100 transition-opacity">
                  <Shield className="w-3 h-3" />
                  SaaS Admin
                </div>
              )}
              <Link
                href="/admin/organizations"
                className={cn(
                  'group flex items-center px-2 py-2 rounded-md text-sm font-medium transition-all duration-200 relative',
                  location.startsWith('/admin')
                    ? 'bg-amber-500/10 text-amber-500 shadow-sm'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
                data-testid="nav-saas-organizations"
              >
                <div className="flex items-center justify-center w-6 h-6 shrink-0">
                  <Layers className="w-4.5 h-4.5" />
                </div>
                <span className={cn("ml-2 whitespace-nowrap transition-opacity", isExpanded ? "opacity-100" : "opacity-0 w-0 hidden")}>
                  Companies
                </span>
                {!isExpanded && (
                  <div className="nav-tooltip bg-popover text-popover-foreground px-2 py-1 rounded text-xs shadow-md border border-border whitespace-nowrap">
                    Manage Companies
                  </div>
                )}
              </Link>
            </div>
          )}

          {navSections.map((section, idx) => (
            <div key={idx} className="px-2 space-y-1">
              <div className={cn(
                "px-2 pb-1 text-[10px] font-bold text-sidebar-foreground/50 uppercase tracking-wider transition-opacity whitespace-nowrap",
                isExpanded ? "opacity-100 h-auto" : "opacity-0 h-0 overflow-hidden"
              )}>
                {section.title}
              </div>
              {section.items.map((item) => {
                const isActive = location === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'group flex items-center px-2 py-2 rounded-md text-sm font-medium transition-all duration-200 relative',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-[0_0_12px_rgba(var(--primary),0.3)]'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    )}
                    data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="flex items-center justify-center w-6 h-6 shrink-0 relative">
                      <Icon className="w-4.5 h-4.5" />
                      {item.badge && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-sidebar" />
                      )}
                    </div>
                    <span className={cn("ml-2 whitespace-nowrap transition-opacity", isExpanded ? "opacity-100" : "opacity-0 w-0 hidden")}>
                      {item.name}
                    </span>
                    {!isExpanded && (
                      <div className="nav-tooltip bg-popover text-popover-foreground px-2 py-1 rounded text-xs shadow-md border border-border whitespace-nowrap flex items-center gap-2">
                        {item.name}
                        {item.badge && <div className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        
        {/* Footer Area */}
        <div className="border-t border-sidebar-border p-2 flex flex-col gap-2 bg-sidebar relative">
          <button
            onClick={() => setIsPinned(!isPinned)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-sidebar border border-sidebar-border rounded-full flex items-center justify-center text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground z-30 shadow-sm transition-transform hover:scale-110"
          >
            {isPinned ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {user && (
            <div className={cn(
              "flex items-center rounded-md transition-all duration-300",
              isExpanded ? "p-2 bg-sidebar-accent/30" : "p-1 justify-center"
            )}>
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                {initials}
              </div>
              <div className={cn(
                "ml-2 flex flex-col min-w-0 transition-opacity",
                isExpanded ? "opacity-100" : "opacity-0 w-0 hidden"
              )}>
                <span className="text-sm font-semibold text-sidebar-foreground truncate">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">{user.email}</span>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={cn(
              "group flex items-center rounded-md text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 relative",
              isExpanded ? "px-3 py-2 w-full" : "justify-center p-2"
            )}
            data-testid="button-logout"
          >
            <div className="flex items-center justify-center w-5 h-5 shrink-0">
              <LogOut className="w-4.5 h-4.5" />
            </div>
            <span className={cn("ml-2 whitespace-nowrap transition-opacity", isExpanded ? "opacity-100" : "opacity-0 w-0 hidden")}>
              Logout
            </span>
            {!isExpanded && (
              <div className="nav-tooltip bg-popover text-popover-foreground px-2 py-1 rounded text-xs shadow-md border border-border whitespace-nowrap">
                Logout
              </div>
            )}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-hidden flex flex-col relative z-10 bg-background">
        {children}
      </main>
    </div>
  );
}
