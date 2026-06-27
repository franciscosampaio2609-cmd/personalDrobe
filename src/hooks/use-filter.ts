import { useMemo, useState } from "react";
import type { Categoria, ClothingItem } from "@/lib/wardrobe-types";

type FilterableItem = ClothingItem;

export function useFilter<T extends FilterableItem>(items: T[]) {
  const [category, setCategory] = useState<Categoria | "Todas">("Todas");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCategory = category === "Todas" || item.categoria === category;
      const matchesSearch =
        !term || item.nome.toLowerCase().includes(term) || item.loja.toLowerCase().includes(term);

      return matchesCategory && matchesSearch;
    });
  }, [items, category, searchTerm]);

  return {
    filteredItems,
    category,
    setCategory,
    searchTerm,
    setSearchTerm,
  };
}
