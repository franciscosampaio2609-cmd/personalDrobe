import puppeteer from "puppeteer";

const DEFAULT_NAV_TIMEOUT_MS = 45000;
const DEFAULT_LIMIT_PER_STORE = 80;
const PAGE_GAP_MS = 450;
const COLLECTION_GAP_MS = 500;

const STORES = [
  { name: "H&M", url: "https://www2.hm.com/pt_pt/index.html" },
  { name: "BERSHKA", url: "https://www.bershka.com/pt/" },
  { name: "C&A", url: "https://www.c-and-a.com/eu/pt/shop" },
  { name: "CALZEDONIA", url: "https://www.calzedonia.com/pt/" },
  { name: "DECENIO", url: "https://www.decenio.com/pt/pt/" },
  { name: "FORTE Store", url: "https://forte-store.pt/" },
  { name: "GIOVANNI GALLI", url: "https://www.giovannigalli.com/" },
  { name: "LEFTIES", url: "https://www.lefties.com/pt/" },
  { name: "INTIMISSIMI", url: "https://www.intimissimi.com/pt/" },
  { name: "JD SPORTS", url: "https://www.jdsports.pt/" },
  { name: "LION OF PORCHES", url: "https://www.lionofporches.com/pt/" },
  { name: "MASSIMO DUTTI", url: "https://www.massimodutti.com/pt/" },
  { name: "MANGO", url: "https://shop.mango.com/pt/" },
  { name: "MO", url: "https://www.mo-online.com/pt/" },
  { name: "MR. BLUE", url: "https://mrblue.pt/" },
  { name: "NEW YORKER", url: "https://www.newyorker.de/pt/" },
  { name: "OVS", url: "https://www.ovs.pt/" },
  { name: "PULL & BEAR", url: "https://www.pullandbear.com/pt/" },
  { name: "PRIMARK", url: "https://www.primark.com/pt/" },
  { name: "SALSA", url: "https://www.salsajeans.com/pt/" },
  { name: "SEASIDE", url: "https://www.seaside.pt/" },
  { name: "SPRINGFIELD", url: "https://myspringfield.com/pt/" },
  { name: "STRADIVARIUS", url: "https://www.stradivarius.com/pt/" },
  { name: "SUITS INC", url: "https://suitsinc.pt/" },
  { name: "TEZENIS", url: "https://www.tezenis.com/pt/" },
  { name: "TIFFOSI", url: "https://www.tiffosi.com/pt/" },
  { name: "TOUS", url: "https://www.tous.com/pt-PT/" },
  { name: "VILANOVA", url: "https://www.vilanova.com/pt/" },
  { name: "WOMEN'SECRET", url: "https://www.womensecret.com/pt/" },
  { name: "ZIPPY", url: "https://zippykidstore.com/pt/" },
  { name: "ZARA", url: "https://www.zara.com/pt/" },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const normalize = (value = "") =>
  value
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\s+\|\s+.*$/, "");

const uniq = (values) => Array.from(new Set(values.filter(Boolean)));

function inferCategory(title = "", url = "") {
  const text = `${title} ${url}`.toLowerCase();
  if (/(shoe|sneaker|boot|sand|heel|sapat|zapat|calc\w*|cal\w*do)/.test(text)) {
    return "Cal\u00e7ado";
  }
  if (/(bag|belt|wallet|jewel|bijou|glass|ocul|watch|access|jewelry|bracelet|ring)/.test(text)) {
    return "Acess\u00f3rios";
  }
  if (/(skirt|pant|jean|trouser|legging|short|berm|cal\w*a|jeans|denim)/.test(text)) {
    return "Partes de Baixo";
  }
  return "Partes de Cima";
}

function pickPrice(text = "") {
  const match = text.replace(/\s/g, "").match(/(\d{1,4}(?:[.,]\d{2})?)/);
  if (!match) return 0;
  return Number.parseFloat(match[1].replace(",", ".")) || 0;
}

async function getPageData(page, storeName, pageUrl) {
  return page.evaluate(
    ({ storeName, pageUrl }) => {
      const meta = (key) =>
        document
          .querySelector(`meta[property="${key}"], meta[name="${key}"]`)
          ?.getAttribute("content") ?? "";
      const title =
        meta("og:title") ||
        document.querySelector("h1")?.textContent ||
        document.title ||
        storeName;
      const image =
        meta("og:image") ||
        meta("twitter:image") ||
        document.querySelector("img[src]")?.getAttribute("src") ||
        document.querySelector("img[src]")?.currentSrc ||
        "";
      const price =
        meta("product:price:amount") ||
        meta("og:price:amount") ||
        meta("product:price") ||
        document.body?.innerText?.match(/(?:€|EUR)\s?\d+[.,]\d{2}|\d+[.,]\d{2}\s?(?:€|EUR)/)?.[0] ||
        "";
      return { title, image, price, pageUrl };
    },
    { storeName, pageUrl },
  );
}

function collectLinks(pageUrl, links) {
  const skipTokens = [
    "mailto:",
    "javascript:",
    "#",
    "facebook.com",
    "instagram.com",
    "youtube.com",
    "tiktok.com",
  ];
  return uniq(
    links
      .filter((href) => href && !skipTokens.some((token) => href.includes(token)))
      .map((href) => new URL(href, pageUrl).toString()),
  );
}

function scoreLink(href) {
  const lower = href.toLowerCase();
  let score = 0;
  if (/(product|produto|pdp|item|detail)/.test(lower)) score += 8;
  if (/(category|categoria|collection|colecc|colecao|shop|new|women|men|kids|loja)/.test(lower))
    score += 5;
  if (/(search|cart|login|account|help|store-locator|about|blog|news)/.test(lower)) score -= 10;
  if (/(sale|promo|outlet)/.test(lower)) score += 2;
  return score;
}

