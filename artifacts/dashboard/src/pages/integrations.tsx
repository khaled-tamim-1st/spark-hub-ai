import { useEffect, useState } from 'react';
import { useListChannels, useCreateChannel, useDeleteChannel, getListChannelsQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getToken } from '@/lib/auth';
import { useLanguage } from '@/lib/i18n';
import { Plus, Trash2, CheckCircle2, Settings, Zap, RefreshCw, QrCode, Phone, ExternalLink } from 'lucide-react';

const INTEGRATION_TYPES = [
  {
    name: 'واتساب ويب (WhatsApp Web)',
    nameEn: 'WhatsApp Web',
    type: 'whatsapp',
    provider: 'whatsapp_web',
    description: 'ربط رقم واتساب المتجر لمسح الرمز والاستقبال والرد التلقائي عبر الذكاء الاصطناعي',
    descriptionEn: 'Connect store WhatsApp number by scanning QR code for AI auto-reply',
    icon: '💬',
    fields: [],
  },
  {
    name: 'متجر سلة (Salla)',
    nameEn: 'Salla Store',
    type: 'salla',
    provider: 'salla_ecommerce',
    description: 'ربط متجرك على منصة سلة لمزامنة الطلبات والمنتجات وحالات الشحن والخصومات مع الـ AI',
    descriptionEn: 'Connect your Salla store for orders, products, and AI store automation',
    icon: '🛒',
    fields: [
      { key: 'accessToken', label: 'رمز الوصول (Salla Access Token)', type: 'password' },
      { key: 'storeId', label: 'معرّف المتجر (Store ID / Merchant ID)' },
    ],
  },
  {
    name: 'شركات الشحن والتوصيل (Shipping & Couriers)',
    nameEn: 'Saudi Shipping & Couriers',
    type: 'shipping',
    provider: 'saudi_shipping',
    description: 'ربط شركات الشحن (SMSA, Aramex, RedBox, SPL, OTO) لتمكين الـ AI من تتبع الشحنات للعملاء',
    descriptionEn: 'Connect SMSA, Aramex, RedBox, SPL & OTO for instant order tracking',
    icon: '🚚',
    fields: [
      { key: 'apiKey', label: 'مفتاح الربط (API Key / Tracking Token)', type: 'password' },
      { key: 'defaultCourier', label: 'شركة الشحن الافتراضية (SMSA / Aramex / RedBox / SPL / OTO)' },
    ],
  },
  {
    name: 'فيسبوك ماسنجر (Facebook Messenger)',
    nameEn: 'Facebook Messenger',
    type: 'messenger',
    provider: 'meta_graph',
    description: 'ربط صفحة فيسبوك لإدارة محادثات الصفحة والردود التلقائية',
    descriptionEn: 'Connect Facebook Page to manage customer inquiries and messages',
    icon: '📘',
    fields: [
      { key: 'pageId', label: 'Page ID' },
      { key: 'accessToken', label: 'Page Access Token', type: 'password' },
    ],
  },
  {
    name: 'انستغرام (Instagram Direct)',
    nameEn: 'Instagram Direct',
    type: 'instagram',
    provider: 'meta_graph',
    description: 'استقبال والرد على الرسائل المباشرة لحساب انستغرام التجاري',
    descriptionEn: 'Handle Instagram Direct Messages from your professional account',
    icon: '📸',
    fields: [
      { key: 'pageId', label: 'Instagram Account ID' },
      { key: 'accessToken', label: 'Access Token', type: 'password' },
    ],
  },
  {
    name: 'ودجت المحادثة للموقع (Web Chat Widget)',
    nameEn: 'Web Chat Widget',
    type: 'web',
    provider: 'widget',
    description: 'تثبيت زر المحادثة الحية المباشرة في متجرك أو موقعك الإلكتروني',
    descriptionEn: 'Embed a modern live chat widget on your store or website',
    icon: '🌐',
    fields: [
      { key: 'widgetName', label: 'اسم الودجت' },
      { key: 'welcomeMessage', label: 'رسالة الترحيب' },
    ],
  },
];

