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
import { Plus, BookOpen, FileText, Trash2, Search } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function KnowledgeBase() {
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
    const data: any = {
      title: formData.title,
      fileType: formData.fileType,
    };

    if (formData.fileType === 'url') {
      data.url = formData.url;
    } else if (formData.fileType === 'txt' || formData.fileType === 'faq') {
      data.content = formData.content;
    }

    createDoc.mutate(
      { data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListKnowledgeBaseQueryKey() });
          setIsCreateOpen(false);
          setFormData({ title: '', fileType: 'txt', content: '', url: '' });
          toast({ title: 'Document created successfully' });
        },
        onError: (error) => {
          toast({
            title: 'Failed to create document',
            description: error.message,
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    deleteDoc.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListKnowledgeBaseQueryKey() });
          toast({ title: 'Document deleted successfully' });
        },
        onError: (error) => {
          toast({
            title: 'Failed to delete document',
            description: error.message,
            variant: 'destructive',
          });
        },
      }
    );
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Knowledge Base</h1>
            <p className="text-sm text-muted-foreground mt-1">Train your AI with documents and FAQs</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-doc">
                <Plus className="w-4 h-4 mr-2" />
                Add Document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Knowledge Document</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                    data-testid="input-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fileType">Type</Label>
                  <Select value={formData.fileType} onValueChange={(v: any) => setFormData((p) => ({ ...p, fileType: v }))}>
                    <SelectTrigger data-testid="select-file-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="txt">Text</SelectItem>
                      <SelectItem value="faq">FAQ</SelectItem>
                      <SelectItem value="url">URL</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="docx">Word Doc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.fileType === 'url' ? (
                  <div className="space-y-2">
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://example.com/docs"
                      value={formData.url}
                      onChange={(e) => setFormData((p) => ({ ...p, url: e.target.value }))}
                      data-testid="input-url"
                    />
                  </div>
                ) : formData.fileType === 'txt' || formData.fileType === 'faq' ? (
                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      rows={6}
                      placeholder="Enter the document content..."
                      value={formData.content}
                      onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
                      data-testid="textarea-content"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">File upload coming soon</p>
                )}
                <Button onClick={handleCreate} className="w-full" disabled={createDoc.isPending} data-testid="button-submit">
                  Add Document
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : !filteredDocs || filteredDocs.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No documents found"
            description="Add documents to train your AI assistant"
            action={{ label: 'Add Document', onClick: () => setIsCreateOpen(true) }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="documents-grid">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-card border border-card-border rounded-lg p-5 hover:border-primary/50 transition-colors"
                data-testid={`doc-${doc.id}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDelete(doc.id)}
                    data-testid={`button-delete-${doc.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <h3 className="font-semibold mb-2">{doc.title}</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground uppercase">{doc.fileType}</span>
                    <StatusBadge status={doc.status} variant="compact" />
                  </div>
                  {doc.chunkCount !== null && doc.chunkCount !== undefined && (
                    <p className="text-xs text-muted-foreground">{doc.chunkCount} chunks</p>
                  )}
                  <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                    {formatDateTime(doc.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
