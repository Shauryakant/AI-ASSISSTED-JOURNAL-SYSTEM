import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const INTERNAL_API_URL = (
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000'
).replace(/\/$/, '');

const buildTargetUrl = (pathSegments: string[], request: NextRequest) => {
  const path = pathSegments.join('/');
  const target = new URL(`${INTERNAL_API_URL}/api/${path}`);
  target.search = request.nextUrl.search;
  return target;
};

const proxyRequest = async (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) => {
  const { path } = await context.params;
  const targetUrl = buildTargetUrl(path, request);
  const requestHeaders = new Headers();
  const contentType = request.headers.get('content-type');
  const accept = request.headers.get('accept');
  const authorization = request.headers.get('authorization');

  if (contentType) {
    requestHeaders.set('content-type', contentType);
  }

  if (accept) {
    requestHeaders.set('accept', accept);
  }

  if (authorization) {
    requestHeaders.set('authorization', authorization);
  }

  const requestBody = request.method === 'GET' || request.method === 'HEAD'
    ? undefined
    : Buffer.from(await request.arrayBuffer());

  const upstreamResponse = await fetch(targetUrl, {
    method: request.method,
    headers: requestHeaders,
    body: requestBody,
    cache: 'no-store',
  });

  const responseBody = await upstreamResponse.arrayBuffer();
  const responseHeaders = new Headers();
  const responseContentType = upstreamResponse.headers.get('content-type');

  if (responseContentType) {
    responseHeaders.set('content-type', responseContentType);
  }

  return new NextResponse(responseBody, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders,
  });
};

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const HEAD = proxyRequest;
export const OPTIONS = proxyRequest;
