"use client";

// Estados de tela e a moldura de painel do portal.
// Nada de tela branca: carregando, erro (com "tentar de novo") e vazio têm
// texto que um cliente entende.

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Painel do portal: card de vidro com o filete de gradiente da marca no topo. */
export function Panel({
  children,
  className = "",
  accent = false,
}: {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
}) {
  return (
    <section
      className={`relative isolate overflow-hidden rounded-2xl border bg-card/70 shadow-[0_30px_80px_-40px_rgb(0_0_0/0.6)] backdrop-blur-xl ${className}`}
    >
      {accent && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[var(--brand-from)] via-[var(--brand-via)] to-[var(--brand-to)]"
        />
      )}
      {children}
    </section>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
      {children}
    </h2>
  );
}

export function Loading({ label = "Carregando" }: { label?: string }) {
  return (
    <div
      className="flex items-center gap-3 py-16 text-muted-foreground"
      role="status"
      aria-live="polite"
    >
      <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--brand-via)]" />
      <span className="font-mono text-xs uppercase tracking-[0.2em]">
        {label}…
      </span>
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <Panel className="p-8 text-center">
      <AlertTriangle className="mx-auto h-6 w-6 text-destructive" />
      <p className="mt-3 text-sm text-foreground/90">{message}</p>
      <Button
        variant="outline"
        size="sm"
        className="mt-5 rounded-full bg-card/60 backdrop-blur"
        onClick={onRetry}
      >
        <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
        Tentar de novo
      </Button>
    </Panel>
  );
}

export function EmptyState({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <Panel className="p-8 text-center" accent>
      <p className="font-[family-name:var(--font-caveat)] text-lg text-muted-foreground/80">
        {"// por enquanto, nada aqui"}
      </p>
      <h2 className="mt-1 text-xl font-bold tracking-tight">{title}</h2>
      {children && (
        <div className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {children}
        </div>
      )}
    </Panel>
  );
}
