import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return handleProxy(request, path);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return handleProxy(request, path);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return handleProxy(request, path);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  return handleProxy(request, path);
}

async function handleProxy(request: NextRequest, path: string[]) {
  const subPath = path.join("/");
  const searchParams = request.nextUrl.search;

  // Primary target is port 3000 (where the backend dashboard & api listen on VPS)
  const targets = [
    process.env.API_SERVER_URL,
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "http://127.0.0.1:5000",
    "http://localhost:5000",
  ].filter(Boolean) as string[];

  let bodyText: string | undefined = undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    try {
      bodyText = await request.text();
    } catch {
      bodyText = undefined;
    }
  }

  const errors: string[] = [];

  for (const target of targets) {
    try {
      const targetUrl = `${target.replace(/\/+$/, "")}/api/${subPath}${searchParams}`;
      const headers: Record<string, string> = {};
      
      request.headers.forEach((value, key) => {
        const lower = key.toLowerCase();
        if (lower !== "host" && lower !== "content-length" && lower !== "connection") {
          headers[key] = value;
        }
      });
      headers["content-type"] = request.headers.get("content-type") || "application/json";

      const res = await fetch(targetUrl, {
        method: request.method,
        headers,
        body: bodyText,
      });

      const responseText = await res.text();
      const contentType = res.headers.get("content-type") || "application/json";

      const isJson = contentType.includes("application/json") || 
                     responseText.trim().startsWith("{") || 
                     responseText.trim().startsWith("[");

      if (res.ok || isJson) {
        return new NextResponse(responseText, {
          status: res.status,
          headers: {
            "Content-Type": isJson ? "application/json" : contentType,
            "X-Proxied-From": target,
          },
        });
      }

      errors.push(`${target}: status ${res.status} non-json`);
    } catch (e: any) {
      errors.push(`${target}: ${e?.message || "connection failed"}`);
    }
  }

  console.error("[API Proxy] All targets failed:", errors);
  return NextResponse.json(
    { error: "Backend API Server connection failed", details: errors },
    { status: 502 }
  );
}
