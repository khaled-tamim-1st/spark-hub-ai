import Image from "next/image";

export function LogoSalla({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center bg-[#004D5A]/10 rounded-xl p-1 overflow-hidden ${className}`}>
      <Image
        src="/brands/salla.webp"
        alt="Salla سلة"
        width={48}
        height={48}
        className="w-full h-full object-contain"
      />
    </div>
  );
}

export function LogoZid({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center bg-[#4B0082]/10 rounded-xl p-1 overflow-hidden ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="100" height="100" rx="22" fill="#4B0082" />
        <path d="M26 33H74L45 67H74V73H26L55 39H26V33Z" fill="#A855F7" />
        <circle cx="68" cy="27" r="4" fill="#E9D5FF" />
      </svg>
    </div>
  );
}

export function LogoShopify({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center bg-white rounded-xl p-1 overflow-hidden ${className}`}>
      <Image
        src="/brands/shopify.png"
        alt="Shopify"
        width={48}
        height={48}
        className="w-full h-full object-contain"
      />
    </div>
  );
}

export function LogoSMSA({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center bg-white rounded-xl p-1 overflow-hidden ${className}`}>
      <Image
        src="/brands/smsa.png"
        alt="SMSA Express"
        width={48}
        height={48}
        className="w-full h-full object-contain"
      />
    </div>
  );
}

export function LogoAramex({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center rounded-xl p-0.5 overflow-hidden ${className}`}>
      <Image
        src="/brands/aramex.png"
        alt="Aramex"
        width={48}
        height={48}
        className="w-full h-full object-contain rounded-lg"
      />
    </div>
  );
}

export function LogoOTO({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center rounded-xl p-0.5 overflow-hidden ${className}`}>
      <Image
        src="/brands/oto.png"
        alt="OTO"
        width={48}
        height={48}
        className="w-full h-full object-contain rounded-lg"
      />
    </div>
  );
}

export function LogoJT({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center rounded-xl p-0.5 overflow-hidden ${className}`}>
      <Image
        src="/brands/jt-express.png"
        alt="J&T Express"
        width={48}
        height={48}
        className="w-full h-full object-contain rounded-lg"
      />
    </div>
  );
}

export function LogoApplePay({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center bg-white rounded-xl p-1 overflow-hidden shadow-2xs ${className}`}>
      <Image
        src="/brands/apple-pay.png"
        alt="Apple Pay"
        width={48}
        height={48}
        className="w-full h-full object-contain"
      />
    </div>
  );
}

export function LogoMada({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center bg-white rounded-xl p-1 overflow-hidden shadow-2xs ${className}`}>
      <Image
        src="/brands/mada.png"
        alt="mada"
        width={48}
        height={48}
        className="w-full h-full object-contain"
      />
    </div>
  );
}

export function LogoTamara({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center bg-white rounded-xl p-1 overflow-hidden shadow-2xs ${className}`}>
      <Image
        src="/brands/tamara.png"
        alt="Tamara"
        width={48}
        height={48}
        className="w-full h-full object-contain"
      />
    </div>
  );
}

