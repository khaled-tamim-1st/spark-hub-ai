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
import { Plus, Trash2, CheckCircle2, Settings, Zap } from 'lucide-react';

const INTEGRATION_TYPES = [
  {
    name: 'WhatsApp Web',
    type: 'whatsapp',
    provider: 'whatsapp_web',
    description: 'Scan a QR code with your WhatsApp mobile app',
    icon: '💬',
    fields: [],
  },
  {
    name: 'Facebook Messenger',
    type: 'messenger',
    provider: 'meta_graph',
    description: 'Connect Facebook Messenger to manage page conversations',
    icon: '📘',
    fields: [
      { key: 'pageId', label: 'Page ID' },
      { key: 'accessToken', label: 'Page Access Token', type: 'password' },
      { key: 'appSecret', label: 'App Secret', type: 'password' },
    ],
  },
  {
    name: 'Instagram DM',
    type: 'instagram',
    provider: 'meta_graph',
    description: 'Handle Instagram Direct Messages from your business account',
    icon: '📸',
    fields: [
      { key: 'pageId', label: 'Instagram Account ID' },
      { key: 'accessToken', label: 'Access Token', type: 'password' },
    ],
  },
  {
    name: 'Web Chat Widget',
    type: 'web',
    provider: 'widget',
    description: 'Embed a chat widget on your website',
    icon: '🌐',
    fields: [
      { key: 'widgetName', label: 'Widget Name' },
      { key: 'welcomeMessage', label: 'Welcome Message' },
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
  const { data: channels, isLoading } = useListChannels({});
  const createChannel = useCreateChannel();
  const deleteChannel = useDeleteChannel();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [configuring, setConfiguring] = useState<(typeof INTEGRATION_TYPES)[0] | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [channelName, setChannelName] = useState('');
  const [whatsappStatus, setWhatsappStatus] = useState<WhatsAppStatus>({ status: 'idle' });

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

  useEffect(() => {
    if (!whatsappChannel) return;
    let cancelled = false;
    const refreshStatus = async () => {
      try {
        const status = await whatsappFetch(`/api/channels/whatsapp-web/${whatsappChannel.id}/status`);
        if (!cancelled) setWhatsappStatus(status);
      } catch {
        // The channel can exist before its in-memory session is started.
      }
    };
    void refreshStatus();
    const timer = window.setInterval(refreshStatus, 2000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [whatsappChannel?.id]);

  const getChannelsOfType = (type: string) =>
    (channels ?? []).filter((c) => c.channelType === type);

  const handleConfigure = (integration: (typeof INTEGRATION_TYPES)[0]) => {
    setConfiguring(integration);
    setFormData({});
    setChannelName(`${integration.name} #${(getChannelsOfType(integration.type).length + 1)}`);
    if (integration.provider === 'whatsapp_web' && whatsappChannel) {
      void whatsappFetch(`/api/channels/whatsapp-web/${whatsappChannel.id}/status`)
        .then(setWhatsappStatus)
        .catch(() => setWhatsappStatus({ status: 'idle' }));
    }
  };

  const handleCreate = async () => {
    if (!configuring) return;
    if (configuring.provider === 'whatsapp_web') {
      try {
        const status = await whatsappFetch('/api/channels/whatsapp-web/start', {
          method: 'POST',
          body: JSON.stringify({ name: channelName || 'WhatsApp Web' }),
        });
        setWhatsappStatus(status);
        queryClient.invalidateQueries({ queryKey: getListChannelsQueryKey({}) });
      } catch (e) {
        toast({ title: 'Failed to start WhatsApp Web', description: (e as Error).message, variant: 'destructive' });
      }
      return;
    }
    createChannel.mutate(
      {
        data: {
          name: channelName,
          channelType: configuring.type,
          provider: configuring.provider,
          config: formData,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListChannelsQueryKey({}) });
          setConfiguring(null);
          toast({ title: `${configuring.name} connected` });
        },
        onError: (e) => {
          toast({ title: 'Failed to connect', description: e.message, variant: 'destructive' });
        },
      }
    );
  };

  const handleWhatsAppLogout = async () => {
    if (!whatsappChannel) return;
    try {
      await whatsappFetch(`/api/channels/whatsapp-web/${whatsappChannel.id}/logout`, { method: 'POST' });
      setWhatsappStatus({ status: 'disconnected' });
      queryClient.invalidateQueries({ queryKey: getListChannelsQueryKey({}) });
      toast({ title: 'WhatsApp Web disconnected' });
    } catch (e) {
      toast({ title: 'Failed to disconnect', description: (e as Error).message, variant: 'destructive' });
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm('Disconnect this channel?')) return;
    deleteChannel.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListChannelsQueryKey({}) });
          toast({ title: 'Channel disconnected' });
        },
        onError: (e) => toast({ title: 'Failed', description: e.message, variant: 'destructive' }),
      }
    );
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Integrations</h1>
          <p className="text-sm text-muted-foreground mt-1">Connect messaging channels to your support platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {INTEGRATION_TYPES.map((integration) => {
            const activeChannels = getChannelsOfType(integration.type);
            const isConnected = integration.provider === 'whatsapp_web'
              ? whatsappStatus.status === 'connected'
              : activeChannels.length > 0;

            return (
              <div key={integration.type} className="bg-card border border-card-border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl">
                      {integration.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{integration.name}</h3>
                      {isConnected ? (
                        <Badge variant="secondary" className="text-xs mt-1 bg-green-500/10 text-green-600 border-0">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {integration.provider === 'whatsapp_web' ? 'Connected' : `${activeChannels.length} connected`}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs mt-1 text-muted-foreground">
                          Not connected
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleConfigure(integration)}>
                      <Plus className="w-3 h-3 mr-1" />
                      Connect
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">{integration.description}</p>

                {activeChannels.length > 0 && (
                  <div className="space-y-2 border-t border-border pt-4">
                    {activeChannels.map((ch) => (
                      <div key={ch.id} className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-2">
                          <Zap className="w-3 h-3 text-primary" />
                          <span className="text-sm font-medium">{ch.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleDelete(ch.id)}
                        >
                          <Trash2 className="w-3 h-3" />
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

      {/* Configure Dialog */}
      <Dialog open={!!configuring} onOpenChange={(o) => !o && setConfiguring(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Connect {configuring?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Channel Name</Label>
              <Input
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="e.g. Support WhatsApp"
              />
            </div>
            {isWhatsApp ? (
              <div className="rounded-lg border border-border bg-muted/30 p-4 text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  افتح WhatsApp على هاتفك ثم Settings &gt; Linked devices &gt; Link a device
                </p>
                {whatsappStatus.qrCode ? (
                  <img src={whatsappStatus.qrCode} alt="WhatsApp Web QR code" className="mx-auto w-64 h-64 rounded-lg bg-white p-2" />
                ) : whatsappStatus.status === 'connected' ? (
                  <div className="py-8 text-green-600 font-medium">
                    WhatsApp connected {whatsappStatus.phoneNumber ? `(${whatsappStatus.phoneNumber})` : ''}
                  </div>
                ) : (
                  <div className="py-8 text-sm text-muted-foreground">
                    {whatsappStatus.status === 'error' ? whatsappStatus.error : 'Generating QR code...'}
                  </div>
                )}
                {whatsappStatus.qrCode && (
                  <p className="text-xs text-muted-foreground">Scan this code before it expires, then keep this page open.</p>
                )}
              </div>
            ) : configuring?.fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label>{field.label}</Label>
                <Input
                  type={field.type || 'text'}
                  value={formData[field.key] ?? ''}
                  onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
                />
              </div>
            ))}
            <div className="flex gap-2">
              <Button onClick={handleCreate} className="flex-1" disabled={createChannel.isPending || (isWhatsApp && whatsappStatus.status === 'connected')}>
                {isWhatsApp ? (whatsappStatus.status === 'qr' ? 'Refresh QR' : 'Generate QR Code') : (createChannel.isPending ? 'Connecting...' : 'Connect Channel')}
              </Button>
              {isWhatsApp && whatsappStatus.status === 'connected' && (
                <Button onClick={handleWhatsAppLogout} variant="outline">Disconnect</Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
