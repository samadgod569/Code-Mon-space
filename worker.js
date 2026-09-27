/**
 * Cloudflare Worker — CORS proxy for the admin panel API.
 *
 * What it does:
 *   Browser --> this Worker --> https://craftersgpt.wisp.uno/api/admin/...
 *   The Worker makes the real request server-side (no CORS involved there),
 *   then returns the response to the browser with proper CORS headers added.
 *
 * Deploy:
 *   1. Cloudflare dashboard -> Workers & Pages -> Create -> Worker
 *   2. Paste this file as the Worker's code, then Deploy.
 *   3. Note the Worker's URL, e.g. https://your-worker.your-subdomain.workers.dev
 *
 * Then in admin-7.html, change:
 *   var API_BASE = "https://craftersgpt.wisp.uno/api/admin";
 * to:
 *   var API_BASE = "https://your-worker.your-subdomain.workers.dev/api/admin";
 */

// The real backend this Worker forwards requests to.
const UPSTREAM_ORIGIN = "https://craftersgpt.wisp.uno";

// Set to a specific origin (e.g. "https://yourdomain.com") to lock this down
// instead of allowing any site to use the proxy. "*" allows any origin.
const ALLOWED_ORIGIN = "*";

// Headers the browser is allowed to send. Add more here if your admin panel
// ever sends additional custom headers.
const ALLOWED_HEADERS = "Content-Type, x-admin-token, Authorization";

const ALLOWED_METHODS = "GET, POST, PUT, PATCH, DELETE, OPTIONS";

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN === "*" ? "*" : ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": ALLOWED_METHODS,
    "Access-Control-Allow-Headers": ALLOWED_HEADERS,
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "*";
    const cors = corsHeaders(origin);

    // Handle CORS preflight requests.
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    // Only proxy paths under /api/admin — anything else gets a 404.
    if (!url.pathname.startsWith("/api/admin")) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    const targetUrl = UPSTREAM_ORIGIN + url.pathname + url.search;

    // Build the headers to forward upstream. Drop hop-by-hop / browser-only
    // headers that shouldn't be forwarded or that the runtime sets itself.
    const forwardHeaders = new Headers(request.headers);
    forwardHeaders.delete("Origin");
    forwardHeaders.delete("Referer");
    forwardHeaders.delete("Host");
    forwardHeaders.delete("Cookie"); // don't leak the proxy's own cookies, if any

    let response;
    try {
      response = await fetch(targetUrl, {
        method: request.method,
        headers: forwardHeaders,
        body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
        redirect: "follow",
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ error: "Upstream request failed", detail: String(err) }),
        { status: 502, headers: { "Content-Type": "application/json", ...cors } }
      );
    }

    // Clone the upstream response and add CORS headers to it.
    const responseHeaders = new Headers(response.headers);
    Object.entries(cors).forEach(([key, value]) => responseHeaders.set(key, value));

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  },
};
