import { useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";

export function AuthGate({ children }: { children: ReactNode }) {
  const { username, ready, login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState<string | null>(null);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground animate-pulse">
          A carregar…
        </div>
      </div>
    );
  }

  if (username) return <>{children}</>;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = mode === "login" ? login(u, p) : register(u, p);
    setErr(error);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      {/* Brand */}
      <div className="text-center mb-12">
        <p className="text-[9px] tracking-[0.5em] uppercase text-muted-foreground mb-3">
          Bem-vinda ao
        </p>
        <h1
          className="text-5xl font-light text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Criador de Outfits
        </h1>
        <div className="mt-4 mx-auto w-12 h-px bg-accent" />
      </div>

      {/* Card */}
      <div className="w-full max-w-sm">
        {/* Mode tabs */}
        <div className="flex mb-8 border-b border-border">
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setErr(null);
              }}
              className={`flex-1 pb-3 text-xs uppercase tracking-[0.25em] transition-base relative ${
                mode === m ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "login" ? "Entrar" : "Registar"}
              {mode === m && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-5">
          <label className="block">
            <span className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2.5">
              Nome de utilizador
            </span>
            <input
              value={u}
              onChange={(e) => setU(e.target.value)}
              autoComplete="username"
              className="w-full bg-card border border-border px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent transition-base rounded-xl"
              placeholder="ex.: ana"
            />
          </label>

          <label className="block">
            <span className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2.5">
              Palavra-passe
            </span>
            <input
              type="password"
              value={p}
              onChange={(e) => setP(e.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="w-full bg-card border border-border px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent transition-base rounded-xl"
              placeholder="••••••••"
            />
          </label>

          {err && (
            <p className="text-xs text-destructive bg-destructive/8 border border-destructive/20 px-4 py-3 rounded-lg">
              {err}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-4 text-xs uppercase tracking-[0.3em] bg-foreground text-background hover:bg-accent hover:text-white transition-base rounded-xl font-medium"
          >
            {mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <p className="text-[10px] text-muted-foreground text-center mt-8 leading-relaxed">
          Os teus dados ficam guardados localmente neste dispositivo.
        </p>
      </div>
    </div>
  );
}
