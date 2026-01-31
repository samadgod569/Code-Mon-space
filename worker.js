export default {
  async fetch(req, env) {
    try {
      const url = new URL(req.url);
      const parts = url.pathname.split("/").filter(Boolean);
      const user = parts[0];
      if (!user) return new Response("Missing user", { status: 400 });

      const rawRelPath = parts.slice(1).join("/") || "";
      const PREFIX = `${user}/`; // e.g., "C69P2W/"

      // -----------------------------
      // Load .cashing from KV
      // -----------------------------
      const key = PREFIX + ".cashing";
      const code = await env.FILES.get(key, "text");

      if (!code) {
        return new Response(`.cashing not found at key: ${key}`, { status: 404 });
      }

      // -----------------------------
      // Run the .cashing code
      // -----------------------------
      let result;
      try {
        const fn = new Function(
          "path",
          "status",
          `"use strict";
           const fetch=undefined;
           const WebSocket=undefined;
           const Request=undefined;
           const Response=undefined;
           const env=undefined;
           ${code}`
        );
        result = fn(rawRelPath, 404); // pass requested path and 404 as status
      } catch (e) {
        return new Response("Error running .cashing:\n" + e, { status: 500 });
      }

      if (typeof result !== "string") {
        return new Response("Cashing did not return a string", { status: 500 });
      }

      // -----------------------------
      // Return the result
      // -----------------------------
      return new Response(result, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });

    } catch (e) {
      return new Response("Internal Error:\n" + e, { status: 500 });
    }
  }
};
