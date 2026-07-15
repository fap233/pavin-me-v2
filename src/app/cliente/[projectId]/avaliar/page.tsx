"use client";

// Fim de projeto → avaliação. O último passo do portal: o cliente dá uma nota
// (estrelas) e escreve umas linhas. A avaliação nasce `status='pending'` e NÃO
// vai pra lugar nenhum público até o Fellipe aprovar no Monitor — a tela deixa
// isso claro no sucesso ("vai ser publicada após revisão").
//
// Acesso: SÓ o cliente logado DESTE projeto. Reusa loadPortal(), que confere o
// vínculo em project_members e devolve "not_found" (mesma tela) pra projeto
// inexistente OU de outro cliente — nada vaza na diferença. Funciona no mock
// (?mock=1) igual ao resto do portal.

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Loader2, Send, Star } from "lucide-react";
import type { SharedProject } from "@/lib/supabase";
import { Shell } from "../../_components/Shell";
import {
  EmptyState,
  ErrorState,
  Loading,
  Panel,
  SectionTitle,
} from "../../_components/States";
import {
  currentUser,
  href,
  loadPortal,
  myReview,
  REVIEW_MAX,
  submitReview,
  type PortalUser,
} from "../../_data";

type Status =
  | "loading"
  | "form" // ainda não avaliou
  | "already" // já tinha avaliado (mostra a nota que deu)
  | "sent" // acabou de enviar agora
  | "not_found"
  | "error";

const STAR_HINTS = [
  "",
  "Não recomendo",
  "Deixou a desejar",
  "Foi ok",
  "Muito bom",
  "Excelente",
];

/** Seletor de estrelas 1–5, com hover e teclado (setas). */
function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  return (
    <div
      role="radiogroup"
      aria-label="Nota de 1 a 5 estrelas"
      className="flex items-center gap-1.5"
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const on = n <= shown;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} ${n === 1 ? "estrela" : "estrelas"}`}
            onMouseEnter={() => setHover(n)}
            onClick={() => onChange(n)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                e.preventDefault();
                onChange(Math.min(5, value + 1));
              } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                e.preventDefault();
                onChange(Math.max(1, value - 1));
              }
            }}
            className="rounded-md p-1 outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-[var(--brand-via)]/40"
          >
            <Star
              className={`h-8 w-8 transition-colors ${
                on
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/30"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

/** Fila de 5 estrelas só-leitura — pra tela "você já avaliou". */
function StarsReadonly({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} de 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden="true"
          className={
            n <= rating
              ? "h-4 w-4 fill-amber-400 text-amber-400"
              : "h-4 w-4 text-muted-foreground/30"
          }
        />
      ))}
    </div>
  );
}

