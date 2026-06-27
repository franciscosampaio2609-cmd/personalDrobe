import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  buttonAction: ReactNode;
};

export function EmptyState({ title, description, buttonAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {/* Decorative icon circle */}
      <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-6">
        <div className="w-6 h-6 rounded-full bg-accent/30" />
      </div>
      <h2
        className="text-2xl font-light text-foreground mb-3"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-8">{description}</p>
      {buttonAction}
    </div>
  );
}
