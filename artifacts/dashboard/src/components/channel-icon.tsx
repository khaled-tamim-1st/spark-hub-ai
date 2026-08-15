import { SiWhatsapp, SiFacebook, SiInstagram, SiTelegram, SiTiktok } from 'react-icons/si';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChannelIconProps {
  channelType: string;
  className?: string;
}

const channelConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  whatsapp: { icon: SiWhatsapp, color: 'text-green-500' },
  messenger: { icon: SiFacebook, color: 'text-blue-500' },
  instagram: { icon: SiInstagram, color: 'text-pink-500' },
  telegram: { icon: SiTelegram, color: 'text-sky-500' },
  tiktok: { icon: SiTiktok, color: 'text-gray-900' },
  web: { icon: Globe, color: 'text-gray-500' },
};

export function ChannelIcon({ channelType, className }: ChannelIconProps) {
  const config = channelConfig[channelType.toLowerCase()] || channelConfig.web;
  const Icon = config.icon;
  
  return <Icon className={cn('w-4 h-4', config.color, className)} />;
}
