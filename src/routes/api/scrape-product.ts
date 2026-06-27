import { createFileRoute } from "@tanstack/react-router";
import { parseHtmlForProduct } from "@/lib/product-scraper";

export const Route = createFileRoute("/api/scrape-product")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { url?: string };
          if (!body?.url) {
            return Response.json({ error: "URL em falta." }, { status: 400 });
          }

          const response = await fetch(body.url, {
            headers: {
              "user-agent":
                "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
              accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            },
          });
          if (!response.ok) {
            return Response.json(
              { error: `Não foi possível abrir a página (${response.status}).` },
              { status: 400 },
            );
          }

          const html = await response.text();
          const product = await parseHtmlForProduct(body.url, html);

          return Response.json({ product });
        } catch (error) {
          return Response.json(
            {
              error:
                error instanceof Error ? error.message : "Falha inesperada ao extrair produto.",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
