export function getAppUrl(path: string = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return `${process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")}${cleanPath}`;
  }

  if (typeof window !== "undefined") {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    return `${protocol}//${hostname}:3000${cleanPath}`;
  }

  return `http://187.127.141.114:3000${cleanPath}`;
}
