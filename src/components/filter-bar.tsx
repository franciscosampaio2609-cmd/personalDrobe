import { Search, X } from "lucide-react";
import type { Categoria } from "@/lib/wardrobe-types";
import { CATEGORIAS } from "@/lib/wardrobe-types";

type FilterBarProps = {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  category: Categoria | "Todas";
  onCategoryChange: (value: Categoria | "Todas") => void;
};

export function FilterBar({
  searchTerm,
  onSearchTermChange,
  category,
  onCategoryChange,
}: FilterBarProps) {
  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60"
          strokeWidth={1.5}
        />
        <input
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          placeholder="Pesquisar peças…"
          className="w-full h-12 bg-card border border-border rounded-xl pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent transition-base"
          inputMode="search"
          autoCapitalize="none"
          autoCorrect="off"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchTermChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Category pills — horizontally scrollable */}
      <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
        {(["Todas", ...CATEGORIAS] as (Categoria | "Todas")[]).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onCategoryChange(c)}
            className={`shrink-0 h-9 px-4 rounded-full text-xs tracking-wide transition-base border ${
              category === c
                ? "bg-foreground text-background border-foreground"
                : "bg-card text-muted-foreground border-border hover:border-foreground hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
