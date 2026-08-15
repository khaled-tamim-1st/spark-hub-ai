import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'compact';
  className?: string;
}

const statusConfig: Record<string, { bg: string; text: string; dot?: string }> = {
  open: { bg: 'bg-blue-500/10', text: 'text-blue-600', dot: 'bg-blue-500' },
  resolved: { bg: 'bg-green-500/10', text: 'text-green-600', dot: 'bg-green-500' },
  pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-600', dot: 'bg-yellow-500' },
  snoozed: { bg: 'bg-gray-500/10', text: 'text-gray-600', dot: 'bg-gray-500' },
  ready: { bg: 'bg-green-500/10', text: 'text-green-600', dot: 'bg-green-500' },
  processing: { bg: 'bg-blue-500/10', text: 'text-blue-600', dot: 'bg-blue-500' },
  failed: { bg: 'bg-red-500/10', text: 'text-red-600', dot: 'bg-red-500' },
  active: { bg: 'bg-green-500/10', text: 'text-green-600', dot: 'bg-green-500' },
  inactive: { bg: 'bg-gray-500/10', text: 'text-gray-600', dot: 'bg-gray-500' },
};

export function StatusBadge({ status, variant = 'default', className }: StatusBadgeProps) {
  const config = statusConfig[status.toLowerCase()] || statusConfig.pending;
  
  if (variant === 'compact') {
    return (
      <span className={cn('inline-flex items-center gap-1.5', className)} data-testid={`status-${status.toLowerCase()}`}>
        <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
        <span className={cn('text-xs font-medium capitalize', config.text)}>{status}</span>
      </span>
    );
  }
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium capitalize',
        config.bg,
        config.text,
        className
      )}
      data-testid={`status-${status.toLowerCase()}`}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {status}
    </span>
  );
}
