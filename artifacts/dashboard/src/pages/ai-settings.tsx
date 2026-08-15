import { useState, useEffect } from 'react';
import { useGetAiSettings, useUpdateAiSettings } from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Bot, Save, Loader2 } from 'lucide-react';

export default function AiSettings() {
  const { data: settings, isLoading } = useGetAiSettings();
  const updateSettings = useUpdateAiSettings();
  const { toast } = useToast();

  const [form, setForm] = useState({
    provider: 'ollama',
    model: 'llama3',
    baseUrl: 'http://localhost:11434',
    apiKey: '',
    systemPrompt: 'You are a helpful customer support assistant. Be concise, friendly, and professional.',
    temperature: 0.7,
    maxTokens: 1000,
    autoReply: false,
    autoReplyConfidence: 0.8,
  });

  useEffect(() => {
    if (settings) {
      setForm({
        provider: settings.provider ?? 'ollama',
        model: settings.model ?? 'llama3',
        baseUrl: settings.baseUrl ?? 'http://localhost:11434',
        apiKey: settings.apiKey ?? '',
        systemPrompt: settings.systemPrompt ?? '',
        temperature: settings.temperature ?? 0.7,
        maxTokens: settings.maxTokens ?? 1000,
        autoReply: settings.autoReply ?? false,
        autoReplyConfidence: settings.autoReplyConfidence ?? 0.8,
      });
    }
  }, [settings]);

  const handleSave = () => {
    updateSettings.mutate(
      { data: form },
      {
        onSuccess: () => toast({ title: 'AI settings saved' }),
        onError: (e) => toast({ title: 'Failed to save', description: e.message, variant: 'destructive' }),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4 max-w-2xl">
          {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 max-w-2xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">AI Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">Configure your AI assistant and automation rules</p>
          </div>
          <Button onClick={handleSave} disabled={updateSettings.isPending} data-testid="button-save">
            {updateSettings.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>

        {/* Provider */}
        <div className="bg-card border border-card-border rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Provider Configuration</h2>
          </div>

          <div className="space-y-2">
            <Label>AI Provider</Label>
            <Select value={form.provider} onValueChange={(v) => setForm(p => ({ ...p, provider: v }))}>
              <SelectTrigger data-testid="select-provider">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ollama">Ollama (Local)</SelectItem>
                <SelectItem value="openai_compat">OpenAI-Compatible API</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Model Name</Label>
            <Input
              value={form.model}
              onChange={(e) => setForm(p => ({ ...p, model: e.target.value }))}
              placeholder="llama3, gpt-4o, mistral..."
              data-testid="input-model"
            />
          </div>

          <div className="space-y-2">
            <Label>Base URL</Label>
            <Input
              value={form.baseUrl}
              onChange={(e) => setForm(p => ({ ...p, baseUrl: e.target.value }))}
              placeholder="http://localhost:11434"
              data-testid="input-base-url"
            />
            <p className="text-xs text-muted-foreground">
              {form.provider === 'ollama' ? 'Default: http://localhost:11434' : 'e.g. https://api.openai.com/v1'}
            </p>
          </div>

          {form.provider === 'openai_compat' && (
            <div className="space-y-2">
              <Label>API Key</Label>
              <Input
                type="password"
                value={form.apiKey}
                onChange={(e) => setForm(p => ({ ...p, apiKey: e.target.value }))}
                placeholder="sk-..."
                data-testid="input-api-key"
              />
            </div>
          )}
        </div>

        {/* Behavior */}
        <div className="bg-card border border-card-border rounded-lg p-6 space-y-6">
          <h2 className="text-lg font-semibold">Behavior</h2>

          <div className="space-y-2">
            <Label>System Prompt</Label>
            <Textarea
              value={form.systemPrompt}
              onChange={(e) => setForm(p => ({ ...p, systemPrompt: e.target.value }))}
              rows={5}
              placeholder="Describe your AI assistant's persona and instructions..."
              data-testid="textarea-system-prompt"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Temperature: {form.temperature.toFixed(1)}</Label>
            </div>
            <Slider
              min={0} max={2} step={0.1}
              value={[form.temperature]}
              onValueChange={([v]) => setForm(p => ({ ...p, temperature: v }))}
              data-testid="slider-temperature"
            />
            <p className="text-xs text-muted-foreground">Lower = more deterministic; Higher = more creative</p>
          </div>

          <div className="space-y-2">
            <Label>Max Tokens</Label>
            <Input
              type="number"
              value={form.maxTokens}
              onChange={(e) => setForm(p => ({ ...p, maxTokens: Number(e.target.value) }))}
              min={100} max={4000}
              data-testid="input-max-tokens"
            />
          </div>
        </div>

        {/* Auto-Reply */}
        <div className="bg-card border border-card-border rounded-lg p-6 space-y-6">
          <h2 className="text-lg font-semibold">Auto-Reply</h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Auto-Reply</p>
              <p className="text-sm text-muted-foreground">AI automatically responds to incoming messages</p>
            </div>
            <Switch
              checked={form.autoReply}
              onCheckedChange={(v) => setForm(p => ({ ...p, autoReply: v }))}
              data-testid="switch-auto-reply"
            />
          </div>

          {form.autoReply && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Confidence Threshold: {Math.round(form.autoReplyConfidence * 100)}%</Label>
              </div>
              <Slider
                min={0.5} max={1} step={0.05}
                value={[form.autoReplyConfidence]}
                onValueChange={([v]) => setForm(p => ({ ...p, autoReplyConfidence: v }))}
              />
              <p className="text-xs text-muted-foreground">Only auto-reply when AI confidence exceeds this threshold</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
