export function getAppUrl(path: string = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return `${process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")}${cleanPath}`;
  }

  if (typeof window !== "undefined") {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    if (window.location.port === "4000") {
      return `${protocol}//${hostname}:3000${cleanPath}`;
    }
    if (hostname.includes("ecomate.ai")) {
      return `${protocol}//app.ecomate.ai${cleanPath}`;
    }
    return `${protocol}//${hostname}:3000${cleanPath}`;
  }

  return `http://187.127.141.114:3000${cleanPath}`;
}

export function getApiUrl(path: string = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  if (process.env.NEXT_PUBLIC_API_URL) {
    return `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}${cleanPath}`;
  }

  if (typeof window !== "undefined") {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    
    // When on port 4000 (website), use relative URL so Next.js proxy routes to port 3000
    if (window.location.port === "4000") {
      return cleanPath;
    }
    if (window.location.port === "3000") {
      return `${protocol}//${hostname}:3000${cleanPath}`;
    }
    if (hostname.includes("ecomate.ai")) {
      return `${protocol}//app.ecomate.ai${cleanPath}`;
    }
    return `${protocol}//${hostname}:3000${cleanPath}`;
  }

  return `http://187.127.141.114:3000${cleanPath}`;
}
