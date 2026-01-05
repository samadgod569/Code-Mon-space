(async function () {
    const params = new URLSearchParams(window.location.search);
    const user = params.get("user");
    const filename = params.get("filename");

    if (!user || !filename) {
        document.body.innerHTML = "<h2>Missing user or filename.</h2>";
        throw new Error("Missing query params");
    }

    const API_BASE = "https://code-mon.codemon.workers.dev/api/load";

    async function loadFile(name) {
        const res = await fetch(`${API_BASE}?user=${user}&filename=${name}`);
        if (!res.ok) throw new Error("Failed to load " + name);
        return await res.text();
    }

    // --------------------------------
    // LOAD HTML
    // --------------------------------
    let raw = await loadFile(filename);

    // --------------------------------
    // EXTRACT HEAD & BODY
    // --------------------------------
    const headMatch = raw.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
    const bodyMatch = raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

    const headContent = headMatch ? headMatch[1] : "";
    const bodyContent = bodyMatch ? bodyMatch[1] : raw;

    document.body.innerHTML = bodyContent;

    // --------------------------------
    // PRESERVE META / TITLE / ICONS
    // --------------------------------
    const tempHead = document.createElement("div");
    tempHead.innerHTML = headContent;

    [...tempHead.children].forEach(node => {
        const tag = node.tagName.toLowerCase();
        if (tag === "script" || tag === "style") return;
        document.head.appendChild(node.cloneNode(true));
    });

    // --------------------------------
    // INLINE <style>
    // --------------------------------
    [...tempHead.querySelectorAll("style")].forEach(s => {
        const style = document.createElement("style");
        style.textContent = s.textContent;
        document.head.appendChild(style);
    });

    // --------------------------------
    // <link rel="stylesheet">
    // --------------------------------
    for (const link of tempHead.querySelectorAll('link[rel="stylesheet"]')) {
        const href = link.getAttribute("href");
        if (/^(https?:)?\/\//i.test(href)) {
            document.head.appendChild(link.cloneNode(true));
        } else {
            try {
                const css = await loadFile(href);
                const style = document.createElement("style");
                style.textContent = css;
                document.head.appendChild(style);
            } catch (e) {
                console.error("CSS load failed:", href);
            }
        }
    }

    // --------------------------------
    // WAIT FOR DOM (CRITICAL FIX)
    // --------------------------------
    if (document.readyState === "loading") {
        await new Promise(r => document.addEventListener("DOMContentLoaded", r));
    }

    // --------------------------------
    // REWRITE fetch()
    // --------------------------------
    function rewriteFetches(code) {
        return code.replace(
            /fetch\(\s*["']([^"']+)["']\s*\)/g,
            (m, p) => {
                if (/^(https?:)?\/\//i.test(p) || p.startsWith("/")) return m;
                return `fetch("${API_BASE}?user=${user}&filename=${p}")`;
            }
        );
    }

    // --------------------------------
    // HANDLE ALL SCRIPTS (HEAD + BODY)
    // --------------------------------
    const scriptHolder = document.createElement("div");
    scriptHolder.innerHTML = headContent + bodyContent;

    const scripts = [...scriptHolder.querySelectorAll("script")];

    for (const old of scripts) {
        const src = old.getAttribute("src");
        const type = old.getAttribute("type") || "text/javascript";
        const inline = old.textContent || "";

        // ----------------------------
        // INLINE SCRIPT
        // ----------------------------
        if (!src) {
            const s = document.createElement("script");
            if (type === "module") {
                s.type = "module";
                s.textContent = rewriteFetches(inline);
            } else {
                s.textContent = rewriteFetches(inline);
            }
            document.body.appendChild(s);
            continue;
        }

        // ----------------------------
        // EXTERNAL HTTP SCRIPT
        // ----------------------------
        if (/^(https?:)?\/\//i.test(src)) {
            const s = document.createElement("script");
            s.src = src;
            if (type === "module") s.type = "module";
            document.body.appendChild(s);
            continue;
        }

        // ----------------------------
        // EXTERNAL LOCAL SCRIPT (FETCH & INJECT)
        // ----------------------------
        try {
            const js = await loadFile(src);
            const isModule =
                type === "module" || /\b(import|export)\b/.test(js);

            if (isModule) {
                // 🔥 MODULE MUST STAY MODULE
                const blob = new Blob(
                    [rewriteFetches(js)],
                    { type: "text/javascript" }
                );
                const url = URL.createObjectURL(blob);

                const s = document.createElement("script");
                s.type = "module";
                s.src = url;
                document.body.appendChild(s);
            } else {
                // 🔹 CLASSIC JS
                const s = document.createElement("script");
                s.textContent = rewriteFetches(js);
                document.body.appendChild(s);
            }
        } catch (e) {
            console.error("Script load failed:", src, e);
        }
    }

})();
    
