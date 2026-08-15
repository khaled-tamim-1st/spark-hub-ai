import { useState } from 'react';
import { useListConversations, useListMessages, useSendMessage, getListConversationsQueryKey, getListMessagesQueryKey } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { StatusBadge } from '@/components/status-badge';
import { ChannelIcon } from '@/components/channel-icon';
import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Inbox as InboxIcon, Send, User, Bot } from 'lucide-react';
import { formatTime, getInitials } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export default function Inbox() {
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: conversations, isLoading } = useListConversations(
    statusFilter === 'all' ? {} : { status: statusFilter as any },
    { query: { queryKey: getListConversationsQueryKey(statusFilter === 'all' ? {} : { status: statusFilter as any }) } }
  );

  const { data: messages } = useListMessages(
    selectedConversationId || 0,
    { query: { enabled: !!selectedConversationId, queryKey: getListMessagesQueryKey(selectedConversationId || 0) } }
  );

  const sendMessage = useSendMessage();

  const selectedConversation = conversations?.find((c) => c.id === selectedConversationId);

  const handleSend = () => {
    if (!messageContent.trim() || !selectedConversationId) return;

    sendMessage.mutate(
      { conversationId: selectedConversationId, data: { content: messageContent } },
      {
        onSuccess: () => {
          setMessageContent('');
          queryClient.invalidateQueries({ queryKey: getListMessagesQueryKey(selectedConversationId) });
          queryClient.invalidateQueries({ queryKey: getListConversationsQueryKey({}) });
        },
        onError: (error) => {
          toast({
            title: 'Failed to send message',
            description: error.message,
            variant: 'destructive',
          });
        },
      }
    );
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Conversation List */}
      <div className="w-80 border-r border-border flex flex-col bg-card">
        <div className="p-4 border-b border-border space-y-3">
          <h2 className="text-lg font-semibold">Inbox</h2>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger data-testid="select-status-filter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Conversations</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="snoozed">Snoozed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : !conversations || conversations.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">No conversations found</p>
            </div>
          ) : (
            <div className="divide-y divide-border" data-testid="conversation-list">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversationId(conv.id)}
                  className={cn(
                    'w-full p-4 text-left hover:bg-muted/50 transition-colors',
                    selectedConversationId === conv.id && 'bg-muted'
                  )}
                  data-testid={`conversation-${conv.id}`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      <AvatarImage src={conv.contact?.avatarUrl || undefined} />
                      <AvatarFallback>
                        {conv.contact ? getInitials(conv.contact.firstName, conv.contact.lastName) : <User className="w-5 h-5" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm truncate">
                          {conv.contact ? `${conv.contact.firstName} ${conv.contact.lastName}` : 'Unknown Contact'}
                        </p>
                        <ChannelIcon channelType={conv.channelType} />
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{conv.lastMessage || 'No messages'}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <StatusBadge status={conv.status} variant="compact" />
                        {conv.aiHandled && <Bot className="w-3 h-3 text-primary" />}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Message View */}
      <div className="flex-1 flex flex-col">
        {!selectedConversation ? (
          <EmptyState
            icon={InboxIcon}
            title="No conversation selected"
            description="Select a conversation from the list to view messages"
          />
        ) : (
          <>
            {/* Header */}
            <div className="p-4 border-b border-border bg-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedConversation.contact?.avatarUrl || undefined} />
                  <AvatarFallback>
                    {selectedConversation.contact
                      ? getInitials(selectedConversation.contact.firstName, selectedConversation.contact.lastName)
                      : <User className="w-5 h-5" />}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {selectedConversation.contact
                      ? `${selectedConversation.contact.firstName} ${selectedConversation.contact.lastName}`
                      : 'Unknown Contact'}
                  </p>
                  <div className="flex items-center gap-2">
                    <ChannelIcon channelType={selectedConversation.channelType} />
                    <span className="text-xs text-muted-foreground capitalize">{selectedConversation.channelType}</span>
                  </div>
                </div>
              </div>
              <StatusBadge status={selectedConversation.status} />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20" data-testid="message-list">
              {!messages || messages.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No messages yet</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex gap-3',
                      msg.senderType === 'contact' ? 'justify-start' : 'justify-end'
                    )}
                    data-testid={`message-${msg.id}`}
                  >
                    {msg.senderType === 'contact' && (
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="text-xs">
                          {selectedConversation.contact
                            ? getInitials(selectedConversation.contact.firstName, selectedConversation.contact.lastName)
                            : 'U'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        'max-w-md rounded-lg px-4 py-2',
                        msg.senderType === 'contact'
                          ? 'bg-card border border-card-border'
                          : msg.senderType === 'ai'
                          ? 'bg-primary/10 border border-primary/20'
                          : 'bg-primary text-primary-foreground'
                      )}
                    >
                      {msg.senderType === 'ai' && (
                        <div className="flex items-center gap-1 text-xs text-primary font-medium mb-1">
                          <Bot className="w-3 h-3" />
                          AI
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <p className={cn(
                        'text-xs mt-1',
                        msg.senderType === 'contact' || msg.senderType === 'ai' ? 'text-muted-foreground' : 'text-primary-foreground/70'
                      )}>
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                    {msg.senderType === 'agent' && (
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                          {msg.senderName ? msg.senderName.charAt(0) : 'A'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Send Message */}
            <div className="p-4 border-t border-border bg-card">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type a message..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  className="resize-none"
                  rows={3}
                  data-testid="textarea-message"
                />
                <Button
                  onClick={handleSend}
                  disabled={!messageContent.trim() || sendMessage.isPending}
                  size="icon"
                  className="h-auto"
                  data-testid="button-send"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