function buildDiscoveryUrls(storeUrl) {
  const url = new URL(storeUrl);
  const base = `${url.origin}`;
  const seeds = [
    storeUrl,
    `${base}/collections`,
    `${base}/collection`,
    `${base}/category`,
    `${base}/categorias`,
    `${base}/shop`,
    `${base}/loja`,
    `${base}/products`,
    `${base}/product`,
    `${base}/sitemap.xml`,
  ];
  return uniq(seeds);
}

async function scrapeProductsFromPage(page, pageUrl, storeName, seenProducts, results, limit) {
  const links = await page.evaluate(() =>
    Array.from(document.querySelectorAll("a[href]")).map((a) => a.href),
  );
  const candidates = collectLinks(pageUrl, links)
    .filter((href) => !seenProducts.has(href))
    .sort((a, b) => scoreLink(b) - scoreLink(a));

  for (const candidate of candidates) {
    if (results.length >= limit) break;
    seenProducts.add(candidate);
    try {
      await page.goto(candidate, { waitUntil: "networkidle2" });
      const { title, image, price } = await getPageData(page, storeName, candidate);
      const normalizedTitle = normalize(title);
      const parsedPrice = pickPrice(price || title);
      const imageUrl = image?.startsWith("//") ? `https:${image}` : image;
      if (!normalizedTitle || !imageUrl || !parsedPrice) continue;

      results.push({
        id: crypto.randomUUID(),
        nome: normalizedTitle,
        loja: storeName,
        categoria: inferCategory(normalizedTitle, candidate),
        imagem: imageUrl,
        preco: parsedPrice,
        link: candidate,
      });
    } catch {
      continue;
    }
    await sleep(PAGE_GAP_MS);
  }
}

async function scrapeCollectionPage(page, collectionUrl, storeName, seenProducts, results, limit) {
  try {
    await page.goto(collectionUrl, { waitUntil: "networkidle2" });
  } catch {
    return;
  }

  const productLikeLinks = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll("a[href]"));
    return anchors.map((a) => a.href);
  });

  const ranked = collectLinks(collectionUrl, productLikeLinks)
    .filter((href) => !seenProducts.has(href))
    .sort((a, b) => scoreLink(b) - scoreLink(a));

  for (const href of ranked) {
    if (results.length >= limit) break;
    seenProducts.add(href);
    try {
      await page.goto(href, { waitUntil: "networkidle2" });
      const { title, image, price } = await getPageData(page, storeName, href);
      const normalizedTitle = normalize(title);
      const parsedPrice = pickPrice(price || title);
      const imageUrl = image?.startsWith("//") ? `https:${image}` : image;
      if (!normalizedTitle || !imageUrl || !parsedPrice) continue;

      results.push({
        id: crypto.randomUUID(),
        nome: normalizedTitle,
        loja: storeName,
        categoria: inferCategory(normalizedTitle, href),
        imagem: imageUrl,
        preco: parsedPrice,
        link: href,
      });
    } catch {
      continue;
    }
    await sleep(PAGE_GAP_MS);
  }
}

export async function scrapeStoreCatalog(store, { limit = DEFAULT_LIMIT_PER_STORE } = {}) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(DEFAULT_NAV_TIMEOUT_MS);
    page.setDefaultTimeout(DEFAULT_NAV_TIMEOUT_MS);

    const seenProducts = new Set();
    const results = [];
    const discoveryUrls = buildDiscoveryUrls(store.url);

    for (const discoveryUrl of discoveryUrls) {
      if (results.length >= limit) break;
      try {
        await page.goto(discoveryUrl, { waitUntil: "networkidle2" });
      } catch {
        continue;
      }

      const hrefs = await page.evaluate(() =>
        Array.from(document.querySelectorAll("a[href]")).map((a) => a.href),
      );
      const ordered = collectLinks(discoveryUrl, hrefs)
        .filter((href) => !seenProducts.has(href))
        .sort((a, b) => scoreLink(b) - scoreLink(a));

      for (const href of ordered) {
        if (results.length >= limit) break;
        if (seenProducts.has(href)) continue;

        const isCollectionish =
          /(?:category|collection|colecc|colecao|shop|loja|new|women|men|kids|sale|outlet|catalog|catalogo)/i.test(
            href,
          );

        if (isCollectionish) {
          await scrapeCollectionPage(page, href, store.name, seenProducts, results, limit);
        } else {
          seenProducts.add(href);
          try {
            await page.goto(href, { waitUntil: "networkidle2" });
            const { title, image, price } = await getPageData(page, store.name, href);
            const normalizedTitle = normalize(title);
            const parsedPrice = pickPrice(price || title);
            const imageUrl = image?.startsWith("//") ? `https:${image}` : image;
            if (!normalizedTitle || !imageUrl || !parsedPrice) continue;
            results.push({
              id: crypto.randomUUID(),
              nome: normalizedTitle,
              loja: store.name,
              categoria: inferCategory(normalizedTitle, href),
              imagem: imageUrl,
              preco: parsedPrice,
              link: href,
            });
          } catch {
            // skip
          }
          await sleep(PAGE_GAP_MS);
        }

        if (results.length >= limit) break;
        await sleep(COLLECTION_GAP_MS);
      }
    }

    return results;
  } finally {
    await browser.close();
  }
}

export async function scrapeAllStores() {
  const items = [];
  for (const store of STORES) {
    const storeItems = await scrapeStoreCatalog(store);
    items.push(...storeItems);
    await sleep(1500);
  }
  return items;
}

export { STORES };
