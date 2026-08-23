import { useState, useEffect, useRef } from 'react';
import { useListConversations, useListMessages, useSendMessage, getListConversationsQueryKey, getListMessagesQueryKey } from '@workspace/api-client-react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { StatusBadge } from '@/components/status-badge';
import { ChannelIcon } from '@/components/channel-icon';
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  Inbox as InboxIcon, 
  Send, 
  User, 
  Bot, 
  PhoneCall, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Tag, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Building2, 
  FileText, 
  Lock, 
  Globe, 
  Layers, 
  MessageSquare, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  ExternalLink,
  ShoppingBag,
  Truck,
  Zap,
  Volume2
} from 'lucide-react';
import { formatTime, getInitials } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { getToken } from '@/lib/auth';

const CANNED_REPLIES = [
  { label: 'ترحيب بالعميل', text: 'أهلاً بك يا فندم في سند! كيف نقدر نساعدك اليوم؟ يسعدنا جداً تواصلك معنا.' },
  { label: 'تأكيد استلام الطلب', text: 'تم استلام طلبك بنجاح وجاري تجهيزه للشحن فوراً. سنرسل لك رقم التتبع بمجرد خروج الشحنة مع المندوب.' },
  { label: 'سياسة الاستبدال والاسترجاع', text: 'نوفر إمكانية الاستبدال والاسترجاع خلال 14 يوماً من استلام الشحنة، بشرط أن يكون المنتج بحالته الأصلية.' },
  { label: 'طرق الدفع المتاحة', text: 'طرق الدفع المتاحة: الدفع عند الاستلام (COD)، المحافظ الإلكترونية (فودافون كاش / إنستاباي)، والبطاقات البنكية.' },
];