export function LogoTabby({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center rounded-xl overflow-hidden ${className}`}>
      <svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="100" height="50" rx="12" fill="#3BFF9C" />
        <path d="M22 28.5V17.5H18V13.5H22V9.5H27V13.5H33V17.5H27V28.5C27 30 27.8 30.8 29.5 30.8C30.8 30.8 32 30.5 33 29.8V34C31.5 34.8 29.5 35.2 27.5 35.2C23.8 35.2 22 32.8 22 28.5Z" fill="#1E2022" />
        <path d="M43.5 13.5V17.5C45.2 14.5 48.5 13 52.2 13C58.5 13 63.5 18 63.5 24.5C63.5 31 58.5 36 52.2 36C48.5 36 45.2 34.5 43.5 31.5V35.5H38.5V9.5H43.5V13.5ZM51 17.5C47.2 17.5 43.5 20.8 43.5 24.5C43.5 28.2 47.2 31.5 51 31.5C54.8 31.5 58.5 28.2 58.5 24.5C58.5 20.8 54.8 17.5 51 17.5Z" fill="#1E2022" />
        <path d="M72.5 13.5V17.5C74.2 14.5 77.5 13 81.2 13C87.5 13 92.5 18 92.5 24.5C92.5 31 87.5 36 81.2 36C77.5 36 74.2 34.5 72.5 31.5V35.5H67.5V9.5H72.5V13.5ZM80 17.5C76.2 17.5 72.5 20.8 72.5 24.5C72.5 28.2 76.2 31.5 80 31.5C83.8 31.5 87.5 28.2 87.5 24.5C87.5 20.8 83.8 17.5 80 17.5Z" fill="#1E2022" />
      </svg>
    </div>
  );
}

export function LogoWhatsApp({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="100" height="100" rx="22" fill="#25D366" />
        <path fillRule="evenodd" clipRule="evenodd" d="M72.9 27.1C66.8 21 58.7 17.7 50.1 17.7C32.3 17.7 17.8 32.2 17.8 50C17.8 55.7 19.3 61.2 22.1 66.1L17.7 82.3L34.3 78C39 80.5 44.5 81.9 50.1 81.9H50.2C68 81.9 82.5 67.4 82.5 49.7C82.4 41.1 79 33.1 72.9 27.1ZM50.1 76.5H50C45.2 76.5 40.5 75.2 36.4 72.8L35.4 72.2L25.6 74.8L28.2 65.2L27.6 64.1C25 59.9 23.6 55 23.6 50C23.6 35.4 35.5 23.5 50.2 23.5C57.3 23.5 63.9 26.3 68.9 31.3C73.9 36.3 76.7 42.9 76.7 50C76.6 64.6 64.7 76.5 50.1 76.5ZM64.7 56.4C63.9 56 60 54.1 59.3 53.8C58.6 53.6 58 53.4 57.5 54.3C57 55.1 55.4 57 54.9 57.6C54.4 58.2 53.9 58.3 53.1 57.9C52.3 57.5 49.7 56.6 46.7 53.9C44.3 51.8 42.7 49.2 42.2 48.4C41.7 47.6 42.1 47.1 42.5 46.7C42.9 46.3 43.4 45.7 43.8 45.2C44.2 44.7 44.4 44.3 44.7 43.8C45 43.3 44.8 42.8 44.6 42.4C44.4 42 42.7 37.9 42 36.1C41.3 34.4 40.6 34.6 40.1 34.6H38.4C37.9 34.6 37.1 34.8 36.4 35.6C35.7 36.4 33.7 38.3 33.7 42.1C33.7 45.9 36.5 49.6 36.9 50.1C37.3 50.6 42.3 58.3 50 61.6C51.8 62.4 53.3 62.9 54.4 63.3C56.3 63.9 58 63.8 59.3 63.6C60.8 63.4 63.9 61.7 64.5 60C65.1 58.3 65.1 56.8 64.9 56.5C64.7 56.8 65.5 56.8 64.7 56.4Z" fill="white" />
      </svg>
    </div>
  );
}

export function LogoInstagram({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <radialGradient id="ig-grad" cx="30%" cy="107%" r="130%">
            <stop offset="0%" stopColor="#fdf497" />
            <stop offset="5%" stopColor="#fdf497" />
            <stop offset="45%" stopColor="#fd5949" />
            <stop offset="60%" stopColor="#d6249f" />
            <stop offset="90%" stopColor="#285AEB" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" rx="22" fill="url(#ig-grad)" />
        <rect x="25" y="25" width="50" height="50" rx="14" stroke="white" strokeWidth="6" />
        <circle cx="50" cy="50" r="12" stroke="white" strokeWidth="6" />
        <circle cx="64" cy="36" r="3.5" fill="white" />
      </svg>
    </div>
  );
}

export function LogoMessenger({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="msg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00C6FF" />
            <stop offset="100%" stopColor="#0078FF" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" rx="22" fill="url(#msg-grad)" />
        <path d="M50 20C33.4 20 20 32.5 20 48C20 56.8 24.3 64.6 31 69.8V80L41 74.5C43.9 75.5 46.9 76 50 76C66.6 76 80 63.5 80 48C80 32.5 66.6 20 50 20ZM53.5 57.5L45 48.5L28.5 57.5L46.5 38.5L55 47.5L71.5 38.5L53.5 57.5Z" fill="white" />
      </svg>
    </div>
  );
}
