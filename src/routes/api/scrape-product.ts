import { createFileRoute } from "@tanstack/react-router";
import { parseHtmlForProduct } from "@/lib/product-scraper";
import { checkRateLimit, isValidUrl, sanitizeInput } from "@/lib/security";

export const Route = createFileRoute("/api/scrape-product")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Get client IP for rate limiting
        const ip =
          request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

        // Rate limiting: 10 requests per minute per IP
        const rateLimit = checkRateLimit(ip, 10, 60000);
        if (!rateLimit.allowed) {
          return Response.json(
            { error: "Muitas solicitações. Tente novamente mais tarde." },
            {
              status: 429,
              headers: {
                "Retry-After": Math.ceil((rateLimit.resetTime! - Date.now()) / 1000).toString(),
              },
            },
          );
        }

        try {
          const body = (await request.json()) as { url?: string };
          if (!body?.url) {
            return Response.json({ error: "URL em falta." }, { status: 400 });
          }

          // Sanitize and validate URL
          const sanitizedUrl = sanitizeInput(body.url);

          if (!isValidUrl(sanitizedUrl)) {
            return Response.json({ error: "URL inválida ou não permitida." }, { status: 400 });
          }

          // Additional whitelist of allowed domains (optional but recommended)
          const allowedDomains = [
            "zara.com",
            "hm.com",
            "mango.com",
            "bershka.com",
            "pullandbear.com",
            "stradivarius.com",
            "massimodutti.com",
            "oysho.com",
            "primark.com",
            "shein.com",
            "asos.com",
            "amazon.com",
            "amazon.es",
            "amazon.pt",
          ];

          try {
            const urlObj = new URL(sanitizedUrl);
            const domain = urlObj.hostname.replace("www.", "");

            // Uncomment to restrict to specific domains
            // if (!allowedDomains.some(d => domain.endsWith(d))) {
            //   return Response.json(
            //     { error: "Domínio não suportado." },
            //     { status: 400 },
            //   );
            // }
          } catch {
            return Response.json({ error: "URL inválida." }, { status: 400 });
          }

          const response = await fetch(sanitizedUrl, {
            headers: {
              "user-agent":
                "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
              accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            },
            // Add timeout to prevent hanging
            signal: AbortSignal.timeout(10000),
          });

          if (!response.ok) {
            return Response.json(
              { error: `Não foi possível abrir a página (${response.status}).` },
              { status: 400 },
            );
          }

          const html = await response.text();
          const product = await parseHtmlForProduct(sanitizedUrl, html);

          return Response.json({ product });
        } catch (error) {
          // Don't expose detailed errors to client
          console.error("Scraping error:", error);
          return Response.json({ error: "Falha ao processar a solicitação." }, { status: 500 });
        }
      },
    },
  },
});
