import { z } from "zod";
import type { Categoria } from "@/lib/wardrobe-types";

const CategorySchema = z.enum(["Partes de Cima", "Partes de Baixo", "Calçado", "Acessórios"]);

export const ClippedProductSchema = z.object({
  title: z.string().min(1, "title is required"),
  price: z.number().finite("price must be a valid number"),
  url: z.string().url("url must be a valid URL"),
  category: CategorySchema,
});

export type ClippedProductInput = z.input<typeof ClippedProductSchema>;
export type ClippedProduct = z.infer<typeof ClippedProductSchema>;

export function validateClippedProduct(raw: unknown): {
  data?: ClippedProduct;
  error?: string;
} {
  const result = ClippedProductSchema.safeParse(raw);
  if (result.success) {
    return { data: result.data };
  }

  const issue = result.error.issues[0];
  const field = issue?.path[0];
  return {
    error: `${String(field ?? "data")}: ${issue?.message ?? "invalid value"}`,
  };
}

export function sanitizeClippedProduct(raw: unknown): {
  data?: ClippedProduct;
  error?: string;
} {
  const parsed = typeof raw === "object" && raw !== null ? raw : {};
  const normalized = {
    ...parsed,
    title:
      typeof (parsed as { title?: unknown }).title === "string"
        ? (parsed as { title: string }).title.trim()
        : "",
    price:
      typeof (parsed as { price?: unknown }).price === "string"
        ? Number((parsed as { price: string }).price.replace(/[^\d,.-]/g, "").replace(",", "."))
        : (parsed as { price?: unknown }).price,
    url:
      typeof (parsed as { url?: unknown }).url === "string"
        ? (parsed as { url: string }).url.trim()
        : "",
    category:
      typeof (parsed as { category?: unknown }).category === "string"
        ? ((parsed as { category: Categoria }).category as Categoria)
        : undefined,
  };

  return validateClippedProduct(normalized);
}