export default function Inbox() {
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [isNewDealOpen, setIsNewDealOpen] = useState(false);
  const [newDealTitle, setNewDealTitle] = useState('');
  const [newDealAmount, setNewDealAmount] = useState('');

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ─── 1. Fetch Conversations with Live Polling (3s) ──────────────────────────
  const { data: conversations = [], isLoading } = useListConversations(
    statusFilter === 'all' ? {} : { status: statusFilter as any },
    { query: {
      queryKey: getListConversationsQueryKey(statusFilter === 'all' ? {} : { status: statusFilter as any }),
      refetchInterval: 3000,
      refetchIntervalInBackground: true,
    }}
  );

  // ─── 2. Fetch Messages for Selected Conversation (2s) ───────────────────────
  const { data: messages = [] } = useListMessages(
    selectedConversationId || 0,
    { query: {
      enabled: !!selectedConversationId,
      queryKey: getListMessagesQueryKey(selectedConversationId || 0),
      refetchInterval: 2000,
      refetchIntervalInBackground: false,
    }}
  );

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectedConversation = conversations.find((c) => c.id === selectedConversationId);

  // ─── 3. Fetch Customer Deals / Orders for 360° Operations Panel ─────────────
  const { data: customerDeals = [], refetch: refetchDeals } = useQuery({
    queryKey: ['customer-deals', selectedConversation?.contact?.id],
    enabled: !!selectedConversation?.contact?.id,
    queryFn: async () => {
      const token = getToken();
      const res = await fetch('/api/deals', {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (!res.ok) return [];
      const allDeals = await res.json();
      return allDeals.filter((d: any) => d.contactId === selectedConversation?.contact?.id);
    },
  });

  // ─── 4. Send Message (Public Reply or Internal Note) ─────────────────────────
  const handleSendMessage = async () => {
    if (!messageContent.trim() || !selectedConversationId) return;

    try {
      const token = getToken();
      const res = await fetch(`/api/conversations/${selectedConversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          content: messageContent,
          isPrivate: isInternalNote,
          messageType: isInternalNote ? 'internal_note' : 'text',
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to send message');
      }

      setMessageContent('');
      queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey(selectedConversationId) });
      queryClient.invalidateQueries({ queryKey: getListConversationsQueryKey({}) });
    } catch (err: any) {
      toast({
        title: 'فشل إرسال الرسالة',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  // ─── 5. AI Copilot (Generate Instant Suggested Reply) ────────────────────────
  const handleAiCopilot = async () => {
    if (!selectedConversationId || !selectedConversation) return;
    setIsAiGenerating(true);

    try {
      const token = getToken();
      const lastIncoming = [...messages].reverse().find(m => m.senderType === 'contact')?.content || 'مرحباً';

      const res = await fetch('/api/ai-settings/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          message: lastIncoming,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'AI Copilot failed');
      }

      const data = await res.json();
      if (data.reply) {
        setMessageContent(data.reply);
        toast({
          title: '✨ تم توليد الرد الذكي',
          description: 'يمكنك مراجعة الرد وتعديله ثم إرساله للعميل.',
        });
      }
    } catch (err: any) {
      toast({
        title: 'فشل اقتراح الرد',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsAiGenerating(false);
    }
  };

  // ─── 6. Toggle AI Auto-Pilot on this conversation ────────────────────────────
  const handleToggleAiHandled = async (enabled: boolean) => {
    if (!selectedConversationId) return;

    try {
      const token = getToken();
      await fetch(`/api/conversations/${selectedConversationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          aiHandled: enabled,
        }),
      });

      queryClient.invalidateQueries({ queryKey: getListConversationsQueryKey({}) });
      toast({
        title: enabled ? '🤖 تم تفعيل الرد التلقائي' : '👤 تم تحويل المحادثة للرد اليدوي',
        description: enabled ? 'الذكاء الاصطناعي سيرد تلقائياً على رسائل العميل.' : 'تم إيقاف البوت لهذه المحادثة.',
      });
    } catch (err: any) {
      toast({ title: 'فشل تعديل الإعداد', description: err.message, variant: 'destructive' });
    }
  };

  // ─── 7. Create Quick E-Commerce Deal / Order ─────────────────────────────────
  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDealTitle || !selectedConversation?.contact?.id) return;

    try {
      const token = getToken();
      await fetch('/api/deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          contactId: selectedConversation.contact.id,
          title: newDealTitle,
          value: newDealAmount || '0',
          currency: 'EGP',
          status: 'open',
        }),
      });

      setIsNewDealOpen(false);
      setNewDealTitle('');
      setNewDealAmount('');
      refetchDeals();
      toast({ title: '✅ تم إنشاء الطلب/الصفقة بنجاح' });
    } catch (err: any) {
      toast({ title: 'فشل إنشاء الطلب', description: err.message, variant: 'destructive' });
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    // Channel filter
    if (channelFilter !== 'all' && c.channelType !== channelFilter) return false;
    // Search query
    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase();
      const name = `${c.contact?.firstName || ''} ${c.contact?.lastName || ''}`.toLowerCase();
      const lastMsg = (c.lastMessage || '').toLowerCase();
      return name.includes(term) || lastMsg.includes(term);
    }
    return true;
  });

  return (
    <div className="flex-1 flex overflow-hidden bg-background">
      {/* ========================================================================= */}
      {/* COLUMN 1: Conversations List & Tashgheel Operations Filter Panel           */}
      {/* ========================================================================= */}
      <div className="w-84 md:w-96 border-r border-border flex flex-col bg-card shrink-0">
        {/* Top Header */}
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-foreground">صندوق العمليات الموحد</h2>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono bg-muted">
              {filteredConversations.length} محادثة
            </Badge>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="بحث بالاسم أو الرقم أو الرسالة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-9 h-9 text-xs bg-muted/30"
            />
          </div>

          {/* Omni-Channel Filter Tabs (Tashgheel Style) */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'الكل' },
              { id: 'whatsapp', label: 'واتساب', icon: 'whatsapp' },
              { id: 'instagram', label: 'انستغرام', icon: 'instagram' },
              { id: 'messenger', label: 'ماسنجر', icon: 'messenger' },
            ].map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => setChannelFilter(ch.id)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5",
                  channelFilter === ch.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {ch.icon && <ChannelIcon channelType={ch.icon as any} />}
                <span>{ch.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Conversation List Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-border/60">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-muted-foreground">جاري تحميل المحادثات...</div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center justify-center space-y-2 text-muted-foreground">
              <InboxIcon className="w-8 h-8 opacity-40" />
              <p className="text-xs">لا توجد محادثات مطابقة للفلاتر</p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = selectedConversationId === conv.id;
              const contactName = conv.contact
                ? `${conv.contact.firstName || ''} ${conv.contact.lastName || ''}`.trim()
                : 'عميل غير مسجل';

              return (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => setSelectedConversationId(conv.id)}
                  className={cn(
                    "w-full p-3.5 text-right transition-all flex items-start gap-3 hover:bg-muted/40 relative group",
                    isSelected && "bg-primary/5 border-l-4 border-primary"
                  )}
                >
                  <div className="relative shrink-0">
                    <Avatar className="w-10 h-10 border border-border">
                      <AvatarImage src={conv.contact?.avatarUrl || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                        {conv.contact ? getInitials(conv.contact.firstName, conv.contact.lastName) : <User className="w-4 h-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -left-1 p-0.5 rounded-full bg-card shadow-sm">
                      <ChannelIcon channelType={conv.channelType} />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <p className="font-semibold text-xs text-foreground truncate">{contactName}</p>
                      <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                        {formatTime(conv.lastMessageAt || conv.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground truncate leading-snug">
                      {conv.lastMessage || 'لا توجد رسائل'}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-1">
                      <div className="flex items-center gap-1.5">
                        <StatusBadge status={conv.status} variant="compact" />
                        {conv.aiHandled && (
                          <Badge variant="outline" className="text-[9px] px-1 py-0 bg-primary/10 text-primary border-primary/20 flex items-center gap-1">
                            <Bot className="w-2.5 h-2.5" /> Auto-Pilot
                          </Badge>
                        )}
                      </div>

                      {(conv.unreadCount || 0) > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground font-bold text-[10px] shadow-sm">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COLUMN 2: Realtime Chat Stream & Omni-Channel AI Action Bar               */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 bg-background border-r border-border">
        {!selectedConversation ? (
          <EmptyState
            icon={InboxIcon}
            title="لم يتم تحديد أي محادثة"
            description="اختر محادثة من القائمة لبدء الرد على العميل ومتابعة العمليات."
          />
        ) : (
          <>
            {/* Chat Top Bar */}
            <div className="p-3.5 px-6 border-b border-border bg-card flex items-center justify-between gap-4 shrink-0 shadow-sm">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="w-10 h-10 border border-border">
                  <AvatarImage src={selectedConversation.contact?.avatarUrl || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                    {selectedConversation.contact
                      ? getInitials(selectedConversation.contact.firstName, selectedConversation.contact.lastName)
                      : <User className="w-5 h-5" />}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-foreground truncate">
                      {selectedConversation.contact
                        ? `${selectedConversation.contact.firstName} ${selectedConversation.contact.lastName}`
                        : 'عميل غير مسجل'}
                    </p>
                    <ChannelIcon channelType={selectedConversation.channelType} />
                  </div>
                  <p className="text-xs text-muted-foreground font-mono truncate">
                    {(selectedConversation.contact as any)?.phone || 'قناة تواصل رقمية'}
                  </p>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-3">
                {/* AI Auto-Pilot Switch */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/40 border border-border">
                  <Bot className={cn("w-4 h-4", selectedConversation.aiHandled ? "text-primary" : "text-muted-foreground")} />
                  <span className="text-xs font-medium hidden sm:inline">AI Auto-Reply</span>
                  <Switch
                    checked={selectedConversation.aiHandled}
                    onCheckedChange={handleToggleAiHandled}
                  />
                </div>

                {/* Toggle 360 CRM Panel Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground"
                  onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
                  title="لوحة العميل والعمليات"
                >
                  {isRightPanelOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/15">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-xs">لا توجد رسائل سابقة في هذه المحادثة.</div>
              ) : (
                messages.map((msg) => {
                  const isContact = msg.senderType === 'contact';
                  const isAi = msg.senderType === 'ai';
                  const isNote = msg.isPrivate || (msg.messageType as string) === 'internal_note';
                  const isVoiceCall = (msg.messageType as string) === 'voice_call';

                  // 1. Internal Note Rendering (Tashgheel Yellow Sticky Note style)
                  if (isNote) {
                    return (
                      <div key={msg.id} className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 my-2 space-y-1">
                        <div className="flex items-center justify-between font-bold text-[10px] text-amber-700 dark:text-amber-400">
                          <span className="flex items-center gap-1">
                            <Lock className="w-3 h-3" /> ملاحظة داخلية لفريق العمل
                          </span>
                          <span>{formatTime(msg.createdAt)}</span>
                        </div>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    );
                  }

                  // 2. Voice Call Summary Card Rendering
                  if (isVoiceCall) {
                    return (
                      <div key={msg.id} className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs my-3 space-y-2 max-w-lg mx-auto shadow-sm">
                        <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300 font-bold">
                          <span className="flex items-center gap-1.5">
                            <PhoneCall className="w-4 h-4" /> تقرير مكالمة صوتية (Voice AI)
                          </span>
                          <span className="text-[10px] font-mono">{formatTime(msg.createdAt)}</span>
                        </div>
                        <p className="text-foreground whitespace-pre-wrap leading-relaxed font-sans">{msg.content}</p>
                      </div>
                    );
                  }

                  // 3. Regular Chat Bubbles
                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex items-end gap-2.5 max-w-[80%]",
                        isContact ? "mr-auto flex-row-reverse" : "ml-auto"
                      )}
                    >
                      {!isContact && (
                        <Avatar className="w-7 h-7 shrink-0 border border-border">
                          <AvatarFallback className={cn("text-[10px] font-bold", isAi ? "bg-primary text-primary-foreground" : "bg-muted")}>
                            {isAi ? <Bot className="w-3.5 h-3.5" /> : 'A'}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={cn(
                          "p-3.5 rounded-2xl text-xs space-y-1 shadow-sm leading-relaxed",
                          isContact
                            ? "bg-card border border-border text-foreground rounded-br-none"
                            : isAi
                            ? "bg-gradient-to-br from-primary/95 to-primary text-primary-foreground rounded-bl-none shadow-primary/20"
                            : "bg-primary text-primary-foreground rounded-bl-none"
                        )}
                      >
                        {!isContact && (
                          <div className="flex items-center gap-1.5 text-[10px] opacity-80 pb-0.5 border-b border-white/15">
                            {isAi ? (
                              <span className="flex items-center gap-1 font-bold">
                                <Sparkles className="w-2.5 h-2.5" /> سند AI
                              </span>
                            ) : (
                              <span>{msg.senderName || 'موظف الدعم'}</span>
                            )}
                          </div>
                        )}

                        <p className="whitespace-pre-wrap">{msg.content}</p>

                        <div className={cn("text-[9px] font-mono text-left pt-0.5 opacity-70")}>
                          {formatTime(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Omni-Channel Input Bar */}
            <div className="p-4 border-t border-border bg-card space-y-2 shrink-0">
              {/* Quick Actions Header */}
              <div className="flex items-center justify-between gap-2">
                {/* Public vs Internal Note Toggle */}
                <div className="flex items-center gap-1 bg-muted/50 p-0.5 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setIsInternalNote(false)}
                    className={cn(
                      "px-3 py-1 rounded-md transition-all font-medium flex items-center gap-1",
                      !isInternalNote ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Globe className="w-3 h-3" /> رد على العميل
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsInternalNote(true)}
                    className={cn(
                      "px-3 py-1 rounded-md transition-all font-medium flex items-center gap-1",
                      isInternalNote ? "bg-amber-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Lock className="w-3 h-3" /> ملاحظة داخلية
                  </button>
                </div>

                {/* AI Copilot & Canned Replies */}
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1.5 text-primary border-primary/20 hover:bg-primary/10"
                    onClick={handleAiCopilot}
                    disabled={isAiGenerating}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{isAiGenerating ? 'جاري الاقتراح...' : 'اقتراح رد ذكي'}</span>
                  </Button>

                  {/* Canned Responses selector */}
                  <select
                    className="h-7 text-[11px] rounded-md border border-border bg-card px-2 text-foreground focus:ring-1 focus:ring-primary"
                    onChange={(e) => {
                      if (e.target.value) {
                        setMessageContent(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  >
                    <option value="">ردود سريعة...</option>
                    {CANNED_REPLIES.map((c, i) => (
                      <option key={i} value={c.text}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Text Input Area */}
              <div className="flex items-end gap-2">
                <Textarea
                  placeholder={isInternalNote ? "اكتب ملاحظة داخلية لفريق العمل (لن يراها العميل)..." : "اكتب ردك للعميل (Enter للإرسال)..."}
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className={cn(
                    "resize-none text-xs min-h-[64px]",
                    isInternalNote && "bg-amber-500/5 border-amber-500/30 focus-visible:ring-amber-500"
                  )}
                  rows={2}
                />

                <Button
                  onClick={handleSendMessage}
                  disabled={!messageContent.trim()}
                  className={cn("h-16 px-5", isInternalNote ? "bg-amber-600 hover:bg-amber-700 text-white" : "")}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ========================================================================= */}
      {/* COLUMN 3: 360° Customer Operations & E-Commerce CRM Sidebar (Tashgheel)   */}
      {/* ========================================================================= */}
      {isRightPanelOpen && selectedConversation && (
        <div className="w-80 border-l border-border bg-card flex flex-col shrink-0 overflow-y-auto p-5 space-y-6 animate-in slide-in-from-right-4 duration-300">
          {/* Customer Profile Card */}
          <div className="text-center space-y-2 pb-4 border-b border-border">
            <Avatar className="w-16 h-16 mx-auto border-2 border-primary/20">
              <AvatarImage src={selectedConversation.contact?.avatarUrl || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                {selectedConversation.contact
                  ? getInitials(selectedConversation.contact.firstName, selectedConversation.contact.lastName)
                  : <User className="w-7 h-7" />}
              </AvatarFallback>
            </Avatar>

            <div>
              <h3 className="font-bold text-sm text-foreground">
                {selectedConversation.contact
                  ? `${selectedConversation.contact.firstName} ${selectedConversation.contact.lastName}`
                  : 'عميل غير مسجل'}
              </h3>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                {(selectedConversation.contact as any)?.phone || 'لا يوجد رقم هاتف'}
              </p>
            </div>

            {/* Quick WhatsApp chat trigger */}
            {(selectedConversation.contact as any)?.phone && (
              <a
                href={`https://wa.me/${((selectedConversation.contact as any)?.phone || '').replace(/[^\d]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-600 hover:underline font-medium pt-1"
              >
                <ExternalLink className="w-3 h-3" /> فتح مباشر في واتساب
              </a>
            )}
          </div>

          {/* E-Commerce Orders & Deals Widget (Tashgheel Core Feature) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-primary" /> الطلبات والصفقات ({customerDeals.length})
              </h4>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-[11px] px-2 text-primary gap-1"
                onClick={() => setIsNewDealOpen(true)}
              >
                <Plus className="w-3 h-3" /> طلب جديد
              </Button>
            </div>

            {customerDeals.length === 0 ? (
              <div className="p-3 rounded-lg bg-muted/40 border border-border text-center text-xs text-muted-foreground">
                لا توجد طلبات مسجلة لهذا العميل حتى الآن.
              </div>
            ) : (
              <div className="space-y-2">
                {customerDeals.map((deal: any) => (
                  <div key={deal.id} className="p-3 rounded-xl bg-muted/30 border border-border/80 text-xs space-y-1.5 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="truncate">{deal.title}</span>
                      <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                        {deal.value} {deal.currency || 'EGP'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Truck className="w-3 h-3" /> {deal.status === 'won' ? 'تم التسليم' : 'قيد التجهيز'}
                      </span>
                      <span>#{deal.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Customer Tags Card */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-primary" /> تصنيفات ووسوم العميل
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {['عميل VIP ⭐', 'واتساب نشط', 'مهتم بالشحن السريع', 'عميل متكرر'].map((t, i) => (
                <Badge key={i} variant="secondary" className="text-[10px] px-2 py-0.5 cursor-pointer hover:bg-primary/20">
                  {t}
                </Badge>
              ))}
            </div>
          </div>

          {/* Operational Metrics for this conversation */}
          <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/15 space-y-2 text-xs">
            <div className="flex items-center justify-between text-muted-foreground text-[11px]">
              <span>زمن أول استجابة (FRT):</span>
              <span className="font-bold text-foreground">12 ثانية ⚡</span>
            </div>
            <div className="flex items-center justify-between text-muted-foreground text-[11px]">
              <span>نسبة أتمتة الـ AI:</span>
              <span className="font-bold text-emerald-600">85% ذاتي</span>
            </div>
          </div>
        </div>
      )}

      {/* New Order / Deal Dialog */}
      <Dialog open={isNewDealOpen} onOpenChange={setIsNewDealOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>تسجيل طلب / صفقة جديدة للعميل</DialogTitle>
            <DialogDescription>
              أدخل تفاصيل الطلب لربطه فورياً بحساب وسجل العميل.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateDeal} className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">عنوان / تفاصيل الطلب *</label>
              <Input
                placeholder="مثال: باقة اشتراك سنوي أو أوردر رقم 1055"
                value={newDealTitle}
                onChange={(e) => setNewDealTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">قيمة الطلب (EGP)</label>
              <Input
                type="number"
                placeholder="500"
                value={newDealAmount}
                onChange={(e) => setNewDealAmount(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsNewDealOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit">
                حفظ الطلب
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
