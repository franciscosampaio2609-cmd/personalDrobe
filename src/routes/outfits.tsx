import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, X } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { useWardrobe, useOutfits, resolveRef } from "@/hooks/use-wardrobe";
import { CATEGORIAS, type Categoria, type ClothingItem, type Outfit } from "@/lib/wardrobe-types";

export const Route = createFileRoute("/outfits")({
  head: () => ({
    meta: [
      { title: "Outfits Guardados — Criador de Outfits" },
      { name: "description", content: "Os teus looks compostos." },
    ],
  }),
  component: OutfitsPage,
});

interface ResolvedPiece {
  cat: Categoria;
  item: ClothingItem;
}

function resolveOutfit(o: Outfit, wardrobe: ClothingItem[]): ResolvedPiece[] {
  return CATEGORIAS.flatMap((cat) => {
    const ref = o.items[cat];
    const item = resolveRef(ref, wardrobe);
    return item ? [{ cat, item }] : [];
  });
}

function OutfitsPage() {
  const { outfits, removeOutfit } = useOutfits();
  const { items: wardrobe } = useWardrobe();
  const [detail, setDetail] = useState<Outfit | null>(null);

  return (
    <div className="px-4 md:px-8 pt-5 md:pt-10 pb-8 max-w-6xl mx-auto">
      <header className="mb-8">
        <p className="text-[9px] tracking-[0.45em] uppercase text-muted-foreground mb-1">Coleção</p>
        <h1
          className="text-3xl md:text-4xl font-light text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Outfits Guardados
        </h1>
      </header>

      {outfits.length === 0 ? (
        <EmptyState
          title="Nenhum outfit guardado"
          description="Cria o teu primeiro look no criador e guarda-o aqui."
          buttonAction={
            <Link
              to="/criador"
              className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background text-xs uppercase tracking-[0.2em] rounded-full hover:bg-accent hover:text-white transition-base"
            >
              Criar outfit
            </Link>
          }
        />
      ) : (
        <>
          <p className="text-xs text-muted-foreground mb-5">
            {outfits.length} {outfits.length === 1 ? "outfit" : "outfits"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {outfits.map((o) => (
              <OutfitCard
                key={o.id}
                outfit={o}
                wardrobe={wardrobe}
                onRemove={() => removeOutfit(o.id)}
                onClick={() => setDetail(o)}
              />
            ))}
          </div>
        </>
      )}

      {detail && (
        <OutfitDetail outfit={detail} wardrobe={wardrobe} onClose={() => setDetail(null)} />
      )}
    </div>
  );
}

function OutfitCard({
  outfit,
  wardrobe,
  onRemove,
  onClick,
}: {
  outfit: Outfit;
  wardrobe: ClothingItem[];
  onRemove: () => void;
  onClick: () => void;
}) {
  const pieces = resolveOutfit(outfit, wardrobe);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const date = new Date(outfit.createdAt).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="group bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-base border border-border/50">
      {/* Cover: full photo OR 2×2 mosaic */}
      <button onClick={onClick} className="block w-full text-left">
        {outfit.coverImage ? (
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={outfit.coverImage}
              alt={outfit.nome}
              className="h-full w-full object-cover transition-base group-hover:scale-[1.03]"
              loading="lazy"
            />
            {/* subtle photo indicator */}
            <div className="absolute bottom-2.5 right-2.5">
              <span className="px-2 py-0.5 bg-white/80 backdrop-blur rounded-full text-[9px] tracking-wide text-foreground/70 uppercase">
                foto
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 aspect-square">
            {Array.from({ length: 4 }).map((_, idx) => {
              const piece = pieces[idx];
              return (
                <div
                  key={idx}
                  className="relative overflow-hidden bg-muted [&:nth-child(odd)]:border-r [&:nth-child(-n+2)]:border-b border-white/40"
                >
                  {piece ? (
                    <img
                      src={piece.item.imagem}
                      alt={piece.item.nome}
                      className="h-full w-full object-cover transition-base group-hover:scale-[1.04]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground/20 text-lg">
                      —
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </button>

      <div className="p-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1" onClick={onClick}>
          <h3
            className="text-lg font-light text-foreground truncate"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {outfit.nome}
          </h3>
          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">
            {pieces.length} {pieces.length === 1 ? "peça" : "peças"} · {date}
          </p>
        </div>
        {confirmDelete ? (
          <div className="flex gap-1.5 shrink-0">
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-2.5 py-1.5 text-[10px] uppercase tracking-wide border border-border rounded-full text-foreground hover:bg-muted transition-base"
            >
              Não
            </button>
            <button
              onClick={onRemove}
              className="px-2.5 py-1.5 text-[10px] uppercase tracking-wide bg-destructive text-white rounded-full transition-base"
            >
              Remover
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="h-8 w-8 shrink-0 flex items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-muted transition-base"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        )}
      </div>
    </article>
  );
}

function OutfitDetail({
  outfit,
  wardrobe,
  onClose,
}: {
  outfit: Outfit;
  wardrobe: ClothingItem[];
  onClose: () => void;
}) {
  const pieces = resolveOutfit(outfit, wardrobe);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-end md:items-center justify-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card w-full md:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl md:rounded-2xl border border-border/50 card-shadow"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 sticky top-0 bg-card z-10">
          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-muted-foreground">Outfit</p>
            <h2 className="text-xl font-light mt-0.5" style={{ fontFamily: "var(--font-display)" }}>
              {outfit.nome}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-muted transition-base text-muted-foreground"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="p-5 space-y-3">
          {pieces.map((p) => (
            <div
              key={`${p.cat}-${p.item.id}`}
              className="flex items-center gap-4 p-3 bg-background rounded-xl"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                <img src={p.item.imagem} alt={p.item.nome} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] tracking-[0.25em] uppercase text-accent">{p.cat}</p>
                <p className="text-sm font-medium text-foreground truncate mt-0.5">{p.item.nome}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{p.item.loja}</p>
              </div>
            </div>
          ))}
          {pieces.length === 0 && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              As peças deste outfit foram removidas do roupeiro.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
