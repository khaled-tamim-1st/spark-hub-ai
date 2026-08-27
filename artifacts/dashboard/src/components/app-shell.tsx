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
  Plus,
  Languages
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { clearToken, setToken } from '@/lib/auth';
import { adminApi } from '@/lib/admin-api';
import { useLanguage } from '@/lib/i18n';
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

export function AppShell({ children }: AppShellProps) {
  const [location, setLocation] = useLocation();
  const [isPinned, setIsPinned] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const { language, setLanguage, t, isRtl } = useLanguage();
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

  const handleSwitchOrg = async (orgId: number) => {
    try {
      const res = await adminApi.switchOrganization(orgId);
      setToken(res.accessToken);
      queryClient.clear();
      toast({
        title: language === 'ar' ? 'تم تبديل مساحة العمل' : 'Workspace Switched',
        description: language === 'ar' ? 'تم الدخول لمساحة العمل بنجاح' : 'Switched workspace successfully',
      });
      setLocation('/dashboard');
    } catch (err: any) {
      toast({
        title: language === 'ar' ? 'فشل التبديل' : 'Failed to switch workspace',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  const isExpanded = isPinned || isHovered;

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'U';

  const navSections = [
    {
      title: t.navOperations,
      items: [
        { name: t.navDashboard, href: '/dashboard', icon: LayoutDashboard },
        { name: t.navInbox, href: '/inbox', icon: Inbox, badge: true },
      ]
    },
    {
      title: t.navCrm,
      items: [
        { name: t.navContacts, href: '/contacts', icon: Users },
        { name: t.navDeals, href: '/crm', icon: Target },
        { name: t.navCompanies, href: '/companies', icon: Building2 },
      ]
    },
    {
      title: t.navIntelligence,
      items: [
        { name: t.navKnowledgeBase, href: '/knowledge-base', icon: BookOpen },
        { name: t.navAiSettings, href: '/ai-settings', icon: Bot },
        { name: t.navAnalytics, href: '/analytics', icon: BarChart3 },
      ]
    },
    {
      title: t.navPlatform,
      items: [
        { name: t.navIntegrations, href: '/integrations', icon: Puzzle },
        { name: t.navTeam, href: '/users', icon: MessageSquare },
        { name: t.navSettings, href: '/settings', icon: Settings },
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-background font-sans overflow-hidden">
      {/* Dynamic Animated Sidebar */}
      <aside 
        className={cn(
          "flex-shrink-0 bg-sidebar border-sidebar-border flex flex-col relative z-20",
          isRtl ? "border-l" : "border-r",
          "transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        )}
        style={{ width: isExpanded ? '230px' : '56px' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Logo Area — Ecomate Brand */}
        <div className="flex items-center h-16 px-3 border-b border-sidebar-border overflow-hidden shrink-0">
          <div className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center shrink-0 bg-white p-1 border border-sidebar-border shadow-sm">
            <img src="/logo.png" alt={t.brandName} className="w-full h-full object-contain" />
          </div>
          <div 
            className={cn(
              isRtl ? "mr-3" : "ml-3",
              "flex flex-col transition-opacity duration-300 whitespace-nowrap",
              isExpanded ? "opacity-100" : "opacity-0"
            )}
          >
            <span className="font-black text-sm tracking-tight leading-tight text-sidebar-foreground">
              {t.brandName}
            </span>
            <span className="text-[10px] text-blue-400 font-bold tracking-wider">
              {t.brandTagline}
            </span>
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
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-sidebar-accent/50 hover:bg-sidebar-accent border border-sidebar-border/60 text-start transition-all group"
                    title={language === 'ar' ? 'تبديل مساحة العمل' : 'Switch Workspace'}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs">
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-semibold text-sidebar-foreground truncate leading-none">
                          {user?.organization?.name || (language === 'ar' ? 'مساحة العمل' : 'Workspace')}
                        </div>
                        <div className="text-[10px] text-muted-foreground capitalize mt-0.5 leading-none">
                          {isSuperAdmin ? 'SuperAdmin' : (user?.role || 'Member')}
                        </div>
                      </div>
                    </div>
                    <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground shrink-0 opacity-60 group-hover:opacity-100" />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="w-full flex items-center justify-center p-2 rounded-lg bg-sidebar-accent/50 hover:bg-sidebar-accent border border-sidebar-border/60 transition-all group"
                    title={user?.organization?.name || 'Workspace'}
                  >
                    <Building2 className="w-4 h-4 text-primary" />
                  </button>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRtl ? "end" : "start"} className="w-56">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  {language === 'ar' ? 'مساحات العمل المتاحة' : 'Available Workspaces'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {organizationsList.map((org: any) => {
                  const isCurrent = org.id === user?.organizationId;
                  return (
                    <DropdownMenuItem
                      key={org.id}
                      onClick={() => !isCurrent && handleSwitchOrg(org.id)}
                      className={cn(
                        "flex items-center justify-between text-xs py-2 cursor-pointer",
                        isCurrent && "font-bold text-primary bg-primary/5"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Building2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{org.name}</span>
                      </div>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                    </DropdownMenuItem>
                  );
                })}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/workspaces" className="flex items-center gap-2 text-xs text-primary cursor-pointer w-full">
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t.navWorkspaces}</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Navigation Sections */}
        <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden space-y-4 scrollbar-thin">
          {/* SuperAdmin Link */}
          {isSuperAdmin && (
            <div className="px-2 space-y-1">
              <div className={cn(
                "px-2 pb-1 text-[10px] font-bold text-amber-500 uppercase tracking-wider transition-opacity whitespace-nowrap",
                isExpanded ? "opacity-100 h-auto" : "opacity-0 h-0 overflow-hidden"
              )}>
                {t.navSuperAdmin}
              </div>
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
                <span className={cn(
                  isRtl ? "mr-2" : "ml-2",
                  "whitespace-nowrap transition-opacity",
                  isExpanded ? "opacity-100" : "opacity-0 w-0 hidden"
                )}>
                  {t.navCompanies}
                </span>
                {!isExpanded && (
                  <div className="nav-tooltip bg-popover text-popover-foreground px-2 py-1 rounded text-xs shadow-md border border-border whitespace-nowrap">
                    {t.navCompanies}
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
                    data-testid={`nav-${item.href.replace('/', '')}`}
                  >
                    <div className="flex items-center justify-center w-6 h-6 shrink-0 relative">
                      <Icon className="w-4.5 h-4.5" />
                      {item.badge && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-sidebar" />
                      )}
                    </div>
                    <span className={cn(
                      isRtl ? "mr-2" : "ml-2",
                      "whitespace-nowrap transition-opacity",
                      isExpanded ? "opacity-100" : "opacity-0 w-0 hidden"
                    )}>
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
          {/* Sidebar Collapse Toggle */}
          <button
            onClick={() => setIsPinned(!isPinned)}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-sidebar border border-sidebar-border rounded-full flex items-center justify-center text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground z-30 shadow-sm transition-transform hover:scale-110",
              isRtl ? "-left-3" : "-right-3"
            )}
            title={isPinned ? (language === 'ar' ? 'طي القائمة' : 'Collapse') : (language === 'ar' ? 'تثبيت القائمة' : 'Expand')}
          >
            {isPinned ? (
              isRtl ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />
            ) : (
              isRtl ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Quick Language Switcher Button */}
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className={cn(
              "flex items-center rounded-md text-xs font-semibold text-sidebar-foreground hover:bg-sidebar-accent hover:text-primary transition-all p-2",
              isExpanded ? "justify-between w-full" : "justify-center"
            )}
            title={language === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
          >
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-primary shrink-0" />
              <span className={cn("whitespace-nowrap transition-opacity", isExpanded ? "opacity-100" : "opacity-0 w-0 hidden")}>
                {language === 'ar' ? 'English (EN)' : 'العربية (AR)'}
              </span>
            </div>
            {isExpanded && (
              <Badge variant="outline" className="text-[9px] uppercase px-1.5 py-0 border-sidebar-border text-muted-foreground">
                {language.toUpperCase()}
              </Badge>
            )}
          </button>

          {/* User Profile Bar */}
          {user && (
            <div className={cn(
              "flex items-center rounded-md transition-all duration-300",
              isExpanded ? "p-2 bg-sidebar-accent/30" : "p-1 justify-center"
            )}>
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                {initials}
              </div>
              <div className={cn(
                isRtl ? "mr-2" : "ml-2",
                "flex flex-col min-w-0 transition-opacity",
                isExpanded ? "opacity-100" : "opacity-0 w-0 hidden"
              )}>
                <span className="text-sm font-semibold text-sidebar-foreground truncate">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-[10px] text-muted-foreground truncate font-mono">{user.email}</span>
              </div>
            </div>
          )}

          {/* Logout Button */}
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
            <span className={cn(
              isRtl ? "mr-2" : "ml-2",
              "whitespace-nowrap transition-opacity",
              isExpanded ? "opacity-100" : "opacity-0 w-0 hidden"
            )}>
              {t.logout}
            </span>
            {!isExpanded && (
              <div className="nav-tooltip bg-popover text-popover-foreground px-2 py-1 rounded text-xs shadow-md border border-border whitespace-nowrap">
                {t.logout}
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 overflow-hidden flex flex-col relative z-10 bg-background">
        {children}
      </main>
    </div>
  );
}
