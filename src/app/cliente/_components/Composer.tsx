"use client";

// "Precisa de algo?" — a segunda (e última) ação do cliente.
// Vira project_events(type='comment', actor='client'): entra na timeline dele e
// cai na aba Pedidos do Monitor.

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Panel, SectionTitle } from "./States";

export function Composer({
  onSend,
}: {
  onSend: (text: string) => Promise<{ ok: true } | { ok: false; message: string }>;
}) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const body = text.trim();
    if (!body || busy) return;
    setBusy(true);
    setErr("");
    const res = await onSend(body);
    setBusy(false);
    if (!res.ok) {
      setErr(res.message);
      return;
    }
    setText("");
    setSent(true);
    window.setTimeout(() => setSent(false), 4000);
  }

  return (
    <Panel className="p-6 sm:p-8">
      <SectionTitle>Precisa de algo?</SectionTitle>
      <p className="mt-2 text-sm text-muted-foreground">
        Escreva aqui. Cai direto comigo e entra no acompanhamento acima.
      </p>

      <form onSubmit={submit} className="mt-4 space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(e);
          }}
          rows={3}
          placeholder="Ex.: dá pra deixar o botão de comprar em verde?"
          className="w-full resize-none rounded-xl border border-border/70 bg-background/60 px-3.5 py-3 text-sm outline-none backdrop-blur transition placeholder:text-muted-foreground/60 focus:border-[var(--brand-via)] focus:ring-2 focus:ring-[var(--brand-via)]/25"
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span
            className={`font-mono text-[10px] uppercase tracking-[0.16em] transition-opacity ${
              sent ? "text-emerald-500 opacity-100" : "opacity-0"
            }`}
            aria-live="polite"
          >
            enviado ✓
          </span>
          <button
            type="submit"
            disabled={busy || !text.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--brand-from)] via-[var(--brand-via)] to-[var(--brand-to)] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {busy ? "Enviando…" : "Enviar"}
          </button>
        </div>

        {err && (
          <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {err}
          </p>
        )}
      </form>
    </Panel>
  );
}
