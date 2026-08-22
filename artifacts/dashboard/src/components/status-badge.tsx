import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'compact';
  className?: string;
}

const statusConfig: Record<string, { bg: string; text: string; dot?: string; labelArabic: string }> = {
  open: { bg: 'bg-blue-500/10', text: 'text-blue-600', dot: 'bg-blue-500', labelArabic: 'مفتوحة' },
  resolved: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', dot: 'bg-emerald-500', labelArabic: 'تم الحل ✅' },
  pending: { bg: 'bg-amber-500/10', text: 'text-amber-600', dot: 'bg-amber-500', labelArabic: 'قيد المتابعة' },
  snoozed: { bg: 'bg-gray-500/10', text: 'text-gray-600', dot: 'bg-gray-500', labelArabic: 'مؤجلة' },
  ready: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', dot: 'bg-emerald-500', labelArabic: 'جاهز ونشط' },
  processing: { bg: 'bg-blue-500/10', text: 'text-blue-600', dot: 'bg-blue-500', labelArabic: 'جاري المعالجة' },
  failed: { bg: 'bg-rose-500/10', text: 'text-rose-600', dot: 'bg-rose-500', labelArabic: 'فشل / خطأ' },
  active: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', dot: 'bg-emerald-500', labelArabic: 'نشط' },
  inactive: { bg: 'bg-gray-500/10', text: 'text-gray-600', dot: 'bg-gray-500', labelArabic: 'غير نشط' },
  completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', dot: 'bg-emerald-500', labelArabic: 'مكتملة' },
  ringing: { bg: 'bg-amber-500/10', text: 'text-amber-600', dot: 'bg-amber-500', labelArabic: 'جاري الاتصال...' },
  in_progress: { bg: 'bg-sky-500/10', text: 'text-sky-600', dot: 'bg-sky-500', labelArabic: 'مكالمة جارية' },
  initiated: { bg: 'bg-purple-500/10', text: 'text-purple-600', dot: 'bg-purple-500', labelArabic: 'بدأت' },
  won: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', dot: 'bg-emerald-500', labelArabic: 'تم التسليم' },
  lead: { bg: 'bg-indigo-500/10', text: 'text-indigo-600', dot: 'bg-indigo-500', labelArabic: 'عميل جديد' },
  shipping: { bg: 'bg-cyan-500/10', text: 'text-cyan-600', dot: 'bg-cyan-500', labelArabic: 'جاري الشحن' },
};

export function StatusBadge({ status, variant = 'default', className }: StatusBadgeProps) {
  const normalized = (status || 'pending').toLowerCase();
  const config = statusConfig[normalized] || {
    bg: 'bg-gray-500/10',
    text: 'text-gray-600',
    dot: 'bg-gray-500',
    labelArabic: status,
  };
  
  const displayLabel = config.labelArabic || status;

  if (variant === 'compact') {
    return (
      <span className={cn('inline-flex items-center gap-1.5', className)} data-testid={`status-${normalized}`}>
        <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
        <span className={cn('text-xs font-semibold', config.text)}>{displayLabel}</span>
      </span>
    );
  }
  
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold',
        config.bg,
        config.text,
        className
      )}
      data-testid={`status-${normalized}`}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dot)} />
      {displayLabel}
    </span>
  );
}
