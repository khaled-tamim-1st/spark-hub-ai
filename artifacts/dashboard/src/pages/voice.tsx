import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Phone, 
  PhoneIncoming, 
  PhoneOutgoing, 
  PhoneCall, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Activity, 
  Search, 
  Play, 
  FileText, 
  Bot, 
  Server, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { formatTime } from '@/lib/utils';
import { getToken } from '@/lib/auth';
import { VoiceCallModal } from '@/components/voice-call-modal';

export default function VoicePage() {
  const [search, setSearch] = useState('');
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const [isDialModalOpen, setIsDialModalOpen] = useState(false);
  const [dialPhoneNumber, setDialPhoneNumber] = useState('');
  const [dialContactName, setDialContactName] = useState('');
  const [isCallActiveModalOpen, setIsCallActiveModalOpen] = useState(false);

  const queryClient = useQueryClient();

  // Fetch Voice Sessions
  const { data: sessions = [], isLoading, refetch } = useQuery({
    queryKey: ['voice-sessions'],
    queryFn: async () => {
      const token = getToken();
      const res = await fetch('/api/voice/sessions', {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error('Failed to fetch voice sessions');
      return res.json();
    },
    refetchInterval: 5000,
  });

  // Fetch Providers Config
  const { data: providerInfo } = useQuery({
    queryKey: ['voice-providers'],
    queryFn: async () => {
      const token = getToken();
      const res = await fetch('/api/voice/providers', {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) return null;
      return res.json();
    },
  });

  const filteredSessions = sessions.filter((s: any) => {
    const term = search.toLowerCase();
    const contactName = `${s.contact?.firstName || ''} ${s.contact?.lastName || ''}`.toLowerCase();
    const caller = (s.callerNumber || '').toLowerCase();
    const callee = (s.calleeNumber || '').toLowerCase();
    return contactName.includes(term) || caller.includes(term) || callee.includes(term);
  });

  const totalCalls = sessions.length;
  const totalDurationSeconds = sessions.reduce((acc: number, s: any) => acc + (s.durationSeconds || 0), 0);
  const totalMinutes = Math.round(totalDurationSeconds / 60);

  const handleLaunchCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dialPhoneNumber.trim()) return;
    setIsDialModalOpen(false);
    setIsCallActiveModalOpen(true);
  };

  return (
    <div className="flex-1 space-y-6 p-8 overflow-y-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <span className="p-2 rounded-xl bg-primary/10 text-primary">
              <PhoneCall className="w-7 h-7" />
            </span>
            Voice AI Calls
          </h1>
          <p className="text-muted-foreground mt-1">
            مكالمات الذكاء الاصطناعي الصوتية الفورية ومراقبة الخطوط الهاتفية (Speech-to-Speech Realtime).
          </p>
        </div>

        <Button 
          onClick={() => {
            setDialPhoneNumber('+201000000000');
            setDialContactName('عميل تجريبي');
            setIsDialModalOpen(true);
          }}
          className="shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <Phone className="w-4 h-4" />
          بدء مكالمة صوتية جديدة
        </Button>
      </div>

      {/* Provider Status Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/60 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>مزود الاتصالات الحالي</span>
              <Server className="w-4 h-4 text-primary" />
            </CardDescription>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {providerInfo?.activeProvider === 'generic_sip' ? 'Generic SIP / Telecom Gateway' : 'Simulator / Mock Provider'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {providerInfo?.activeProvider === 'generic_sip' 
              ? 'جاهز للربط مع مزودي الاتصالات المصريين أو السحابيين عبر SIP Trunk.'
              : 'وضع المحاكاة نشط للاختبارات وتجربة الصوت Realtime.'}
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>محرك الصوت Realtime</span>
              <Bot className="w-4 h-4 text-emerald-500" />
            </CardDescription>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              {providerInfo?.isOpenAiConfigured ? (
                <span className="text-emerald-500 flex items-center gap-1.5 text-sm">
                  <ShieldCheck className="w-4 h-4" /> OpenAI Realtime متصل
                </span>
              ) : (
                <span className="text-amber-500 flex items-center gap-1.5 text-sm">
                  <AlertCircle className="w-4 h-4" /> يتطلب OPENAI_API_KEY
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            يعمل بنفس تعليمات الـ AI وقاعدة المعرفة المشتركة لجميع القنوات.
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>إجمالي المكالمات والدقائق</span>
              <Clock className="w-4 h-4 text-blue-500" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-foreground">
              {totalCalls} <span className="text-sm font-normal text-muted-foreground">مكالمة ({totalMinutes} دقيقة)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            100% معالجة ذاتية بالذكاء الاصطناعي مع تقارير فورية.
          </CardContent>
        </Card>
      </div>

      {/* Call History Table */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
          <div>
            <CardTitle className="text-lg font-semibold">سجل المكالمات الصوتية (Call Logs)</CardTitle>
            <CardDescription>عرض تفاصيل المكالمات الواردة والصادرة مع النص المسجل والملخص الذكي.</CardDescription>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="بحث بالرقم أو الاسم..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-12 text-center text-muted-foreground text-sm">جاري تحميل سجل المكالمات...</div>
          ) : filteredSessions.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <Phone className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-foreground">لا توجد مكالمات مسجلة حتى الآن</p>
              <p className="text-xs text-muted-foreground max-w-sm">
                يمكنك الضغط على "بدء مكالمة صوتية جديدة" لبدء تجربة Voice AI مباشرة.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="bg-muted/40 text-muted-foreground text-xs uppercase border-b border-border/50">
                  <tr>
                    <th className="py-3 px-4">الاتجاه</th>
                    <th className="py-3 px-4">الطرف المتصل</th>
                    <th className="py-3 px-4">الحالة</th>
                    <th className="py-3 px-4">المدة</th>
                    <th className="py-3 px-4">التاريخ والوقت</th>
                    <th className="py-3 px-4 text-center">التفاصيل والملخص</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredSessions.map((session: any) => (
                    <tr key={session.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-4">
                        {session.direction === 'inbound' ? (
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 flex items-center gap-1 w-fit">
                            <PhoneIncoming className="w-3 h-3" /> واردة
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 flex items-center gap-1 w-fit">
                            <PhoneOutgoing className="w-3 h-3" /> صادرة
                          </Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-medium">
                        <div>
                          <span>
                            {session.contact 
                              ? `${session.contact.firstName || ''} ${session.contact.lastName || ''}`.trim()
                              : (session.calleeNumber || session.callerNumber || 'غير معروف')}
                          </span>
                          <span className="block text-xs font-mono text-muted-foreground">
                            {session.direction === 'outbound' ? session.calleeNumber : session.callerNumber}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {session.status === 'ended' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-500 text-xs font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> مكتملة
                          </span>
                        ) : session.status === 'active' ? (
                          <span className="inline-flex items-center gap-1 text-blue-500 text-xs font-medium animate-pulse">
                            <Activity className="w-3.5 h-3.5" /> جارية الآن
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-muted-foreground text-xs">
                            {session.status}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs">
                        {Math.floor((session.durationSeconds || 0) / 60)}:
                        {((session.durationSeconds || 0) % 60).toString().padStart(2, '0')}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground">
                        {formatTime(session.createdAt || session.startedAt)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1.5 text-xs text-primary"
                          onClick={() => setSelectedSession(session)}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          عرض التقرير
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual Outbound Dial Dialog */}
      <Dialog open={isDialModalOpen} onOpenChange={setIsDialModalOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>بدء مكالمة صوتية تجريبية</DialogTitle>
            <DialogDescription>
              أدخل رقم الهاتف لبدء مكالمة صوتية فورية باستخدام AI Voice Agent.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLaunchCall} className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">اسم العميل (اختياري)</label>
              <Input
                placeholder="خالد تميم"
                value={dialContactName}
                onChange={(e) => setDialContactName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">رقم الهاتف *</label>
              <Input
                placeholder="+201000000000"
                value={dialPhoneNumber}
                onChange={(e) => setDialPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsDialModalOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit" className="gap-2">
                <Phone className="w-4 h-4" />
                اتصال الآن
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Active Call HUD Modal */}
      {isCallActiveModalOpen && (
        <VoiceCallModal
          isOpen={isCallActiveModalOpen}
          onClose={() => {
            setIsCallActiveModalOpen(false);
            refetch();
          }}
          phoneNumber={dialPhoneNumber}
          contactName={dialContactName || 'Customer'}
          onCallEnded={() => refetch()}
        />
      )}

      {/* Details & Transcript Modal */}
      {selectedSession && (
        <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
          <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                تقرير وتفريغ المكالمة الصوتية
              </DialogTitle>
              <DialogDescription>
                Session ID: {selectedSession.sessionId}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              {/* Call Summary Card */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/15 space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <Sparkles className="w-4 h-4" /> ملخص الذكاء الاصطناعي (AI Summary)
                </div>
                <p className="text-xs text-foreground whitespace-pre-wrap leading-relaxed">
                  {selectedSession.summary || 'لا يوجد ملخص متاح لهذه المكالمة.'}
                </p>
              </div>

              {/* Transcript */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  نص الحوار المسجل (Full Transcript)
                </h4>
                <div className="p-4 rounded-xl bg-muted/40 border border-border text-xs text-foreground font-mono whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed">
                  {selectedSession.transcript || 'لا يوجد تفريغ نصي مسجل.'}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
