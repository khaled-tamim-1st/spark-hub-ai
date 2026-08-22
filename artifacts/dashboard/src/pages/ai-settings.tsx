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
import { Bot, Save, Loader2, Send, Sparkles, CheckCircle2, AlertCircle, Cpu, Sliders } from 'lucide-react';
import { fetchWithAuth } from '@/lib/admin-api';

export default function AiSettings() {
  const { data: settings, isLoading } = useGetAiSettings();
  const updateSettings = useUpdateAiSettings();
  const { toast } = useToast();

  const [testInput, setTestInput] = useState('');
  const [testReply, setTestReply] = useState<string | null>(null);
  const [testError, setTestError] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  const [form, setForm] = useState({
    provider: 'groq',
    model: 'openai/gpt-oss-120b',
    baseUrl: '',
    apiKey: '',
    systemPrompt: 'أنت مساعد ذكي ومتخصص لخدمة عملاء المتجر. أجب دائماً بأسلوب مهذب وودود وموجز، وساعد العميل في معرفة حالة الطلبات والشحن والمنتجات.',
    temperature: 0.7,
    maxTokens: 1000,
    autoReply: true,
    autoReplyConfidence: 0.8,
  });

  useEffect(() => {
    if (settings) {
      const s = settings as any;
      setForm({
        provider: s.provider ?? 'groq',
        model: s.model ?? 'openai/gpt-oss-120b',
        baseUrl: s.baseUrl ?? '',
        apiKey: s.apiKey ?? '',
        systemPrompt: s.systemPrompt ?? 'أنت مساعد ذكي ومتخصص لخدمة عملاء المتجر. أجب دائماً بأسلوب مهذب وودود وموجز، وساعد العميل في معرفة حالة الطلبات والشحن والمنتجات.',
        temperature: s.temperature ?? 0.7,
        maxTokens: s.maxTokens ?? 1000,
        autoReply: s.autoReply ?? true,
        autoReplyConfidence: s.autoReplyConfidence ?? 0.8,
      });
    }
  }, [settings]);

  const handleSave = () => {
    updateSettings.mutate(
      { data: form as any },
      {
        onSuccess: () => toast({ title: '✅ تم حفظ إعدادات الذكاء الاصطناعي بنجاح' }),
        onError: (e) => toast({ title: 'فشل الحفظ', description: e.message, variant: 'destructive' }),
      }
    );
  };

  const handleTestAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim()) return;
    setTesting(true);
    setTestReply(null);
    setTestError(null);
    try {
      const res = await fetchWithAuth<{ reply: string }>('/api/ai-settings/test', {
        method: 'POST',
        body: JSON.stringify({
          message: testInput,
          provider: form.provider,
          model: form.model,
          apiKey: form.apiKey,
          baseUrl: form.baseUrl,
          systemPrompt: form.systemPrompt,
          temperature: form.temperature,
          maxTokens: form.maxTokens,
        }),
      });
      setTestReply(res.reply);
      toast({ title: '✨ تم استلام رد الذكاء الاصطناعي', description: 'تم اختبار النموذج والـ Prompt بنجاح!' });
    } catch (err: any) {
      setTestError(err.message || 'فشل الاتصال بمزود الذكاء الاصطناعي.');
      toast({
        title: 'فشل الاختبار',
        description: err.message || 'يرجى مراجعة مفتاح الـ API ومزود الذكاء الاصطناعي.',
        variant: 'destructive',
      });
    } finally {
      setTesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto space-y-6">
        <div className="h-10 bg-muted animate-pulse rounded w-1/3" />
        <div className="h-64 bg-muted animate-pulse rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background/50">
      <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              إعدادات الذكاء الاصطناعي (AI Prompt & Models)
            </h1>
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              تخصيص شخصية المساعد الذكي، تعليمات الرد، ونموذج التفكير
            </p>
          </div>

          <Button onClick={handleSave} disabled={updateSettings.isPending} className="gap-2 h-10 rounded-xl px-5 shadow-sm">
            <Save className="w-4 h-4" />
            <span>{updateSettings.isPending ? 'جاري الحفظ...' : 'حفظ الإعدادات'}</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Settings Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Auto-Reply Card */}
            <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" /> تفعيل الرد التلقائي العام (Auto-Pilot)
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    الرد التلقائي الفوري على رسائل العملاء الواردة عبر كافة القنوات
                  </p>
                </div>
                <Switch
                  checked={form.autoReply}
                  onCheckedChange={(checked) => setForm({ ...form, autoReply: checked })}
                />
              </div>
            </div>

            {/* Prompt & Persona Card */}
            <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary" /> شخصية وتعليمات المساعد (System Prompt)
              </h3>
              <p className="text-xs text-muted-foreground">
                اكتب هنا التعليمات الأساسية للهجة المساعد (سعودية/مصرية/فصحى)، طريقة الترحيب، وقواعد التعامل مع العملاء.
              </p>
              <Textarea
                rows={7}
                value={form.systemPrompt}
                onChange={(e) => setForm({ ...form, systemPrompt: e.target.value })}
                placeholder="أنت ممثل خدمة عملاء محترف لمتجر..."
                className="text-xs font-sans leading-relaxed"
              />
            </div>

            {/* Model & Provider Card */}
            <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" /> مزود ونموذج الذكاء الاصطناعي (LLM Provider)
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>المزود (Provider)</Label>
                  <Select
                    value={form.provider}
                    onValueChange={(val) => setForm({ ...form, provider: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="groq">Groq (سريع جداً ⚡ / موصى به)</SelectItem>
                      <SelectItem value="openai">OpenAI (GPT-4o / GPT-4o-mini)</SelectItem>
                      <SelectItem value="ollama">Ollama (سيرفر محلي مخصص)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>اسم النموذج (Model)</Label>
                  <Input
                    value={form.model}
                    onChange={(e) => setForm({ ...form, model: e.target.value })}
                    placeholder="llama-3.3-70b-versatile أو gpt-4o"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <Label>درجة الإبداع والحرية (Temperature: {form.temperature})</Label>
                  <span className="text-muted-foreground font-mono">{form.temperature}</span>
                </div>
                <Slider
                  value={[form.temperature]}
                  min={0}
                  max={1}
                  step={0.1}
                  onValueChange={([val]) => setForm({ ...form, temperature: val })}
                />
              </div>
            </div>
          </div>

          {/* Interactive Test Sandbox Card */}
          <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-5 h-fit">
            <div>
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> تجربة رد الـ AI المباشر
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                اختبر رد المساعد على رسائل وسيناريوهات عملائك قبل نشرها
              </p>
            </div>

            <form onSubmit={handleTestAi} className="space-y-3">
              <Textarea
                rows={3}
                placeholder="اكتب رسالة تجريبية (مثال: عندي مشكلة في الشحن أو متى يوصل طلبي؟)..."
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                className="text-xs"
              />
              <Button type="submit" disabled={testing || !testInput.trim()} className="w-full h-10 rounded-xl text-xs gap-2">
                {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{testing ? 'جاري التفكير والرد...' : 'إرسال واختبار الرد'}</span>
              </Button>
            </form>

            {testReply && (
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-primary text-[11px]">
                  <Bot className="w-3.5 h-3.5" /> رد المساعد الذكي:
                </div>
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">{testReply}</p>
              </div>
            )}

            {testError && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-3.5 h-3.5" /> خطأ في المعالجة:
                </div>
                <p>{testError}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
