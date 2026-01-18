export default {
  async fetch(req, env, ctx) {
    const cache = caches.default;

    try {
      const url = new URL(req.url);
      const parts = url.pathname.split("/").filter(Boolean);
      const user = parts[0];
      const filename = parts[1];

      if (!user || !filename)
        return new Response("Missing user or filename", { status: 400 });

      const PREFIX = `${user}/`;
      const ext = filename.split(".").pop().toLowerCase();

      // ---------------- HELPER ----------------
      async function loadFile(name, type="text") {
        const data = await env.FILES.get(PREFIX + name, type === "arrayBuffer" ? "arrayBuffer" : "text");
        if (!data) throw new Error("Missing " + name);
        return data;
      }

      // ---------------- RAW FILES (JS/CSS/Assets) ----------------
      if (!["html","htm"].includes(ext)) {
        // cache engine scripts aggressively
        let data = await loadFile(filename, "arrayBuffer");
        const mime = {
          js:"text/javascript", css:"text/css", json:"application/json",
          png:"image/png", jpg:"image/jpeg", jpeg:"image/jpeg",
          svg:"image/svg+xml", wasm:"application/wasm"
        }[ext] || "application/octet-stream";

        const res = new Response(data, {
          headers: {
            "Content-Type": mime,
            "Cache-Control": "public,max-age=31536000,immutable"
          }
        });

        ctx.waitUntil(cache.put(req, res.clone()));
        return res;
      }

      // ---------------- HTML FILES ----------------
      // Always compile fresh HTML (don’t cache compiled HTML)
      let raw = await loadFile(filename);

      const head = raw.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] || "";
      const body = raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] || raw;

      function rewriteFetches(code){
        return code.replace(/fetch\(["']([^"']+)["']\)/g,(m,p)=>{
          if(/^(https?:)?\/\//.test(p)||p.startsWith("/")) return m;
          return `fetch("/${user}/${p}")`;
        });
      }

      function fixCSSUrls(css){
        return css.replace(/url\(["']?([^"')]+)["']?\)/g,(m,p)=>{
          if(/^(https?:)?\/\//.test(p)||p.startsWith("/")) return m;
          return `url("/${user}/${p}")`;
        });
      }

      // ---------------- PROCESS STYLES ----------------
      let finalHead = head.replace(/<script[\s\S]*?<\/script>/gi,"")
                          .replace(/<style[\s\S]*?<\/style>/gi,"")
                          .replace(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi,"");

      for(const m of head.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)){
        finalHead += `<style>${fixCSSUrls(m[1])}</style>`;
      }

      for(const l of head.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi)){
        const href = l[0].match(/href=["']([^"']+)["']/i)?.[1];
        if (!href) continue;
        if (/^(https?:)?\/\//.test(href)) finalHead += l[0];
        else {
          try {
            const css = await loadFile(href);
            finalHead += `<style>${fixCSSUrls(css)}</style>`;
          } catch {}
        }
      }

      // ---------------- PROCESS SCRIPTS ----------------
      let finalScripts = "";
      const scriptRegex = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
      const allScripts = [...head.matchAll(scriptRegex), ...body.matchAll(scriptRegex)];

      for (const m of allScripts) {
        const attrs = m[1];
        const inline = m[2];
        const src = attrs.match(/src=["']([^"']+)["']/i)?.[1];
        const type = attrs.match(/type=["']([^"']+)["']/i)?.[1];

        if (!src) {
          finalScripts += `<script${type ? ` type="${type}"` : ""}>${rewriteFetches(inline)}</script>`;
          continue;
        }

        if (/^(https?:)?\/\//.test(src)) {
          finalScripts += `<script src="${src}"${type ? ` type="${type}` : ""}></script>`;
          continue;
        }

        try {
          const js = await loadFile(src);
          const rewritten = rewriteFetches(js);

          // cache engine scripts only
          if(src.includes("engine") || src.includes("components") || src.includes("systems")){
            const reqEngine = new Request(req.url + "?engine=" + src);
            ctx.waitUntil(cache.put(reqEngine, new Response(js, {
              headers: { "Content-Type":"text/javascript", "Cache-Control":"public,max-age=31536000,immutable" }
            })));
          }

          finalScripts += `<script${type ? ` type="${type}"` : ""}>${rewritten}</script>`;
        } catch {}
      }

      const cleanBody = body.replace(/<script[\s\S]*?<\/script>/gi,"");

      const finalHTML = `
<!DOCTYPE html>
<html>
<head>
${finalHead}
</head>
<body>
${cleanBody}
${finalScripts}
</body>
</html>`;

      return new Response(finalHTML, {
        headers: {
          "Content-Type": "text/html; charset=utf-8"
        }
      });

    } catch(e) {
      return new Response("Worker crash:\n" + e.stack, { status:500 });
    }
  }
};
