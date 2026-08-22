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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { formatTime, formatDateTime } from '@/lib/utils';
import { getToken } from '@/lib/auth';
import { VoiceCallModal } from '@/components/voice-call-modal';
import { StatusBadge } from '@/components/status-badge';

import { useLanguage } from '@/lib/i18n';

export default function VoicePage() {
  const { language, t } = useLanguage();
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
    <div className="flex-1 space-y-6 p-6 md:p-8 overflow-y-auto bg-background/50">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-[1600px] mx-auto">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              <PhoneCall className="w-6 h-6" />
            </span>
            {t.voiceTitle}
          </h1>
          <p className="text-muted-foreground text-sm mt-1 font-medium">
            {t.voiceSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsDialModalOpen(true)}
            className="gap-2 h-10 rounded-xl px-5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
          >
            <PhoneOutgoing className="w-4 h-4" />
            <span>{t.startCall}</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[1600px] mx-auto">
        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-bold">
            <span>إجمالي المكالمات</span>
            <Phone className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold text-foreground">{totalCalls}</p>
          <span className="text-[11px] text-muted-foreground">صوتية واردة وصادرة</span>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-bold">
            <span>إجمالي الدقائق</span>
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <p className="text-3xl font-extrabold text-foreground">{totalMinutes} <span className="text-base font-normal">دقيقة</span></p>
          <span className="text-[11px] text-muted-foreground">تحدث صوتي تفاعلي</span>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-bold">
            <span>نسبة حل الاستفسارات</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-600">92%</p>
          <span className="text-[11px] text-muted-foreground">دون الحاجة لموظف بشري</span>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-bold">
            <span>بروتوكول المعالجة</span>
            <Server className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-lg font-bold text-foreground">OpenAI Realtime</p>
          <span className="text-[11px] text-emerald-600 font-bold">Speech-to-Speech ⚡</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4 max-w-[1600px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-foreground">سجل المكالمات الصوتية المفصل</h2>
            <p className="text-xs text-muted-foreground">استعراض تفريغ الحوار الكامل، الملخص الذكي، وتفاصيل المتصل</p>
          </div>

          <div className="relative w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="بحث بالرقم أو اسم العميل..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9 h-9 text-xs bg-muted/30"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-xs text-muted-foreground">جاري تحميل سجل المكالمات...</div>
        ) : filteredSessions.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground">لا توجد مكالمات صوتية مسجلة حتى الآن.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right">
              <thead>
                <tr className="border-b border-border text-muted-foreground pb-2 font-bold">
                  <th className="py-3">النوع</th>
                  <th className="py-3">العميل / الطرف الآخر</th>
                  <th className="py-3">رقم الهاتف</th>
                  <th className="py-3">المدة</th>
                  <th className="py-3">الحالة</th>
                  <th className="py-3">التوقيت</th>
                  <th className="py-3 text-center">التفاصيل والتفريغ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredSessions.map((session: any) => {
                  const isInbound = session.direction === 'inbound';
                  const contactName = session.contact
                    ? `${session.contact.firstName || ''} ${session.contact.lastName || ''}`.trim()
                    : 'عميل جديد';

                  return (
                    <tr key={session.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3.5">
                        <span className="inline-flex items-center gap-1.5 font-bold">
                          {isInbound ? (
                            <span className="p-1 rounded-md bg-blue-500/10 text-blue-600 flex items-center gap-1 text-[11px]">
                              <PhoneIncoming className="w-3.5 h-3.5" /> واردة
                            </span>
                          ) : (
                            <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center gap-1 text-[11px]">
                              <PhoneOutgoing className="w-3.5 h-3.5" /> صادرة
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="py-3.5 font-bold text-foreground">{contactName}</td>
                      <td className="py-3.5 font-mono text-muted-foreground">
                        {session.callerNumber || session.calleeNumber || 'غير متوفر'}
                      </td>
                      <td className="py-3.5 font-mono font-bold">
                        {Math.floor((session.durationSeconds || 0) / 60)}:
                        {String((session.durationSeconds || 0) % 60).padStart(2, '0')} د
                      </td>
                      <td className="py-3.5">
                        <StatusBadge status={session.status} variant="compact" />
                      </td>
                      <td className="py-3.5 font-mono text-muted-foreground text-[11px]">
                        {formatDateTime(session.createdAt)}
                      </td>
                      <td className="py-3.5 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs gap-1.5"
                          onClick={() => setSelectedSession(session)}
                        >
                          <FileText className="w-3.5 h-3.5" /> عرض الملخص والتفريغ
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Session Details Modal */}
      {selectedSession && (
        <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
          <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto font-sans">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-emerald-600" />
                تفاصيل المكالمة الصوتية #{selectedSession.sessionId}
              </DialogTitle>
              <DialogDescription>
                تفريغ الحوار الكامل والملخص التحليلي بالذكاء الاصطناعي
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              {/* Summary Card */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-primary text-xs">
                  <Sparkles className="w-4 h-4" /> ملخص المكالمة التنفيذي:
                </div>
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {selectedSession.summary || 'تم تسجيل المكالمة بنجاح.'}
                </p>
              </div>

              {/* Transcript */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> نص وتفريغ المكالمة (Transcript):
                </h4>
                <div className="p-4 rounded-xl bg-muted/40 border border-border text-xs max-h-60 overflow-y-auto space-y-2">
                  <p className="whitespace-pre-wrap font-sans leading-relaxed text-foreground">
                    {selectedSession.transcript || 'لا يوجد نص مسجل'}
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Outbound Dial Modal */}
      <Dialog open={isDialModalOpen} onOpenChange={setIsDialModalOpen}>
        <DialogContent className="sm:max-w-[420px] font-sans">
          <DialogHeader>
            <DialogTitle>إجراء مكالمة هاتفية ذكية</DialogTitle>
            <DialogDescription>
              سيتصل المساعد الذكي بالعميل مباشرة للرد على الاستفسارات أو تأكيد الطلب
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLaunchCall} className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">اسم العميل (اختياري)</label>
              <Input
                placeholder="سعد العتيبي"
                value={dialContactName}
                onChange={(e) => setDialContactName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">رقم الهاتف / الجوال *</label>
              <Input
                placeholder="+966501234567"
                value={dialPhoneNumber}
                onChange={(e) => setDialPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsDialModalOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                <PhoneOutgoing className="w-4 h-4" /> بدء الاتصال
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
    </div>
  );
}
