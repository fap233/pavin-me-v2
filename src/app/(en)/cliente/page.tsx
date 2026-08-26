"use client";

// Porta de entrada do portal.
//   sem sessão   → /cliente/login
//   1 projeto    → vai direto pra ele (o caso normal)
//   vários       → lista
//   nenhum       → estado vazio honesto (não é erro, é vínculo pendente)

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { SharedProject } from "@/lib/supabase";
import { Shell } from "./_components/Shell";
import { EmptyState, ErrorState, Loading, Panel } from "./_components/States";
import {
  currentUser,
  deliveryDate,
  href,
  listMyProjects,
  type PortalUser,
} from "./_data";
import { longDate } from "./_format";

export default function ClienteIndexPage() {
  const router = useRouter();
  const [user, setUser] = useState<PortalUser | null>(null);
  const [projects, setProjects] = useState<SharedProject[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const u = await currentUser();
    if (!u) {
      router.replace(href("/cliente/login"));
      return;
    }
    setUser(u);

    const res = await listMyProjects(u.id);
    if (!res.ok) {
      setError(res.message);
      setLoading(false);
      return;
    }
    // Um projeto só: o cliente não precisa escolher nada.
    if (res.data.length === 1) {
      router.replace(href(`/cliente/${res.data[0].id}`));
      return;
    }
    setProjects(res.data);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <Shell email={user?.email}>
        <Loading label="Abrindo seu portal" />
      </Shell>
    );
  }

  if (error) {
    return (
      <Shell email={user?.email}>
        <ErrorState message={error} onRetry={load} />
      </Shell>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <Shell email={user?.email}>
        <EmptyState title="Seu projeto ainda não foi vinculado">
          Já criei o seu acesso, mas o projeto ainda não está ligado a esta
          conta. Fale com o Fellipe que ele resolve em um minuto.
        </EmptyState>
      </Shell>
    );
  }

  return (
    <Shell email={user?.email}>
      <div className="mb-6">
        <p className="font-[family-name:var(--font-caveat)] text-base tracking-wide text-muted-foreground/80">
          {"// seus projetos"}
        </p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Escolha um projeto
        </h1>
      </div>

      <ul className="space-y-3">
        {projects.map((p) => {
          const due = longDate(deliveryDate(p));
          return (
            <li key={p.id}>
              <Link href={href(`/cliente/${p.id}`)} className="block">
                <Panel className="group p-5 transition-transform duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--brand-via)_45%,transparent)]">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold group-hover:text-[var(--brand-via)]">
                        {p.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {due
                          ? `Entrega prevista: ${due}`
                          : "Entrega a combinar"}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-[var(--brand-via)]" />
                  </div>
                </Panel>
              </Link>
            </li>
          );
        })}
      </ul>
    </Shell>
  );
}
