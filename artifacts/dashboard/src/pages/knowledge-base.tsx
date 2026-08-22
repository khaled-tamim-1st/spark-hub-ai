import { useState } from 'react';
import { useListKnowledgeBase, useCreateKnowledgeDoc, useDeleteKnowledgeDoc, getListKnowledgeBaseQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { EmptyState } from '@/components/empty-state';
import { StatusBadge } from '@/components/status-badge';
import { Plus, BookOpen, FileText, Trash2, Search, Sparkles, Globe, HelpCircle } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

import { useLanguage } from '@/lib/i18n';

export default function KnowledgeBase() {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    fileType: 'txt' as 'pdf' | 'docx' | 'txt' | 'url' | 'faq',
    content: '',
    url: '',
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: docs, isLoading } = useListKnowledgeBase();
  const createDoc = useCreateKnowledgeDoc();
  const deleteDoc = useDeleteKnowledgeDoc();

  const filteredDocs = docs?.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    let effectiveTitle = formData.title.trim();
    if (!effectiveTitle && formData.fileType === 'url' && formData.url.trim()) {
      effectiveTitle = formData.url.trim();
    }

    if (!effectiveTitle) {
      toast({ 
        title: language === 'ar' ? 'يرجى كتابة عنوان للمستند أو إدخال الرابط' : 'Please enter a title or URL', 
        variant: 'destructive' 
      });
      return;
    }

    const data: any = {
      title: effectiveTitle,
      fileType: formData.fileType,
      contentType: formData.fileType,
    };

    if (formData.fileType === 'url') {
      data.url = formData.url.trim() || effectiveTitle;
    } else {
      data.content = formData.content;
    }

    createDoc.mutate(
      { data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListKnowledgeBaseQueryKey() });
          setIsCreateOpen(false);
          setFormData({ title: '', fileType: 'txt', content: '', url: '' });
          toast({ title: language === 'ar' ? 'تم حفظ المستند وتدريب الذكاء الاصطناعي بنجاح' : 'Document saved & AI trained successfully' });
        },
        onError: (error) => {
          toast({
            title: language === 'ar' ? 'فشل حفظ المستند' : 'Failed to save document',
            description: error.message,
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm(language === 'ar' ? 'هل أنت متأكد من رغبتك في حذف هذا المستند؟' : 'Are you sure you want to delete this document?')) return;

    deleteDoc.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListKnowledgeBaseQueryKey() });
          toast({ title: t.deletedSuccessfully });
        },
        onError: (error) => {
          toast({
            title: language === 'ar' ? 'فشل حذف المستند' : 'Failed to delete document',
            description: error.message,
            variant: 'destructive',
          });
        },
      }
    );
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background/50">
      <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {t.kbTitle}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              {t.kbSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={language === 'ar' ? 'بحث في المستندات والأسئلة...' : 'Search documents & FAQs...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ps-9 h-10 text-xs bg-card"
              />
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 h-10 rounded-xl px-4 shadow-sm" data-testid="button-create-doc">
                  <Plus className="w-4 h-4" />
                  <span>إضافة مستند أو سؤال وجواب</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>إضافة معرفة جديدة للـ AI</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">عنوان المستند / السؤال *</Label>
                    <Input
                      id="title"
                      placeholder="مثال: سياسة الشحن والتوصيل في السعودية أو مواصفات العطور"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fileType">نوع المحتوى</Label>
                    <Select
                      value={formData.fileType}
                      onValueChange={(val: any) => setFormData({ ...formData, fileType: val })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="txt">نص مباشر / سياسة (Text)</SelectItem>
                        <SelectItem value="faq">سؤال وجواب (FAQ)</SelectItem>
                        <SelectItem value="url">رابط موقع / صفحة متجر (Web URL)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.fileType === 'url' ? (
                    <div className="space-y-2">
                      <Label htmlFor="url">رابط الصفحة (URL)</Label>
                      <Input
                        id="url"
                        placeholder="https://salla.sa/yourstore/policy"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="content">تفاصيل المحتوى والمعلومات للـ AI</Label>
                      <Textarea
                        id="content"
                        placeholder="اكتب هنا كافة الإجابات والتفاصيل التي تريد من الـ AI معرفتها والرد بها على العملاء..."
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={6}
                      />
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                      إلغاء
                    </Button>
                    <Button onClick={handleCreate} disabled={createDoc.isPending}>
                      {createDoc.isPending ? 'جاري التدريب...' : 'حفظ وتدريب الـ AI'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Knowledge Documents Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 bg-muted animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : !filteredDocs || filteredDocs.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="لا توجد مستندات مسجلة"
            description="أضف مستندات أو أسئلة شائعة لتدريب الذكاء الاصطناعي على الرد المخصص لمتجرك."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors leading-snug">
                        {doc.title}
                      </h3>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {((doc as any).content) || ((doc as any).url) || 'مستند معرفي نشط ومتاح للـ AI'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/60 text-[10px] text-muted-foreground">
                  <StatusBadge status={doc.status || 'ready'} variant="compact" />
                  <span className="font-mono">{formatDateTime(doc.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
