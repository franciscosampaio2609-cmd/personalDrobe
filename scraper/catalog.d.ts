import type { CatalogItem } from "../src/lib/wardrobe-types";

export type StoreDefinition = {
  name: string;
  url: string;
};

export declare const STORES: StoreDefinition[];
export declare function scrapeStoreCatalog(
  store: StoreDefinition,
  options?: { limit?: number },
): Promise<CatalogItem[]>;
export declare function scrapeAllStores(): Promise<CatalogItem[]>;