type WhatsAppStatus = {
  channelId?: number;
  status: 'idle' | 'connecting' | 'qr' | 'connected' | 'disconnected' | 'error';
  qrCode?: string;
  phoneNumber?: string;
  error?: string;
};

export default function Integrations() {
  const { language, t } = useLanguage();
  const { data: channels, isLoading } = useListChannels({});
  const createChannel = useCreateChannel();
  const deleteChannel = useDeleteChannel();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [configuring, setConfiguring] = useState<(typeof INTEGRATION_TYPES)[0] | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [channelName, setChannelName] = useState('');
  const [whatsappStatus, setWhatsappStatus] = useState<WhatsAppStatus>({ status: 'idle' });
  const [isStartingQr, setIsStartingQr] = useState(false);

  const whatsappChannel = (channels ?? []).find((channel) => channel.provider === 'whatsapp_web');
  const isWhatsApp = configuring?.provider === 'whatsapp_web';

  const whatsappFetch = async (url: string, init?: RequestInit) => {
    const token = getToken();
    const response = await fetch(url, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init?.headers,
      },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'WhatsApp Web request failed');
    return data as WhatsAppStatus;
  };

  const activeWhatsAppId = whatsappChannel?.id || whatsappStatus?.channelId;

  // Poll WhatsApp status only when modal is open or when connecting
  useEffect(() => {
    if (!activeWhatsAppId || !configuring) return;
    let cancelled = false;

    const refreshStatus = async () => {
      try {
        const status = await whatsappFetch(`/api/channels/whatsapp-web/${activeWhatsAppId}/status`);
        if (!cancelled) {
          setWhatsappStatus(status);
          if (status.status === 'connected') {
            queryClient.invalidateQueries({ queryKey: getListChannelsQueryKey() });
          }
        }
      } catch {
        // Ignore silent polling errors
      }
    };

    void refreshStatus();
    const timer = window.setInterval(refreshStatus, 3000); // Stable 3s poll interval
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [activeWhatsAppId, configuring]);

  const handleConfigure = async (integration: (typeof INTEGRATION_TYPES)[0]) => {
    setConfiguring(integration);
    setFormData({});
    setChannelName(language === 'ar' ? `${integration.name} #1` : `${integration.nameEn} #1`);

    if (integration.provider === 'whatsapp_web') {
      setIsStartingQr(true);
      try {
        const status = await whatsappFetch('/api/channels/whatsapp-web/start', {
          method: 'POST',
          body: JSON.stringify({ name: 'واتساب المتجر', force: false }),
        });
        setWhatsappStatus(status);
      } catch (e: any) {
        toast({
          title: language === 'ar' ? 'فشل بدء جلسة واتساب' : 'Failed to start WhatsApp session',
          description: e.message,
          variant: 'destructive',
        });
      } finally {
        setIsStartingQr(false);
      }
    }
  };

  const handleRegenerateQr = async () => {
    setIsStartingQr(true);
    try {
      const status = await whatsappFetch('/api/channels/whatsapp-web/start', {
        method: 'POST',
        body: JSON.stringify({ name: channelName || 'واتساب المتجر', force: true }),
      });
      setWhatsappStatus(status);
      toast({
        title: language === 'ar' ? 'تم توليد رمز QR جديد' : 'New QR code generated',
        description: language === 'ar' ? 'امسح الرمز الآن من تطبيق واتساب' : 'Scan the code with WhatsApp now',
      });
    } catch (e: any) {
      toast({
        title: language === 'ar' ? 'فشل توليد الرمز' : 'Failed to generate QR',
        description: e.message,
        variant: 'destructive',
      });
    } finally {
      setIsStartingQr(false);
    }
  };

  const handleWhatsAppLogout = async () => {
    if (!activeWhatsAppId) return;
    try {
      await whatsappFetch(`/api/channels/whatsapp-web/${activeWhatsAppId}/logout`, { method: 'POST' });
      setWhatsappStatus({ status: 'disconnected' });
      queryClient.invalidateQueries({ queryKey: getListChannelsQueryKey() });
      toast({ title: language === 'ar' ? 'تم فصل جلسة واتساب بنجاح' : 'WhatsApp disconnected' });
    } catch (e: any) {
      toast({ title: 'Failed to disconnect', description: e.message, variant: 'destructive' });
    }
  };

  const handleCreate = () => {
    if (!configuring) return;
    createChannel.mutate(
      {
        data: {
          name: channelName,
          channelType: configuring.type as any,
          provider: configuring.provider as any,
          config: formData,
        } as any,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListChannelsQueryKey() });
          setConfiguring(null);
          toast({ title: language === 'ar' ? 'تم حفظ وربط القناة بنجاح' : 'Channel connected successfully' });
        },
        onError: (e) => {
          toast({ title: language === 'ar' ? 'فشل الربط' : 'Failed to connect', description: e.message, variant: 'destructive' });
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من رغبتك في حذف هذه القناة؟' : 'Disconnect this channel?')) return;
    deleteChannel.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListChannelsQueryKey() });
          toast({ title: language === 'ar' ? 'تم حذف القناة' : 'Channel disconnected' });
        },
        onError: (e) => toast({ title: 'Failed', description: e.message, variant: 'destructive' }),
      }
    );
  };

  const getChannelsOfType = (type: string) =>
    (channels ?? []).filter((c) => c.channelType === type);

  return (
    <div className="flex-1 overflow-y-auto bg-background/50">
      <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            {language === 'ar' ? 'قنوات التواصل والربط التقني' : 'Channels & Integrations'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">
            {language === 'ar' ? 'ربط متجر سلة، واتساب، شركات الشحن، وفيسبوك ماسنجر مع المساعد الذكي' : 'Connect Salla store, WhatsApp, couriers, and social channels with AI'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INTEGRATION_TYPES.map((integration) => {
            const activeChannels = getChannelsOfType(integration.type);
            const isConnected = integration.provider === 'whatsapp_web'
              ? whatsappStatus.status === 'connected' || (whatsappChannel && whatsappChannel.isActive)
              : activeChannels.length > 0;

            return (
              <div key={integration.type} className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl shadow-inner">
                        {integration.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-foreground">
                          {language === 'ar' ? integration.name : integration.nameEn}
                        </h3>
                        {isConnected ? (
                          <Badge variant="secondary" className="text-xs mt-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold">
                            <CheckCircle2 className="w-3 h-3 me-1" />
                            {language === 'ar' ? 'متصل ونشط' : 'Connected & Active'}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs mt-1 text-muted-foreground font-medium">
                            {language === 'ar' ? 'غير متصل' : 'Not connected'}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Button size="sm" variant="outline" onClick={() => handleConfigure(integration)} className="rounded-xl font-bold">
                      <Plus className="w-3.5 h-3.5 me-1" />
                      <span>{language === 'ar' ? 'إعداد' : 'Connect'}</span>
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {language === 'ar' ? integration.description : integration.descriptionEn}
                  </p>
                </div>

                {activeChannels.length > 0 && (
                  <div className="space-y-2 border-t border-border/60 pt-3">
                    {activeChannels.map((ch) => (
                      <div key={ch.id} className="flex items-center justify-between py-1 text-xs">
                        <div className="flex items-center gap-2">
                          <Zap className="w-3.5 h-3.5 text-primary" />
                          <span className="font-semibold text-foreground">{ch.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(ch.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Integration Configuration Dialog */}
      <Dialog open={!!configuring} onOpenChange={(o) => !o && setConfiguring(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-primary" />
              <span>{language === 'ar' ? `ربط ${configuring?.name}` : `Connect ${configuring?.nameEn}`}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {isWhatsApp ? (
              <div className="rounded-2xl border border-border bg-card p-5 text-center space-y-4 shadow-sm">
                <div className="text-xs text-muted-foreground space-y-1 text-start bg-muted/40 p-3 rounded-xl border">
                  <p className="font-bold text-foreground">{language === 'ar' ? '📱 خطوات الربط السريع:' : '📱 Quick Linking Steps:'}</p>
                  <p>1. {language === 'ar' ? 'افتح تطبيق واتساب على هاتفك المحمول.' : 'Open WhatsApp on your mobile phone.'}</p>
                  <p>2. {language === 'ar' ? 'اضغط على الإعدادات > الأجهزة المرتبطة > ربط جهاز.' : 'Tap Settings > Linked Devices > Link a Device.'}</p>
                  <p>3. {language === 'ar' ? 'وجّه كاميرا الهاتف نحو رمز الـ QR أدناه.' : 'Point your camera at the QR code below.'}</p>
                </div>

                {/* QR Code Container */}
                <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-border shadow-inner min-h-[300px]">
                  {whatsappStatus.qrCode ? (
                    <div className="space-y-2">
                      <img
                        src={whatsappStatus.qrCode}
                        alt="WhatsApp Web QR code"
                        className="w-64 h-64 mx-auto rounded-lg"
                      />
                      <p className="text-[11px] text-gray-500 font-medium animate-pulse">
                        {language === 'ar' ? '🟢 الرمز نشط وجاهز للمسح الآن' : '🟢 QR code is active and ready to scan'}
                      </p>
                    </div>
                  ) : whatsappStatus.status === 'connected' ? (
                    <div className="py-8 text-center space-y-2">
                      <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <p className="text-sm font-bold text-emerald-600">
                        {language === 'ar' ? 'تم ربط واتساب بنجاح!' : 'WhatsApp Connected Successfully!'}
                      </p>
                      {whatsappStatus.phoneNumber && (
                        <p className="text-xs font-mono text-muted-foreground">{whatsappStatus.phoneNumber}</p>
                      )}
                    </div>
                  ) : (
                    <div className="py-12 text-center space-y-3">
                      <QrCode className="w-10 h-10 text-muted-foreground animate-bounce mx-auto opacity-50" />
                      <p className="text-xs text-muted-foreground">
                        {isStartingQr ? (language === 'ar' ? 'جاري إنشاء رمز QR جديد...' : 'Generating QR code...') : (whatsappStatus.error || (language === 'ar' ? 'جاري الاتصال بخادم واتساب...' : 'Connecting to WhatsApp server...'))}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  {whatsappStatus.status === 'connected' ? (
                    <Button onClick={handleWhatsAppLogout} variant="destructive" className="w-full rounded-xl">
                      {language === 'ar' ? 'فصل الحساب (Disconnect)' : 'Disconnect'}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleRegenerateQr}
                      disabled={isStartingQr}
                      variant="outline"
                      className="w-full rounded-xl gap-2 text-xs font-bold"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isStartingQr ? 'animate-spin' : ''}`} />
                      <span>{language === 'ar' ? 'إعادة توليد رمز QR جديد' : 'Generate New QR Code'}</span>
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>{language === 'ar' ? 'اسم القناة' : 'Channel Name'}</Label>
                  <Input
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                  />
                </div>

                {configuring?.fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label>{field.label}</Label>
                    <Input
                      type={field.type || 'text'}
                      value={formData[field.key] ?? ''}
                      onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
                      className={field.type === 'password' ? 'font-mono' : ''}
                    />
                  </div>
                ))}

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setConfiguring(null)}>
                    {t.cancel}
                  </Button>
                  <Button onClick={handleCreate} disabled={createChannel.isPending}>
                    {createChannel.isPending ? t.saving : (language === 'ar' ? 'حفظ وتفعيل الربط' : 'Save & Connect')}
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
