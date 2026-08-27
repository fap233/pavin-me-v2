"use client";

// Índice do back-office: os três atalhos e dois números.
//
// Os números saem da MESMA leitura da aba Clientes (listPortals) — nada de
// contador inventado ou de segunda fonte que diverge da lista. Se a leitura
// falhar, os atalhos continuam de pé e o contador diz que não sabe, em vez de
// mostrar zero (zero é uma resposta, "não sei" é outra).

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, FolderKanban, MessageSquareWarning, Users } from "lucide-react";
import { Panel } from "../cliente/_components/States";
import { listPortals, type PortalSummary } from "./_data";
import { useStaff } from "./_components/AdminShell";

export default function AdminIndexPage() {
  const staff = useStaff();
  const [portals, setPortals] = useState<PortalSummary[] | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    const res = await listPortals();
    if (!res.ok) {
      setError(res.message);
      setPortals(null);
      return;
    }
    setPortals(res.data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const pending = portals?.reduce((n, p) => n + p.pending, 0) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <p className="font-[family-name:var(--font-caveat)] text-base tracking-wide text-muted-foreground/80">
          {"// back-office"}
        </p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {staff.name ? `Oi, ${staff.name}` : "Oi"}
        </h1>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Stat
          icon={<Users className="h-4 w-4" />}
          label="Portais de cliente"
          value={portals ? String(portals.length) : "—"}
          unknown={!portals}
        />
        <Stat
          icon={<MessageSquareWarning className="h-4 w-4" />}
          label="Comentários sem resposta"
          value={pending === null ? "—" : String(pending)}
          unknown={pending === null}
          alert={pending !== null && pending > 0}
        />
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}{" "}
          <button
            type="button"
            onClick={load}
            className="underline underline-offset-4"
          >
            Tentar de novo
          </button>
        </p>
      )}

      <ul className="space-y-3">
        <Shortcut
          href="/admin/clientes"
          title="Clientes"
          icon={<Users className="h-4 w-4" />}
        >
          Os portais: progresso, sprint da vez e quem está esperando resposta.
        </Shortcut>
        <Shortcut
          href="/admin/meus"
          title="Meus"
          icon={<FolderKanban className="h-4 w-4" />}
        >
          Os projetos que você pegou no Kanban.
        </Shortcut>
        <Shortcut
          href="/admin/kanban"
          title="Kanban"
          icon={<FolderKanban className="h-4 w-4" />}
        >
          O backlog completo — onde o trabalho anda de coluna.
        </Shortcut>
      </ul>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  unknown,
  alert = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unknown: boolean;
  alert?: boolean;
}) {
  return (
    <Panel className="p-5">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {icon}
        {label}
      </div>
      <p
        className={`mt-2 text-3xl font-bold tabular-nums ${
          unknown
            ? "text-muted-foreground/40"
            : alert
              ? "text-amber-500"
              : "text-foreground"
        }`}
      >
        {value}
      </p>
      {unknown && (
        <p className="mt-1 text-xs text-muted-foreground/70">
          não consegui contar agora
        </p>
      )}
    </Panel>
  );
}

function Shortcut({
  href,
  title,
  icon,
  children,
}: {
  href: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link href={href} className="block">
        <Panel className="group p-5 transition-transform duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--brand-via)_45%,transparent)]">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-base font-semibold group-hover:text-[var(--brand-via)]">
                <span className="text-muted-foreground group-hover:text-[var(--brand-via)]">
                  {icon}
                </span>
                {title}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{children}</p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-[var(--brand-via)]" />
          </div>
        </Panel>
      </Link>
    </li>
  );
}
