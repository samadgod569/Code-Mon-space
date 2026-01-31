export default {
  async fetch(req, env) {
    try {
      const url = new URL(req.url);
      const parts = url.pathname.split("/").filter(Boolean);
      const user = parts[0];
      if (!user) return new Response("Missing user", { status: 400 });

      const rawRelPath = parts.slice(1).join("/") || "";
      const PREFIX = `${user}/`;

      // -----------------------------
      // KV loader with debug
      // -----------------------------
      async function loadFile(name, type = "text") {
        const key = PREFIX + name;

        // DEBUG: list keys under this user prefix
        const list = await env.FILES.list({ prefix: PREFIX });
        console.log("KV LIST for user:", list.keys.map(k => k.name));

        const data = await env.FILES.get(key, type === "arrayBuffer" ? "arrayBuffer" : "text");
        console.log("KV GET:", key, data ? "FOUND" : "MISSING");
        if (data == null) throw new Error("Missing " + key);
        return data;
      }

      // -----------------------------
      // .cashing executor
      // -----------------------------
      async function runCashing(relPath, status) {
        try {
          const code = await loadFile("index.js"); // Load from KV
          console.log("CASHING RAW CODE:", code); // log raw code
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
          const result = fn(relPath, status);
          console.log("CASHING RETURNED:", result); // log returned filename
          if (typeof result !== "string") return null;
          return result.trim().replace(/^\/+/, "");
        } catch (e) {
          console.log("CASHING ERROR:", e);
          return null;
        }
      }

      // -----------------------------
      // Main test flow
      // -----------------------------
      const fallback = await runCashing(rawRelPath, 404);

      return new Response(
        JSON.stringify({
          requestedPath: rawRelPath,
          fallbackReturned: fallback,
        }, null, 2),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (e) {
      return new Response("Internal Server Error:\n" + e, { status: 500 });
    }
  }
};
