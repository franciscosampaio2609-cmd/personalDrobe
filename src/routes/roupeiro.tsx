import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Plus, Trash2, X, Camera, Upload } from "lucide-react";
import { useWardrobe } from "@/hooks/use-wardrobe";
import { useFilter } from "@/hooks/use-filter";
import { EmptyState } from "@/components/empty-state";
import { FilterBar } from "@/components/filter-bar";
import { CATEGORIAS, type Categoria, type ClothingItem } from "@/lib/wardrobe-types";

export const Route = createFileRoute("/roupeiro")({
  head: () => ({
    meta: [
      { title: "O Meu Roupeiro — Criador de Outfits" },
      { name: "description", content: "Gere as peças do teu roupeiro pessoal." },
    ],
  }),
  component: RoupeiroPage,
});

function RoupeiroPage() {
  const { items, removeItem, addItem } = useWardrobe();
  const [open, setOpen] = useState(false);
  const { filteredItems, category, setCategory, searchTerm, setSearchTerm } = useFilter(items);

  return (
    <div className="px-4 md:px-8 pt-5 md:pt-10 pb-8 max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[9px] tracking-[0.45em] uppercase text-muted-foreground mb-1">
            Coleção pessoal
          </p>
          <h1
            className="text-3xl md:text-4xl font-light text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            O Meu Roupeiro
          </h1>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-xs uppercase tracking-[0.2em] rounded-full hover:bg-accent hover:text-white transition-base shrink-0"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          <span className="hidden sm:inline">Nova peça</span>
          <span className="sm:hidden">Adicionar</span>
        </button>
      </header>

      {/* Filters */}
      <div className="mb-6">
        <FilterBar
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          category={category}
          onCategoryChange={setCategory}
        />
      </div>

      {/* Count */}
      {filteredItems.length > 0 && (
        <p className="text-xs text-muted-foreground mb-4">
          {filteredItems.length} {filteredItems.length === 1 ? "peça" : "peças"}
        </p>
      )}

      {filteredItems.length === 0 ? (
        <EmptyState
          title="O teu roupeiro está vazio"
          description="Adiciona as tuas peças favoritas para começar a montar looks incríveis."
          buttonAction={
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background text-xs uppercase tracking-[0.2em] rounded-full hover:bg-accent hover:text-white transition-base"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
              Adicionar peça
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} onRemove={() => removeItem(item.id)} />
          ))}
        </div>
      )}

      {open && (
        <AddItemDialog
          onClose={() => setOpen(false)}
          onSubmit={(data) => {
            addItem(data);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

function ItemCard({ item, onRemove }: { item: ClothingItem; onRemove: () => void }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="group bg-card rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-base border border-border/50">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={item.imagem}
          alt={item.nome}
          className="h-full w-full object-cover transition-base group-hover:scale-[1.03]"
          loading="lazy"
        />
        {/* Delete overlay */}
        {confirmDelete ? (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4">
            <p className="text-xs text-center text-foreground font-medium">Remover esta peça?</p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 text-[10px] uppercase tracking-wide border border-border rounded-full text-foreground hover:bg-muted transition-base"
              >
                Não
              </button>
              <button
                onClick={onRemove}
                className="px-4 py-2 text-[10px] uppercase tracking-wide bg-destructive text-white rounded-full transition-base"
              >
                Remover
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="absolute top-2.5 right-2.5 h-8 w-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 md:opacity-0 transition-base hover:bg-destructive hover:text-white active:bg-destructive active:text-white
              not-md:opacity-100"
            aria-label="Remover"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        )}

        {/* Category badge */}
        <div className="absolute bottom-2 left-2">
          <span className="px-2 py-0.5 bg-white/85 backdrop-blur rounded-full text-[9px] tracking-wide text-foreground/80">
            {item.categoria}
          </span>
        </div>
      </div>

      <div className="p-3">
        <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground truncate">
          {item.loja}
        </p>
        <h3 className="text-sm font-medium text-foreground truncate mt-0.5">{item.nome}</h3>
      </div>
    </div>
  );
}

function AddItemDialog({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: Omit<ClothingItem, "id" | "source">) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [imagem, setImagem] = useState("");
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState<Categoria>("Partes de Cima");
  const [link, setLink] = useState("");

  const handleFile = (f: File | undefined) => {
    if (!f) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = img.width;
        let height = img.height;
        const maxDimension = 1920;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.9;
        let dataUrl = canvas.toDataURL("image/jpeg", quality);

        while (dataUrl.length > 2_000_000 && quality > 0.1) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }

        setImagem(dataUrl);
      };
      img.src = String(e.target?.result ?? "");
    };
    reader.readAsDataURL(f);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !imagem) return;
    onSubmit({
      nome: nome.trim(),
      loja: "Pessoal",
      categoria,
      imagem,
      preco: 0,
      link: link.trim(),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-end md:items-center justify-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card w-full md:max-w-md max-h-[92vh] overflow-y-auto rounded-t-3xl md:rounded-2xl border border-border/50 card-shadow"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 sticky top-0 bg-card z-10">
          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-muted-foreground">Nova peça</p>
            <h2 className="text-xl font-light mt-0.5" style={{ fontFamily: "var(--font-display)" }}>
              Adicionar ao roupeiro
            </h2>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-muted transition-base text-muted-foreground"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-5">
          {/* Image */}
          <div>
            <span className="block text-[9px] tracking-[0.35em] uppercase text-muted-foreground mb-3">
              Fotografia
            </span>
            {imagem ? (
              <div className="relative aspect-[3/4] max-h-64 bg-muted rounded-xl overflow-hidden">
                <img src={imagem} alt="preview" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImagem("")}
                  className="absolute top-2 right-2 h-8 w-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-destructive hover:text-white transition-base"
                >
                  <X className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => cameraRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2.5 py-8 border-2 border-dashed border-border rounded-xl hover:border-accent hover:text-accent active:border-accent active:text-accent transition-base text-muted-foreground"
                >
                  <Camera className="h-6 w-6" strokeWidth={1.25} />
                  <span className="text-[10px] tracking-wide uppercase">Câmara</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2.5 py-8 border-2 border-dashed border-border rounded-xl hover:border-accent hover:text-accent active:border-accent active:text-accent transition-base text-muted-foreground"
                >
                  <Upload className="h-6 w-6" strokeWidth={1.25} />
                  <span className="text-[10px] tracking-wide uppercase">Upload</span>
                </button>
                <input
                  ref={cameraRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
              </div>
            )}
          </div>

          {/* Name */}
          <label className="block">
            <span className="block text-[9px] tracking-[0.35em] uppercase text-muted-foreground mb-2.5">
              Nome da peça
            </span>
            <input
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent transition-base"
              placeholder="Ex.: Camisola favorita"
            />
          </label>

          {/* Category */}
          <label className="block">
            <span className="block text-[9px] tracking-[0.35em] uppercase text-muted-foreground mb-2.5">
              Categoria
            </span>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as Categoria)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:border-accent transition-base"
            >
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          {/* Link */}
          <label className="block">
            <span className="block text-[9px] tracking-[0.35em] uppercase text-muted-foreground mb-2.5">
              Link do produto (opcional)
            </span>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent transition-base"
              placeholder="https://..."
            />
          </label>

          {/* Actions */}
          <div className="flex gap-3 pt-1 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 text-xs uppercase tracking-[0.2em] border border-border rounded-xl text-foreground hover:bg-muted active:bg-muted transition-base"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!nome.trim() || !imagem}
              className="flex-1 py-3.5 text-xs uppercase tracking-[0.2em] bg-foreground text-background rounded-xl hover:bg-accent hover:text-white active:opacity-90 transition-base disabled:opacity-30"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
