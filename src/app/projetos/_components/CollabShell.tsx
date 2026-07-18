"use client";

// A casca do workspace (/projetos) — a PORTA DO COLABORADOR.
//
// Até aqui o /projetos era um beco sem saída: o Gustavo entrava, via o quadro e
// não tinha como ir pra lugar nenhum. Esta casca dá a ele a barra do workspace
// (que morava dentro do page.tsx) MAIS uma navegação própria, no espírito da do
// /admin — e é por isso que ela vive num layout: as telas de "Meus projetos" e
// "Disponíveis" ganham a mesma moldura de graça.
//
// O que ela NÃO é: um portão. O /admin barra quem não é staff porque lá o
// conteúdo é do dono; aqui a tela do quadro tem o PRÓPRIO formulário de login e
// quem recorta o conteúdo é a RLS — o banco não devolve pro Gustavo nada que
// não seja dele ou do backlog livre. Um portão aqui seria uma segunda regra pra
// discordar da primeira.
//
// Client component (a sessão do Supabase só existe no browser) — daí o
// layout.tsx ficar server só pra exportar o `metadata`, igual ao /admin.

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Moon, Sun } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { currentWorker, isOwnerRole, type WorkSession } from "../_data";

// Quem está logado, resolvido UMA vez na casca. `null` = ninguém (a tela do
// quadro mostra o login). As telas filhas leem daqui em vez de refazer a mesma
// ida ao Supabase.
const WorkerContext = createContext<WorkSession | null>(null);

/** A sessão do workspace. `null` = deslogado — a tela decide o que fazer com
 *  isso (o quadro pede login; as listas mandam pro quadro). */
export function useWorker(): WorkSession | null {
  return useContext(WorkerContext);
}

type Nav = { href: string; label: string; away?: boolean };

// Destinos do COLABORADOR. Só o que existe de verdade:
//   Quadro       — o kanban, dono do backlog e de toda escrita (pegar, largar,
//                  mover de coluna, roteiro).
//   Meus         — o recorte dele: o que ele pegou.
//   Disponíveis  — o backlog livre: o que ele PODE pegar.
//   Marcos       — o que já foi entregue nos projetos dele (a MESMA tela do
//                  back-office; a RLS recorta pra só mostrar os dele). Existe
//                  pra ele não ter que ir no /admin, onde é barrado.
// O /admin NÃO entra aqui: o colaborador é barrado lá, e link pra porta trancada
// é convite pra tela de "sem acesso". Pro owner (que também cai neste quadro) o
// atalho de volta é acrescentado no Nav, embaixo.
const LINKS: Nav[] = [
  { href: "/projetos", label: "Quadro" },
  { href: "/projetos/meus", label: "Meus projetos" },
  { href: "/projetos/disponiveis", label: "Disponíveis" },
  { href: "/projetos/marcos", label: "Marcos" },
];

export function CollabShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [worker, setWorker] = useState<WorkSession | null>(null);

  const refresh = useCallback(async () => {
    setWorker(await currentWorker());
  }, []);

  useEffect(() => {
    refresh();
    if (!supabase) return;
    // O login e o "Sair" moram na tela do quadro, não aqui. Sem escutar o Auth,
    // a navbar só apareceria no F5 seguinte ao login — e continuaria de pé
    // depois do logout.
    const { data } = supabase.auth.onAuthStateChange(() => {
      refresh();
    });
    return () => data.subscription.unsubscribe();
  }, [refresh]);

  // Esta rota vive fora do chrome do site (sem Header), então traz o próprio
  // botão de tema — mesmo comportamento do Header da home (revelação em "blot"
  // de tinta via View Transitions API).
  const { isDarkMode, toggleDarkMode } = useTheme();

  const switchTheme = (event: React.MouseEvent) => {
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!doc.startViewTransition || reduced) {
      toggleDarkMode();
      return;
    }
    const x = event.clientX;
    const y = event.clientY;
    const radius =
      Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      ) * 1.2;
    const POINTS = 26;
    const jitter = Array.from({ length: POINTS }, () => 0.8 + Math.random() * 0.45);
    const blot = (scale: number) =>
      `polygon(${Array.from({ length: POINTS }, (_, i) => {
        const angle = (i / POINTS) * Math.PI * 2;
        const r = radius * scale * jitter[i];
        return `${(x + Math.cos(angle) * r).toFixed(1)}px ${(y + Math.sin(angle) * r).toFixed(1)}px`;
      }).join(",")})`;
    const transition = doc.startViewTransition(() => {
      flushSync(() => toggleDarkMode());
    });
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [blot(0.004), blot(1)] },
        {
          duration: 780,
          easing: "cubic-bezier(0.3, 0.7, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  };

  return (
    <WorkerContext.Provider value={worker}>
      <div className="relative min-h-screen overflow-hidden">
        {/* Notebook grid over the site-wide universe background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 section-grid-bg [mask-image:radial-gradient(ellipse_85%_75%_at_50%_20%,#000_55%,transparent_100%)]"
        />

        {/* Minimal workspace bar — this route lives outside the main site chrome */}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 pt-6">
          <Link
            href="/"
            className="group text-lg font-bold tracking-tight transition-colors hover:text-primary"
          >
            Pavin
            <span className="ml-0.5 inline-block font-[family-name:var(--font-caveat)] text-xl text-primary transition-transform group-hover:rotate-[-3deg]">
              .dev
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70 sm:inline">
              Workspace — Backlog
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => switchTheme(e)}
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-10">
          {/* Deslogado não tem navegação: a única coisa que existe pra ele é o
              login, que é a própria tela do quadro. */}
          {worker && <WorkerNav pathname={pathname} worker={worker} />}
          {children}
        </div>
      </div>
    </WorkerContext.Provider>
  );
}

function WorkerNav({
  pathname,
  worker,
}: {
  pathname: string;
  worker: WorkSession;
}) {
  const owner = isOwnerRole(worker.role);

  return (
    <nav className="mb-6 flex flex-wrap items-center gap-2 border-b border-border/60 pb-4">
      <span className="mr-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
        workspace
      </span>
      <span aria-hidden="true" className="mr-1 text-muted-foreground/30">
        /
      </span>

      {LINKS.map((l) => {
        // "/projetos" é pai das outras rotas: match exato, senão o Quadro ficaria
        // aceso em todas as telas. As filhas casam com elas e o que houver abaixo.
        const active =
          l.href === "/projetos"
            ? pathname === "/projetos"
            : pathname === l.href || pathname.startsWith(`${l.href}/`);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              active
                ? "border-[color-mix(in_oklab,var(--brand-via)_45%,transparent)] bg-[color-mix(in_oklab,var(--brand-via)_12%,transparent)] text-[var(--brand-via)]"
                : "border-border/70 bg-card/40 text-muted-foreground hover:border-border hover:text-foreground"
            }`}
          >
            {l.label}
          </Link>
        );
      })}

      {/* O Fellipe também cai aqui — o quadro é dele também. Pro colaborador este
          link não existe (ele seria barrado no /admin). */}
      {owner && (
        <Link
          href="/admin"
          className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card/40 px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-border hover:text-foreground"
        >
          Back-office
          <ExternalLink className="h-3 w-3 opacity-60" />
        </Link>
      )}
    </nav>
  );
}
