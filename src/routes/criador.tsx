import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  Shirt,
  Sparkles,
  Footprints,
  Save,
  X,
  Watch,
  List,
  LayoutGrid,
  Camera,
  Upload,
  ImagePlus,
} from "lucide-react";
import { useWardrobe, useOutfits, resolveRef } from "@/hooks/use-wardrobe";
import {
  CATEGORIAS,
  type Categoria,
  type ClothingItem,
  type OutfitItemRef,
} from "@/lib/wardrobe-types";

export const Route = createFileRoute("/criador")({
  head: () => ({
    meta: [
      { title: "Criador — Criador de Outfits" },
      { name: "description", content: "Combina peças e cria o teu look." },
    ],
  }),
  component: CriadorPage,
});

const SLOT_META: Record<Categoria, { label: string; icon: typeof Shirt }> = {
  Acessórios: { label: "Acessório", icon: Watch },
  "Partes de Cima": { label: "Parte de Cima", icon: Shirt },
  "Partes de Baixo": { label: "Parte de Baixo", icon: Sparkles },
  Calçado: { label: "Calçado", icon: Footprints },
};

type MobileTab = "canvas" | "picker";

function CriadorPage() {
  const { items: wardrobe } = useWardrobe();
  const { addOutfit } = useOutfits();
  const [slots, setSlots] = useState<Partial<Record<Categoria, OutfitItemRef>>>({});
  const [catFilter, setCatFilter] = useState<Categoria | "Todas">("Todas");
  const [saving, setSaving] = useState(false);
  const [outfitName, setOutfitName] = useState("");
  const [coverImage, setCoverImage] = useState<string>("");
  const [mobileTab, setMobileTab] = useState<MobileTab>("picker");

  const handlePickItem = (item: ClothingItem) => {
    setSlots((s) => ({ ...s, [item.categoria]: { id: item.id, source: item.source } }));
    setMobileTab("canvas");
  };

  const handleClearSlot = (cat: Categoria) => {
    setSlots((s) => {
      const n = { ...s };
      delete n[cat];
      return n;
    });
  };

  const hasItems = Object.keys(slots).length > 0;
  const slotsCount = Object.keys(slots).length;

  const handleSave = () => {
    if (!outfitName.trim()) return;
    addOutfit({ nome: outfitName.trim(), items: slots, coverImage: coverImage || undefined });
    setSlots({});
    setOutfitName("");
    setCoverImage("");
    setSaving(false);
  };

  const filteredCloset = useMemo(
    () => (catFilter === "Todas" ? wardrobe : wardrobe.filter((i) => i.categoria === catFilter)),
    [wardrobe, catFilter],
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <header className="px-4 md:px-8 pt-5 md:pt-10 pb-4 md:pb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[9px] tracking-[0.45em] uppercase text-muted-foreground mb-1">
            Compor o look
          </p>
          <h1
            className="text-3xl md:text-4xl font-light text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Criador
          </h1>
        </div>
        {/* Mobile tab toggle */}
        <div className="flex md:hidden bg-card border border-border rounded-full overflow-hidden p-1 gap-1">
          <button
            onClick={() => setMobileTab("picker")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wide transition-base ${
              mobileTab === "picker" ? "bg-foreground text-background" : "text-muted-foreground"
            }`}
          >
            <List className="h-3 w-3" />
            Peças
          </button>
          <button
            onClick={() => setMobileTab("canvas")}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wide transition-base ${
              mobileTab === "canvas" ? "bg-foreground text-background" : "text-muted-foreground"
            }`}
          >
            <LayoutGrid className="h-3 w-3" />
            Outfit
            {slotsCount > 0 && (
              <span className="ml-0.5 w-4 h-4 rounded-full bg-accent text-white text-[9px] flex items-center justify-center font-semibold">
                {slotsCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Desktop: side-by-side */}
      <div className="hidden md:grid md:grid-cols-[1fr_1.3fr] gap-8 px-8 pb-10">
        <CanvasSection
          slots={slots}
          wardrobe={wardrobe}
          hasItems={hasItems}
          onClear={() => setSlots({})}
          onClearSlot={handleClearSlot}
          onSave={() => setSaving(true)}
        />
        <PickerSection
          catFilter={catFilter}
          setCatFilter={setCatFilter}
          filteredCloset={filteredCloset}
          slots={slots}
          onPick={handlePickItem}
        />
      </div>

      {/* Mobile: tabs */}
      <div className="md:hidden px-4 pb-6">
        {mobileTab === "canvas" ? (
          <CanvasSection
            slots={slots}
            wardrobe={wardrobe}
            hasItems={hasItems}
            onClear={() => setSlots({})}
            onClearSlot={handleClearSlot}
            onSave={() => setSaving(true)}
          />
        ) : (
          <PickerSection
            catFilter={catFilter}
            setCatFilter={setCatFilter}
            filteredCloset={filteredCloset}
            slots={slots}
            onPick={handlePickItem}
          />
        )}
      </div>

      {/* Save modal */}
      {saving && (
        <SaveOutfitDialog
          outfitName={outfitName}
          setOutfitName={setOutfitName}
          coverImage={coverImage}
          setCoverImage={setCoverImage}
          onSave={handleSave}
          onClose={() => setSaving(false)}
        />
      )}
    </div>
  );
}

function CanvasSection({
  slots,
  wardrobe,
  hasItems,
  onClear,
  onClearSlot,
  onSave,
}: {
  slots: Partial<Record<Categoria, OutfitItemRef>>;
  wardrobe: ClothingItem[];
  hasItems: boolean;
  onClear: () => void;
  onClearSlot: (cat: Categoria) => void;
  onSave: () => void;
}) {
  return (
    <section className="md:sticky md:top-6 md:self-start">
      <div className="bg-card rounded-2xl border border-border/50 card-shadow p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[9px] tracking-[0.4em] uppercase text-muted-foreground">
            A tua tela
          </h2>
          {hasItems && (
            <button
              onClick={onClear}
              className="text-[10px] text-muted-foreground hover:text-destructive transition-base uppercase tracking-wide"
            >
              Limpar
            </button>
          )}
        </div>
        <div className="space-y-2">
          {CATEGORIAS.map((cat) => {
            const item = resolveRef(slots[cat], wardrobe);
            const Meta = SLOT_META[cat];
            return (
              <Slot
                key={cat}
                label={Meta.label}
                Icon={Meta.icon}
                item={item}
                onClear={() => onClearSlot(cat)}
              />
            );
          })}
        </div>
        <button
          onClick={onSave}
          disabled={!hasItems}
          className="mt-5 w-full py-4 text-xs uppercase tracking-[0.25em] bg-foreground text-background rounded-xl hover:bg-accent hover:text-white transition-base disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Save className="h-4 w-4" strokeWidth={1.5} />
          Guardar Outfit
        </button>
      </div>
    </section>
  );
}

function PickerSection({
  catFilter,
  setCatFilter,
  filteredCloset,
  slots,
  onPick,
}: {
  catFilter: Categoria | "Todas";
  setCatFilter: (c: Categoria | "Todas") => void;
  filteredCloset: ClothingItem[];
  slots: Partial<Record<Categoria, OutfitItemRef>>;
  onPick: (item: ClothingItem) => void;
}) {
  return (
    <section>
      {/* Category filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-0.5 scrollbar-hide">
        {(["Todas", ...CATEGORIAS] as (Categoria | "Todas")[]).map((c) => (
          <button
            key={c}
            onClick={() => setCatFilter(c)}
            className={`shrink-0 h-9 px-4 rounded-full text-xs tracking-wide transition-base border ${
              catFilter === c
                ? "bg-foreground text-background border-foreground"
                : "bg-card text-muted-foreground border-border hover:border-foreground hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {filteredCloset.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm text-muted-foreground">Roupeiro vazio nesta categoria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:max-h-[70vh] md:overflow-y-auto md:pr-1 scrollbar-hide">
          {filteredCloset.map((item) => {
            const slot = slots[item.categoria];
            const isSelected = slot?.id === item.id && slot?.source === item.source;
            return (
              <button
                key={item.id}
                onClick={() => onPick(item)}
                className={`group text-left bg-card rounded-xl overflow-hidden border transition-base ${
                  isSelected
                    ? "border-accent ring-2 ring-accent/30"
                    : "border-border/50 hover:border-accent/50"
                } card-shadow`}
              >
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={item.imagem}
                    alt={item.nome}
                    className="h-full w-full object-cover transition-base group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-accent/15 flex items-center justify-center">
                      <div className="w-7 h-7 rounded-full bg-accent shadow-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="text-[9px] tracking-wide uppercase text-muted-foreground truncate">
                    {item.loja}
                  </p>
                  <p className="text-xs font-medium text-foreground truncate mt-0.5">{item.nome}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

function Slot({
  label,
  Icon,
  item,
  onClear,
}: {
  label: string;
  Icon: typeof Shirt;
  item?: ClothingItem;
  onClear: () => void;
}) {
  return (
    <div
      className={`rounded-xl border transition-base ${item ? "border-accent/40 bg-accent/5" : "border-dashed border-border bg-background/60"}`}
    >
      {item ? (
        <div className="flex items-center gap-3 p-2.5">
          <div className="h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-muted">
            <img src={item.imagem} alt={item.nome} className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] tracking-[0.2em] uppercase text-accent">{label}</p>
            <p className="text-sm font-medium text-foreground truncate mt-0.5">{item.nome}</p>
            <p className="text-xs text-muted-foreground">{item.loja}</p>
          </div>
          <button
            onClick={onClear}
            className="h-8 w-8 shrink-0 flex items-center justify-center rounded-full text-muted-foreground hover:text-destructive hover:bg-muted transition-base"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4">
          <div className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center bg-muted text-muted-foreground/40">
            <Icon className="h-4 w-4" strokeWidth={1.25} />
          </div>
          <p className="text-sm text-muted-foreground/70">{label}</p>
        </div>
      )}
    </div>
  );
}

function SaveOutfitDialog({
  outfitName,
  setOutfitName,
  coverImage,
  setCoverImage,
  onSave,
  onClose,
}: {
  outfitName: string;
  setOutfitName: (v: string) => void;
  coverImage: string;
  setCoverImage: (v: string) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File | undefined) => {
    if (!f) return;
    if (f.size > 5_000_000) {
      alert("Imagem demasiado grande (máx. 5MB).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setCoverImage(String(e.target?.result ?? ""));
    reader.readAsDataURL(f);
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
            <p className="text-[9px] tracking-[0.4em] uppercase text-muted-foreground">Guardar</p>
            <h3 className="text-xl font-light mt-0.5" style={{ fontFamily: "var(--font-display)" }}>
              Finalizar outfit
            </h3>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-muted transition-base text-muted-foreground"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Name */}
          <label className="block">
            <span className="block text-[9px] tracking-[0.35em] uppercase text-muted-foreground mb-2.5">
              Nome do outfit
            </span>
            <input
              autoFocus
              value={outfitName}
              onChange={(e) => setOutfitName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSave()}
              placeholder="Ex.: Café com amigas"
              className="w-full bg-background border border-border rounded-xl px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent transition-base"
            />
          </label>

          {/* Cover photo */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[9px] tracking-[0.35em] uppercase text-muted-foreground">
                Foto de capa
              </span>
              <span className="text-[9px] text-muted-foreground/60 uppercase tracking-wide">
                Opcional
              </span>
            </div>

            {coverImage ? (
              <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-muted">
                <img src={coverImage} alt="capa" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setCoverImage("")}
                  className="absolute top-2.5 right-2.5 h-8 w-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-destructive hover:text-white transition-base shadow"
                >
                  <X className="h-4 w-4" strokeWidth={1.5} />
                </button>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent px-4 py-3">
                  <p className="text-[10px] text-white/80 uppercase tracking-wide">
                    Foto de capa definida
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => cameraRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2.5 py-7 border-2 border-dashed border-border rounded-xl hover:border-accent hover:text-accent active:border-accent active:text-accent transition-base text-muted-foreground bg-background"
                >
                  <Camera className="h-6 w-6" strokeWidth={1.25} />
                  <span className="text-[10px] tracking-wide uppercase">Câmara</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2.5 py-7 border-2 border-dashed border-border rounded-xl hover:border-accent hover:text-accent active:border-accent active:text-accent transition-base text-muted-foreground bg-background"
                >
                  <ImagePlus className="h-6 w-6" strokeWidth={1.25} />
                  <span className="text-[10px] tracking-wide uppercase">Galeria</span>
                </button>
              </div>
            )}

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

          {/* Action */}
          <div className="flex gap-3 pt-1 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 text-xs uppercase tracking-[0.2em] border border-border rounded-xl text-foreground hover:bg-muted transition-base"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={!outfitName.trim()}
              className="flex-1 py-3.5 text-xs uppercase tracking-[0.2em] bg-foreground text-background rounded-xl hover:bg-accent hover:text-white transition-base disabled:opacity-30 flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" strokeWidth={1.5} />
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
