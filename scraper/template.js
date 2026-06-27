const DEFAULT_DELAY_MS = 800;
const DEFAULT_TIMEOUT_MS = 15000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function normalizeStoreName(name) {
  return name.replace(/\s+/g, " ").trim();
}

function detectCategory(title = "", url = "") {
  const text = `${title} ${url}`.toLowerCase();
  if (/(shoe|sneaker|boot|sand|heel|calç|calcado|sapat|zapat)/.test(text)) return "Calçado";
  if (/(bag|belt|bagu|wallet|jewel|bijou|ócul|ocul|watch|perfume|access)/.test(text)) {
    return "Acessórios";
  }
  if (/(skirt|pant|jean|trouser|legging|short|calç|calc|falda)/.test(text)) {
    return "Partes de Baixo";
  }
  return "Partes de Cima";
}

async function fetchHtml(url, { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ao abrir ${url}`);
    }
    return await response.text();
  } finally {
    clearTimeout(timer);
  }
}

function extractMeta(html, candidates) {
  for (const selector of candidates) {
    const match = html.match(selector);
    if (match?.[1]) return match[1].trim();
  }
  return "";
}

export function buildStoreScraper(config) {
  return {
    ...config,
    async scrape({ url, delayMs = DEFAULT_DELAY_MS }) {
      if (delayMs > 0) await sleep(delayMs);

      const html = config.fetchHtml ? await config.fetchHtml(url) : await fetchHtml(url);
      const title =
        extractMeta(html, [
          /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
          /<title[^>]*>([^<]+)<\/title>/i,
          /<meta[^>]+name=["']twitter:title["'][^>]+content=["']([^"']+)["']/i,
        ]) || config.name;
      const image =
        extractMeta(html, [
          /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
          /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
        ]) || config.fallbackImage;
      const priceText =
        extractMeta(html, [
          /<meta[^>]+property=["']product:price:amount["'][^>]+content=["']([^"']+)["']/i,
          /<meta[^>]+property=["']og:price:amount["'][^>]+content=["']([^"']+)["']/i,
        ]) || "29.99";

      return {
        id: crypto.randomUUID(),
        nome: title.replace(/\s+\|.*$/, "").trim(),
        loja: normalizeStoreName(config.name),
        piso: config.floor || undefined,
        categoria: config.category || detectCategory(title, url),
        imagem: image,
        preco: Number.parseFloat(String(priceText).replace(",", ".")) || 29.99,
        link: url,
      };
    },
  };
}
