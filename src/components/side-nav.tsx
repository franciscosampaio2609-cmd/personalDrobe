import { Link, useRouterState } from "@tanstack/react-router";
import { Shirt, Sparkles, Bookmark, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";

const links = [
  { to: "/roupeiro", label: "Roupeiro", icon: Shirt },
  { to: "/criador", label: "Criador", icon: Sparkles },
  { to: "/outfits", label: "Outfits", icon: Bookmark },
];

export function SideNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { username, logout } = useAuth();

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────── */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-sidebar border-r border-sidebar-border z-30">
        <div className="px-8 py-8 border-b border-sidebar-border">
          <p className="text-[10px] tracking-[0.35em] uppercase text-muted-foreground mb-1">
            Criador de
          </p>
          <h1
            className="text-2xl font-light tracking-wide text-sidebar-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Outfits
          </h1>
        </div>

        <nav className="flex-1 px-5 py-7 space-y-0.5">
          {links.map(({ to, label, icon: Icon }) => {
            const active = pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm transition-base ${
                  active
                    ? "bg-sidebar-accent text-sidebar-foreground font-medium"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${active ? "text-accent" : ""}`}
                  strokeWidth={active ? 2 : 1.5}
                />
                <span>{label}</span>
                {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />}
              </Link>
            );
          })}
        </nav>

        {username && (
          <div className="px-5 py-5 border-t border-sidebar-border">
            <div className="flex items-center gap-3 px-4 mb-2">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                <span className="text-xs font-semibold text-accent uppercase">{username[0]}</span>
              </div>
              <p className="text-sm font-medium truncate">{username}</p>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-muted-foreground hover:text-destructive hover:bg-sidebar-accent/60 transition-base"
            >
              <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
              Terminar sessão
            </button>
          </div>
        )}
      </aside>

      {/* ── Mobile top bar ───────────────────────────────────── */}
      <header className="md:hidden fixed top-0 inset-x-0 z-30 bg-sidebar/95 backdrop-blur-md border-b border-sidebar-border flex items-center justify-between px-5 h-14">
        <h1
          className="text-lg font-light tracking-wide"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Outfits
        </h1>
        {username && (
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground"
          >
            <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
            Sair
          </button>
        )}
      </header>

      {/* ── Mobile bottom nav ────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-sidebar/95 backdrop-blur-md border-t border-sidebar-border pb-[env(safe-area-inset-bottom)]">
        <div className="flex">
          {links.map(({ to, label, icon: Icon }) => {
            const active = pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-base ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-base ${active ? "text-accent" : ""}`}
                  strokeWidth={active ? 2 : 1.5}
                />
                <span
                  className={`text-[10px] tracking-wide font-medium ${active ? "text-accent" : ""}`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
