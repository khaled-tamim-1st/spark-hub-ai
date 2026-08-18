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
import { Bot, Save, Loader2, Send, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { fetchWithAuth } from '@/lib/admin-api';

export default function AiSettings() {
  const { data: settings, isLoading } = useGetAiSettings();
  const updateSettings = useUpdateAiSettings();
  const { toast } = useToast();

  const [testInput, setTestInput] = useState('');
  const [testReply, setTestReply] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

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
      const s = settings as any;
      setForm({
        provider: s.provider ?? 'ollama',
        model: s.model ?? 'llama3',
        baseUrl: s.baseUrl ?? 'http://localhost:11434',
        apiKey: s.apiKey ?? '',
        systemPrompt: s.systemPrompt ?? '',
        temperature: s.temperature ?? 0.7,
        maxTokens: s.maxTokens ?? 1000,
        autoReply: s.autoReply ?? false,
        autoReplyConfidence: s.autoReplyConfidence ?? 0.8,
      });
    }
  }, [settings]);

  const handleSave = () => {
    updateSettings.mutate(
      { data: form as any },
      {
        onSuccess: () => toast({ title: 'AI settings saved' }),
        onError: (e) => toast({ title: 'Failed to save', description: e.message, variant: 'destructive' }),
      }
    );
  };

  const handleTestAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim()) return;
    setTesting(true);
    setTestReply(null);
    try {
      const res = await fetchWithAuth<{ reply: string }>('/api/ai-settings/test', {
        method: 'POST',
        body: JSON.stringify({ message: testInput }),
      });
      setTestReply(res.reply);
      toast({ title: 'AI Response Received', description: 'Model replied successfully!' });
    } catch (err: any) {
      toast({
        title: 'AI Test Failed',
        description: err.message || 'Please check your model provider and API key in SuperAdmin.',
        variant: 'destructive',
      });
    } finally {
      setTesting(false);
    }
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

        {/* Provider Configuration - SuperAdmin Only */}
        {(settings as any)?.isSuperAdmin ? (
          <div className="bg-card border border-card-border rounded-lg p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">AI Model & Provider (SuperAdmin)</h2>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">
                Global Control
              </span>
            </div>

            <div className="space-y-2">
              <Label>AI Provider</Label>
              <Select value={form.provider} onValueChange={(v) => {
                let defaultBaseUrl = form.baseUrl;
                let defaultModel = form.model;
                if (v === 'openai') { defaultBaseUrl = 'https://api.openai.com'; defaultModel = 'gpt-4o-mini'; }
                else if (v === 'groq') { defaultBaseUrl = 'https://api.groq.com/openai'; defaultModel = 'llama-3.3-70b-versatile'; }
                else if (v === 'deepseek') { defaultBaseUrl = 'https://api.deepseek.com'; defaultModel = 'deepseek-chat'; }
                else if (v === 'openrouter') { defaultBaseUrl = 'https://openrouter.ai/api'; defaultModel = 'anthropic/claude-3.5-sonnet'; }
                else if (v === 'ollama') { defaultBaseUrl = 'http://localhost:11434'; defaultModel = 'llama3'; }
                setForm(p => ({ ...p, provider: v, baseUrl: defaultBaseUrl, model: defaultModel }));
              }}>
                <SelectTrigger data-testid="select-provider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI (GPT-4o, GPT-4o-mini)</SelectItem>
                  <SelectItem value="groq">Groq (Ultra-Fast LLaMA 3.3, Mixtral)</SelectItem>
                  <SelectItem value="deepseek">DeepSeek (DeepSeek V3 / R1)</SelectItem>
                  <SelectItem value="openrouter">OpenRouter (Multi-Model Hub)</SelectItem>
                  <SelectItem value="ollama">Ollama (Local VPS)</SelectItem>
                  <SelectItem value="openai_compat">Custom OpenAI-Compatible API</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Model Name</Label>
              <Input
                value={form.model}
                onChange={(e) => setForm(p => ({ ...p, model: e.target.value }))}
                placeholder="gpt-4o, gpt-4o-mini, deepseek-chat, llama-3.3-70b-versatile..."
                data-testid="input-model"
              />
            </div>

            <div className="space-y-2">
              <Label>Base URL</Label>
              <Input
                value={form.baseUrl}
                onChange={(e) => setForm(p => ({ ...p, baseUrl: e.target.value }))}
                placeholder="https://api.openai.com or http://localhost:11434"
                data-testid="input-base-url"
              />
            </div>

            <div className="space-y-2">
              <Label>API Key (Secret Token / مفتاح الـ API)</Label>
              <Input
                type="password"
                value={form.apiKey}
                onChange={(e) => setForm(p => ({ ...p, apiKey: e.target.value }))}
                placeholder={form.provider === 'ollama' ? 'Optional for local Ollama (Not required)' : 'sk-... or gsk_... (Enter your API Token)'}
                data-testid="input-api-key"
              />
              <p className="text-xs text-muted-foreground">
                {form.provider === 'ollama' 
                  ? 'Local Ollama runs on your VPS without an API key by default.' 
                  : 'Your API token is stored securely on the server.'}
              </p>
            </div>
          </div>
        ) : (
          /* Tenant View: Read-only Engine Card */
          <div className="bg-card border border-card-border rounded-lg p-5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">AI Intelligence Engine</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    Active &amp; Optimized
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  High-performance model managed and provisioned centrally by SupportHub AI.
                </p>
              </div>
            </div>
          </div>
        )}

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

        {/* Live AI Test Sandbox */}
        <div className="bg-card border border-card-border rounded-lg p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold">Test AI Response (Live Sandbox)</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Test how your AI assistant will respond to customer inquiries in real-time before going live.
          </p>

          <form onSubmit={handleTestAi} className="space-y-3 pt-2">
            <div className="flex gap-2">
              <Input
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="Ask a question as a customer (e.g. ما هي خدماتكم وأسعاركم؟)"
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={testing || !testInput.trim()}
                className="gap-2 bg-indigo-600 hover:bg-indigo-500 text-white shrink-0"
              >
                {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send Test
              </Button>
            </div>
          </form>

          {testReply && (
            <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20 space-y-2 mt-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                <Bot className="w-4 h-4" />
                <span>AI Assistant Live Output:</span>
              </div>
              <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {testReply}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
