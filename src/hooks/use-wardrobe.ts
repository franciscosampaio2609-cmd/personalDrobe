import { useEffect, useState, useCallback } from "react";
import { type ClothingItem, type Outfit, type OutfitItemRef } from "@/lib/wardrobe-types";
import { useAuth } from "@/lib/auth";

const isBrowser = typeof window !== "undefined";

const read = <T>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback;
  try {
    const v = window.localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: unknown) => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("localStorage write failed", e);
  }
};

const itemsKey = (u: string) => `co.items.${u}.v2`;
const outfitsKey = (u: string) => `co.outfits.${u}.v2`;

/** User wardrobe — scoped to the currently logged-in user. */
export function useWardrobe() {
  const { username } = useAuth();
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!username) {
      setItems([]);
      setReady(false);
      return;
    }
    setItems(read<ClothingItem[]>(itemsKey(username), []));
    setReady(true);
  }, [username]);

  const addItem = useCallback(
    (item: Omit<ClothingItem, "id" | "source">) => {
      if (!username) return;
      setItems((prev) => {
        const next = [...prev, { ...item, id: crypto.randomUUID(), source: "wardrobe" as const }];
        write(itemsKey(username), next);
        return next;
      });
    },
    [username],
  );

  const removeItem = useCallback(
    (id: string) => {
      if (!username) return;
      setItems((prev) => {
        const next = prev.filter((i) => i.id !== id);
        write(itemsKey(username), next);
        return next;
      });
    },
    [username],
  );

  return { items, addItem, removeItem, ready };
}

export function useOutfits() {
  const { username } = useAuth();
  const [outfits, setOutfits] = useState<Outfit[]>([]);

  useEffect(() => {
    if (!username) {
      setOutfits([]);
      return;
    }
    setOutfits(read<Outfit[]>(outfitsKey(username), []));
  }, [username]);

  const addOutfit = useCallback(
    (outfit: {
      nome: string;
      items: Partial<Record<string, OutfitItemRef>>;
      coverImage?: string;
    }) => {
      if (!username) return;
      setOutfits((prev) => {
        const next = [
          {
            id: crypto.randomUUID(),
            createdAt: Date.now(),
            nome: outfit.nome,
            items: outfit.items as Outfit["items"],
            coverImage: outfit.coverImage,
          },
          ...prev,
        ];
        write(outfitsKey(username), next);
        return next;
      });
    },
    [username],
  );

  const removeOutfit = useCallback(
    (id: string) => {
      if (!username) return;
      setOutfits((prev) => {
        const next = prev.filter((o) => o.id !== id);
        write(outfitsKey(username), next);
        return next;
      });
    },
    [username],
  );

  return { outfits, addOutfit, removeOutfit };
}

/** Resolve an outfit ref to a ClothingItem from the wardrobe. */
export function resolveRef(
  ref: OutfitItemRef | undefined,
  wardrobe: ClothingItem[],
): ClothingItem | undefined {
  if (!ref) return undefined;
  return wardrobe.find((w) => w.id === ref.id);
}
