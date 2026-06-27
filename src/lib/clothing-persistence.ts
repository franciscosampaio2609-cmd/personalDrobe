import type { ClothingItem } from "@/lib/wardrobe-types";
import { supabase } from "@/lib/supabase";

const isBrowser = typeof window !== "undefined";

const readLocal = (key: string): ClothingItem[] => {
  if (!isBrowser) return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as ClothingItem[]) : [];
  } catch {
    return [];
  }
};

const writeLocal = (key: string, value: ClothingItem[]) => {
  if (!isBrowser) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export async function saveClothingItem(userId: string, item: ClothingItem) {
  const stored = readLocal("co.clipped.items.v1");
  const next = [item, ...stored];
  writeLocal("co.clipped.items.v1", next);

  if (supabase) {
    await supabase.from("clothing_items").insert({
      user_id: userId,
      nome: item.nome,
      loja: item.loja,
      categoria: item.categoria,
      imagem: item.imagem,
      preco: item.preco,
      link: item.link,
    });
  }

  return next;
}
