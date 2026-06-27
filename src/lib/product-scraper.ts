import { CATEGORIAS, type Categoria } from "@/lib/wardrobe-types";

export type ScrapedProduct = {
  title: string;
  image: string;
  url: string;
  price: number | null;
  currency: string | null;
  store: string;
  category: Categoria;
};

const STORE_PATTERNS: Array<[RegExp, string]> = [
  [/zara\.com/i, "Zara"],
  [/bershka\.com/i, "Bershka"],
  [/asos\.com/i, "ASOS"],
  [/pullandbear\.com/i, "Pull & Bear"],
  [/nike\.com/i, "Nike"],
  [/adidas\.com/i, "Adidas"],
  [/stradivarius\.com/i, "Stradivarius"],
  [/mango\.com/i, "Mango"],
  [/hm\.com/i, "H&M"],
  [/massimodutti\.com/i, "Massimo Dutti"],
];

const PRICE_CURRENCY_MAP: Record<string, string> = {
  eur: "EUR",
  euro: "EUR",
  usd: "USD",
  gbp: "GBP",
};

const CATEGORY_RULES: Array<[RegExp, Categoria]> = [
  [/(shoe|sneaker|boot|heel|trainer|sandalia|calcado|sapato)/i, "Calçado"],
  [/(bag|belt|wallet|watch|jewel|jewelry|accessor|glass|oculos|óculos)/i, "Acessórios"],
  [/(skirt|jean|trouser|pants|shorts|legging|bottom|calça|saia)/i, "Partes de Baixo"],
];

const TRACKING_PARAMS = new Set(["fbclid", "gclid", "igshid", "mc_cid", "mc_eid", "msclkid"]);

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function stripTags(value: string) {
  return value.replace(/<[^>]*>/g, " ");
}

function extractMetaContent(html: string, names: string[]) {
  for (const name of names) {
    const pattern = new RegExp(
      `<meta[^>]+(?:property|name)=["']${name.replace(/:/g, "[:]?")}["'][^>]+content=["']([^"']+)["']`,
      "i",
    );
    const match = html.match(pattern);
    if (match?.[1]) return normalizeWhitespace(decodeHtmlEntities(match[1]));
  }
  return "";
}

function findFirstText(html: string, selectors: RegExp[]) {
  for (const selector of selectors) {
    const match = html.match(selector);
    if (match?.[1]) {
      const text = normalizeWhitespace(decodeHtmlEntities(stripTags(match[1])));
      if (text) return text;
    }
  }
  return "";
}

function makeAbsoluteUrl(baseUrl: string, href: string) {
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return href;
  }
}

function detectStore(url: string, title: string) {
  const text = `${url} ${title}`;
  const found = STORE_PATTERNS.find(([pattern]) => pattern.test(text));
  if (found) return found[1];
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Loja";
  }
}

function detectCategory(title: string, url: string) {
  const text = `${title} ${url}`;
  const match = CATEGORY_RULES.find(([pattern]) => pattern.test(text));
  return match?.[1] ?? "Partes de Cima";
}

