const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const path = url.pathname;

    // 🔹 Handle CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // Proxy endpoint
    if (path === "/api/engine") {

      // ---------- FORWARD GET ----------
      if (req.method === "GET") {
        const name = url.searchParams.get("name");

        if (!name) {
          return new Response("Missing name", {
            status: 400,
            headers: corsHeaders
          });
        }

        const apiRes = await fetch(
          `https://code-mon.workers.dev/api/app?name=${encodeURIComponent(name)}`,
          { method: "GET" }
        );

        return new Response(await apiRes.text(), {
          status: apiRes.status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/manifest+json"
          }
        });
      }

      // ---------- FORWARD POST ----------
      if (req.method === "POST") {
        let body;

        try {
          body = await req.json();
        } catch {
          return new Response("Invalid JSON", {
            status: 400,
            headers: corsHeaders
          });
        }

        const { user, pass, name, manifest } = body;

        if (!user || !pass || !name || !manifest) {
          return new Response("Missing fields", {
            status: 400,
            headers: corsHeaders
          });
        }

        const apiRes = await fetch(
          "https://code-mon.workers.dev/api/app",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ user, pass, name, manifest })
          }
        );

        return new Response(await apiRes.text(), {
          status: apiRes.status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        });
      }

      return new Response("Method Not Allowed", {
        status: 405,
        headers: corsHeaders
      });
    }

    return new Response("Not Found", {
      status: 404,
      headers: corsHeaders
    });
  }
};
