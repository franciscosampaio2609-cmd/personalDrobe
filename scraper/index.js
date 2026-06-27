import { stores } from "./stores.js";

const MIN_REQUEST_GAP_MS = 1200;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function run() {
  const results = [];

  for (const store of stores) {
    try {
      const item = await store.scrape({ url: store.url, delayMs: MIN_REQUEST_GAP_MS });
      results.push({
        store: store.name,
        ok: true,
        item,
      });
      console.log(`[ok] ${store.name}`);
    } catch (error) {
      results.push({
        store: store.name,
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      });
      console.warn(`[skip] ${store.name}:`, error instanceof Error ? error.message : error);
    }

    await sleep(MIN_REQUEST_GAP_MS);
  }

  console.log(JSON.stringify({ total: results.length, results }, null, 2));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