export default function AvaliarPage() {
  const router = useRouter();
  const params = useParams<{ projectId: string }>();
  const projectId = params?.projectId ?? "";

  const [user, setUser] = useState<PortalUser | null>(null);
  const [project, setProject] = useState<SharedProject | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");

  // form
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [existingRating, setExistingRating] = useState(0);

  const load = useCallback(async () => {
    setStatus("loading");
    const u = await currentUser();
    if (!u) {
      router.replace(href("/cliente/login"));
      return;
    }
    setUser(u);

    const res = await loadPortal(projectId, u.id);
    if (!res.ok) {
      setStatus(res.kind === "not_found" ? "not_found" : "error");
      setMessage(res.message);
      return;
    }
    setProject(res.data.project);

    const mine = await myReview(projectId, u.id);
    if (mine.ok && mine.data) {
      setExistingRating(mine.data.rating);
      setStatus("already");
      return;
    }
    setStatus("form");
  }, [projectId, router]);

  useEffect(() => {
    load();
  }, [load]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || busy) return;
    setErr("");
    if (rating < 1) {
      setErr("Escolha de 1 a 5 estrelas.");
      return;
    }
    setBusy(true);
    const res = await submitReview(projectId, user.id, rating, body);
    setBusy(false);
    if (!res.ok) {
      setErr(res.message);
      return;
    }
    setExistingRating(res.data.rating);
    setStatus("sent");
  }

  // ---- estados de tela -----------------------------------------------------

  if (status === "loading") {
    return (
      <Shell email={user?.email} label="Avaliação">
        <Loading label="Abrindo a avaliação" />
      </Shell>
    );
  }

  if (status === "not_found") {
    return (
      <Shell email={user?.email} label="Avaliação">
        <EmptyState title="Projeto não encontrado">
          Este projeto não existe ou não está vinculado à sua conta.{" "}
          <Link
            href={href("/cliente")}
            className="text-[var(--brand-via)] underline-offset-4 hover:underline"
          >
            Ver meus projetos
          </Link>
          .
        </EmptyState>
      </Shell>
    );
  }

  if (status === "error") {
    return (
      <Shell email={user?.email} label="Avaliação">
        <ErrorState message={message} onRetry={load} />
      </Shell>
    );
  }

  const backHref = href(`/cliente/${projectId}`);

  // Já avaliou (antes) OU acabou de enviar — mesma moldura de "obrigado".
  if (status === "already" || status === "sent") {
    const justSent = status === "sent";
    return (
      <Shell email={user?.email} label="Avaliação">
        <BackLink href={backHref} />
        <Panel accent className="p-6 text-center sm:p-8">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/12 text-emerald-500">
            <Check className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-xl font-bold tracking-tight sm:text-2xl">
            {justSent ? "Obrigado pela avaliação!" : "Você já avaliou este projeto"}
          </h1>
          <div className="mt-3 flex justify-center">
            <StarsReadonly rating={existingRating} />
          </div>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            {justSent
              ? "Sua avaliação foi registrada e vai ser publicada no site após uma revisão rápida. Obrigado por confiar no meu trabalho."
              : "Obrigado! Sua avaliação já foi registrada. Depois de revisada, ela pode aparecer no site."}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/60 px-4 py-2 text-xs font-semibold backdrop-blur transition hover:border-[var(--brand-via)]/45"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao projeto
            </Link>
          </div>
        </Panel>
      </Shell>
    );
  }

  // Formulário
  const remaining = REVIEW_MAX - body.length;
  return (
    <Shell email={user?.email} label="Avaliação">
      <BackLink href={backHref} />

      <Panel accent className="p-6 sm:p-8">
        <p className="font-[family-name:var(--font-caveat)] text-base tracking-wide text-muted-foreground/80">
          {"// como foi trabalhar comigo?"}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Avaliar o projeto
        </h1>
        {project && (
          <p className="mt-1.5 text-sm text-muted-foreground">{project.title}</p>
        )}

        <form onSubmit={submit} className="mt-7 space-y-6">
          <div>
            <SectionTitle>Sua nota</SectionTitle>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <StarPicker value={rating} onChange={setRating} />
              <span
                className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground"
                aria-live="polite"
              >
                {rating > 0 ? STAR_HINTS[rating] : "toque nas estrelas"}
              </span>
            </div>
          </div>

          <div>
            <SectionTitle>Seu depoimento</SectionTitle>
            <textarea
              value={body}
              maxLength={REVIEW_MAX}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              placeholder="O que a gente entregou, como foi a comunicação, o que você destacaria pra quem for me contratar…"
              className="mt-3 w-full resize-none rounded-xl border border-border/70 bg-background/60 px-3.5 py-3 text-sm outline-none backdrop-blur transition placeholder:text-muted-foreground/60 focus:border-[var(--brand-via)] focus:ring-2 focus:ring-[var(--brand-via)]/25"
            />
            <p className="mt-1.5 text-right font-mono text-[10px] text-muted-foreground/60">
              {remaining} caracteres restantes
            </p>
          </div>

          <p className="rounded-xl border border-border/60 bg-card/40 px-3.5 py-3 text-xs leading-relaxed text-muted-foreground">
            Sua avaliação passa por uma revisão antes de aparecer no site. Nada é
            publicado sem a sua nota bater com o que você escreveu.
          </p>

          {err && (
            <p
              role="alert"
              className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive"
            >
              {err}
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={busy || rating < 1 || !body.trim()}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--brand-from)] via-[var(--brand-via)] to-[var(--brand-to)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {busy ? "Enviando…" : "Enviar avaliação"}
            </button>
          </div>
        </form>
      </Panel>
    </Shell>
  );
}

function BackLink({ href: to }: { href: string }) {
  return (
    <div className="mb-4">
      <Link
        href={to}
        className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao projeto
      </Link>
    </div>
  );
}
