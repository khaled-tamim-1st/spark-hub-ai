import { useState } from 'react';
import { useListChannels, useCreateChannel, useDeleteChannel, getListChannelsQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, CheckCircle2, Settings, Zap } from 'lucide-react';

const INTEGRATION_TYPES = [
  {
    name: 'WhatsApp Business',
    type: 'whatsapp',
    provider: 'cloud_api',
    description: 'Connect WhatsApp Business Cloud API to handle WhatsApp messages',
    icon: '💬',
    fields: [
      { key: 'phoneNumberId', label: 'Phone Number ID' },
      { key: 'accessToken', label: 'Access Token', type: 'password' },
      { key: 'webhookSecret', label: 'Webhook Verify Token' },
    ],
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

export default function Integrations() {
  const { data: channels, isLoading } = useListChannels({});
  const createChannel = useCreateChannel();
  const deleteChannel = useDeleteChannel();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [configuring, setConfiguring] = useState<(typeof INTEGRATION_TYPES)[0] | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [channelName, setChannelName] = useState('');

  const getChannelsOfType = (type: string) =>
    (channels ?? []).filter((c) => c.channelType === type);

  const handleConfigure = (integration: (typeof INTEGRATION_TYPES)[0]) => {
    setConfiguring(integration);
    setFormData({});
    setChannelName(`${integration.name} #${(getChannelsOfType(integration.type).length + 1)}`);
  };

  const handleCreate = () => {
    if (!configuring) return;
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
            const isConnected = activeChannels.length > 0;

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
                          {activeChannels.length} connected
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
            {configuring?.fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label>{field.label}</Label>
                <Input
                  type={field.type || 'text'}
                  value={formData[field.key] ?? ''}
                  onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))}
                />
              </div>
            ))}
            <Button onClick={handleCreate} className="w-full" disabled={createChannel.isPending}>
              {createChannel.isPending ? 'Connecting...' : 'Connect Channel'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
