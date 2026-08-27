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

  const targets = [
    process.env.API_SERVER_URL,
    "http://127.0.0.1:5000",
    "http://localhost:5000",
    "http://127.0.0.1:5005",
    "http://127.0.0.1:3000",
  ].filter(Boolean) as string[];

  let bodyText: string | undefined = undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    try {
      bodyText = await request.text();
    } catch {
      bodyText = undefined;
    }
  }

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

      return new NextResponse(responseText, {
        status: res.status,
        headers: {
          "Content-Type": contentType,
        },
      });
    } catch {
      // Continue to next candidate target
    }
  }

  return NextResponse.json({ error: "Backend API Server connection failed" }, { status: 502 });
}
