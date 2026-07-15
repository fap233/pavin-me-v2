"use client";

// Casca do portal. O /cliente vive fora do chrome do site (sem Header/Footer),
// então traz o próprio topo — mesma linguagem do /projetos: grid de caderno
// sobre o fundo estrelado do site, marca, e o toggle de tema com a revelação
// em "blot" de tinta (View Transitions API).

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { href, isMockMode, signOut } from "../_data";

export function Shell({
  children,
  label = "Portal do cliente",
  email,
}: {
  children: React.ReactNode;
  label?: string;
  email?: string | null;
}) {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);

  // isMockMode() olha sessionStorage/URL — não existem no HTML pré-renderizado.
  // Ler no primeiro render daria mismatch de hidratação; então só depois de
  // montar.
  const [mock, setMock] = useState(false);
  useEffect(() => setMock(isMockMode()), []);

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
        Math.max(y, window.innerHeight - y)
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
        }
      );
    });
  };

  async function leave() {
    setLeaving(true);
    await signOut();
    router.replace(href("/cliente/login"));
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 section-grid-bg [mask-image:radial-gradient(ellipse_85%_75%_at_50%_20%,#000_55%,transparent_100%)]"
      />

      <header className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 px-4 pt-6">
        <Link
          href="/"
          className="group text-lg font-bold tracking-tight transition-colors hover:text-primary"
        >
          Pavin
          <span className="ml-0.5 inline-block font-[family-name:var(--font-caveat)] text-xl text-primary transition-transform group-hover:rotate-[-3deg]">
            .dev
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {mock && (
            <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-amber-500">
              demonstração
            </span>
          )}
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70 sm:inline">
            {label}
          </span>
          {email && (
            <>
              <span className="hidden max-w-[16ch] truncate font-mono text-[10px] text-muted-foreground/60 md:inline">
                {email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full"
                disabled={leaving}
                onClick={leave}
              >
                <LogOut className="mr-1.5 h-3.5 w-3.5" />
                Sair
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={switchTheme}
            aria-label="Alternar tema"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-8 sm:pt-10">{children}</main>
    </div>
  );
}