function sanitizeTitle(title: string) {
  return normalizeWhitespace(title)
    .replace(/\s+[|•·-]\s+.*$/, "")
    .replace(/[^\p{L}\p{N}\s&()'’./-]/gu, "")
    .trim();
}

export function removeTrackingParams(input: string) {
  try {
    const url = new URL(input);
    for (const key of [...url.searchParams.keys()]) {
      if (key.toLowerCase().startsWith("utm_") || TRACKING_PARAMS.has(key.toLowerCase())) {
        url.searchParams.delete(key);
      }
    }
    return url.toString();
  } catch {
    return input;
  }
}

export function normalizePrice(value: string | number | null | undefined) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (!value) return null;
  const cleaned = String(value)
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3}\b)/g, "")
    .replace(",", ".");
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function validateImageUrl(url: string) {
  if (!url) return false;
  try {
    // A validação acontece no cliente/servidor antes do save para evitar
    // persistir URLs quebradas ou payloads maliciosos.
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}

export async function extractProductMetadata(url: string, html: string): Promise<ScrapedProduct> {
  try {
    // Fallback em camadas: primeiro meta tags Open Graph, depois elementos
    // de produto comuns e, por fim, heurísticas baseadas no HTML e na URL.
    // Isto torna a extração resiliente em lojas com estruturas muito diferentes.
    const canonical = extractMetaContent(html, ["og:url"]);
    const title =
      sanitizeTitle(
        extractMetaContent(html, ["og:title", "twitter:title"]) ||
          findFirstText(html, [
            /<h1[^>]*>([\s\S]*?)<\/h1>/i,
            /<[^>]+data-product-title[^>]*>([\s\S]*?)<\/[^>]+>/i,
            /<[^>]+class=["'][^"']*product-title[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>/i,
            /<title[^>]*>([\s\S]*?)<\/title>/i,
          ]),
      ) || "Peça sem título";

    const explicitImage =
      extractMetaContent(html, ["og:image", "twitter:image"]) ||
      findFirstText(html, [
        /<img[^>]+class=["'][^"']*product-image[^"']*["'][^>]*src=["']([^"']+)["'][^>]*>/i,
        /<img[^>]+data-product-image[^>]*src=["']([^"']+)["'][^>]*>/i,
        /<img[^>]+src=["']([^"']+)["'][^>]*>/i,
      ]);

    const image = explicitImage ? makeAbsoluteUrl(url, explicitImage) : "";

    const priceText =
      extractMetaContent(html, ["product:price:amount", "og:price:amount"]) ||
      findFirstText(html, [
        /(?:data-price|data-product-price|price)["']?[^>]*>([\d.,\s€$£]+)/i,
        /(?:€|\$|£)\s?([\d.,]+)/i,
      ]);
    const currencyText =
      extractMetaContent(html, ["product:price:currency"]) ||
      (html.match(
        /(?:product:price:currency|priceCurrency)["']?[^>]+content=["']([^"']+)["']/i,
      )?.[1] ??
        "");

    const store = detectStore(url, title);
    const category = detectCategory(title, `${url} ${store}`);

    const imageOk = image ? await validateImageUrl(image) : false;

    return {
      title,
      image: imageOk ? image : "",
      url: removeTrackingParams(canonical || url),
      price: normalizePrice(priceText),
      currency: currencyText
        ? (PRICE_CURRENCY_MAP[currencyText.toLowerCase()] ?? currencyText.toUpperCase())
        : null,
      store,
      category,
    };
  } catch {
    return {
      title: "Peça sem título",
      image: "",
      url: removeTrackingParams(url),
      price: null,
      currency: null,
      store: detectStore(url, ""),
      category: "Partes de Cima",
    };
  }
}

export function parseHtmlForProduct(url: string, html: string) {
  return extractProductMetadata(url, html);
}

export function sanitizeProductDraft(draft: {
  title?: string;
  image?: string;
  url?: string;
  price?: string | number | null;
  currency?: string | null;
  store?: string;
  category?: string;
}) {
  // A sanitização reduz risco de injection/poisoning: remove tracking,
  // normaliza preços e garante categorias conhecidas antes de persistir.
  const title = sanitizeTitle(draft.title ?? "");
  const url = removeTrackingParams(draft.url ?? "");
  const price = normalizePrice(draft.price);
  const category = CATEGORIAS.includes(draft.category as Categoria)
    ? (draft.category as Categoria)
    : "Partes de Cima";
  return {
    title: title || "Peça sem título",
    image: draft.image ?? "",
    url,
    price,
    currency: draft.currency ? draft.currency.toUpperCase() : null,
    store: normalizeWhitespace(draft.store ?? "Loja"),
    category,
  };
}
