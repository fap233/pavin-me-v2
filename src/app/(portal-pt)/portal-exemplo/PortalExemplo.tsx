"use client";

// /portal-exemplo: o portal do cliente com dados inventados e uma simulação.
// Reaproveita os componentes REAIS do portal (/cliente), alimentados por um
// estado local desta página. Nenhuma chamada ao Supabase, nenhum
// sessionStorage: o que o visitante faz aqui não sai da aba.

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LogIn, Pause, Play, RotateCcw, SkipForward } from "lucide-react";
import type { Sprint } from "@/lib/supabase";
import { Shell } from "../../(en)/cliente/_components/Shell";
import { ProgressHeader } from "../../(en)/cliente/_components/ProgressHeader";
import { SprintList } from "../../(en)/cliente/_components/SprintList";
import { Timeline } from "../../(en)/cliente/_components/Timeline";
import { Composer } from "../../(en)/cliente/_components/Composer";
import { Panel } from "../../(en)/cliente/_components/States";
import {
  CLIENT_COMMENT,
  PASSOS,
  approve,
  clientComment,
  ownerReply,
  seed,
  type Exemplo,
} from "./_exemplo";

const FOCO =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-via)]";
const BTN_PRIMARIO = `inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--brand-from)] via-[var(--brand-via)] to-[var(--brand-to)] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-40 ${FOCO}`;
const BTN_SECUNDARIO = `inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border/70 bg-background/60 px-4 py-2 text-sm font-medium transition hover:bg-secondary/60 disabled:pointer-events-none disabled:opacity-40 ${FOCO}`;

const INTRO =
  "Aperte em Ver como funciona e acompanhe um projeto de exemplo andando sozinho.";

type Modo = "parado" | "auto" | "pausado";

export function PortalExemplo() {
  const [ex, setEx] = useState<Exemplo | null>(null);
  const [passo, setPasso] = useState(0); // quantos passos do roteiro já rodaram
  const [modo, setModo] = useState<Modo>("parado");
  const [digitado, setDigitado] = useState<string | null>(null);
  const [reduzido, setReduzido] = useState(false);
  const [aprovando, setAprovando] = useState<string | null>(null);

  const passoRef = useRef(0);
  const digitandoRef = useRef<number | undefined>(undefined);
  const respostasRef = useRef<Set<number>>(new Set());

  // Datas relativas a hoje: só no navegador, depois de montar (evita
  // diferença entre o HTML do servidor e o do cliente).
  useEffect(() => {
    setEx(seed());
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduzido(mq.matches);
    const on = () => setReduzido(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const pararDigitacao = useCallback(() => {
    window.clearInterval(digitandoRef.current);
    digitandoRef.current = undefined;
  }, []);

  const limparTimers = useCallback(() => {
    pararDigitacao();
    respostasRef.current.forEach((t) => window.clearTimeout(t));
    respostasRef.current.clear();
  }, [pararDigitacao]);

  useEffect(() => limparTimers, [limparTimers]);

  const avancar = useCallback(() => {
    const i = passoRef.current;
    if (i >= PASSOS.length) return;
    const p = PASSOS[i];
    passoRef.current = i + 1;
    setPasso(i + 1);

    pararDigitacao();
    if (p.digitando) {
      if (reduzido) {
        setDigitado(CLIENT_COMMENT);
      } else {
        let n = 0;
        setDigitado("");
        digitandoRef.current = window.setInterval(() => {
          n += 1;
          setDigitado(CLIENT_COMMENT.slice(0, n));
          if (n >= CLIENT_COMMENT.length) pararDigitacao();
        }, 40);
      }
    } else {
      setDigitado(null);
    }
    setEx((prev) => (prev ? p.aplicar(prev) : prev));
  }, [reduzido, pararDigitacao]);

  // Modo automático: um passo a cada 2 a 4 segundos. Com movimento reduzido
  // nunca roda sozinho.
  useEffect(() => {
    if (modo !== "auto" || reduzido) return;
    if (passo >= PASSOS.length) {
      setModo("parado");
      return;
    }
    const espera = passo === 0 ? 800 : PASSOS[passo - 1].ms;
    const t = window.setTimeout(avancar, espera);
    return () => window.clearTimeout(t);
  }, [modo, passo, reduzido, avancar]);

  function comecar() {
    if (reduzido) {
      setModo("pausado");
      avancar();
    } else {
      setModo("auto");
    }
  }

  function recomecar() {
    limparTimers();
    passoRef.current = 0;
    setPasso(0);
    setDigitado(null);
    setAprovando(null);
    setModo("parado");
    setEx(seed());
  }

  // ---- Ações do visitante (mexem só no estado local) ----------------------

  function aprovar(s: Sprint) {
    setAprovando(s.id);
    window.setTimeout(() => {
      setEx((prev) => (prev ? approve(prev, s.id) : prev));
      setAprovando(null);
    }, 500);
  }

  async function enviar(texto: string, sprintId?: string | null) {
    const sid = sprintId ?? null;
    setEx((prev) => (prev ? clientComment(prev, texto, sid) : prev));
    // Sem texto digitado pela simulação: este é um comentário do próprio visitante.
    const t = window.setTimeout(() => {
      respostasRef.current.delete(t);
      setEx((prev) =>
        prev
          ? ownerReply(
              prev,
              "Recebi! Isto é só um exemplo, então nada saiu desta página. No projeto de verdade eu respondo por aqui.",
              sid
            )
          : prev
      );
    }, 1800);
    respostasRef.current.add(t);
    return { ok: true } as const;
  }

  const fim = passo >= PASSOS.length;
  const legenda = passo === 0 ? INTRO : PASSOS[passo - 1].legenda;

  return (
    <Shell exemplo label="Exemplo">
      <div className="space-y-5">
        <Explicacao />

        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Projeto de exemplo · cliente fictícia: Ana
        </p>

        {!ex ? (
          <Panel className="p-6 sm:p-8">
            <p role="status" className="text-sm text-muted-foreground">
              Montando o exemplo...
            </p>
          </Panel>
        ) : (
          <>
            <ProgressHeader project={ex.project} sprints={ex.sprints} />
            <Timeline events={[...ex.events].reverse()} sprints={ex.sprints} />
            <SprintList
              sprints={ex.sprints}
              events={ex.events}
              onApprove={aprovar}
              approvingId={aprovando}
              onComment={enviar}
            />
            <Composer onSend={enviar} simulatedText={digitado} />
          </>
        )}

        <Panel accent className="p-6 text-center sm:p-8">
          <h2 className="text-lg font-bold tracking-tight">
            Quando o seu projeto começar, você recebe o seu acesso
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Esta página é só um exemplo. Se você já é meu cliente, entre com o
            login e a senha que enviei.
          </p>
          <Link href="/cliente/login" className={`${BTN_PRIMARIO} mt-5`}>
            <LogIn className="h-4 w-4" />
            Já sou cliente: entrar
          </Link>
        </Panel>
      </div>

      {/* Controles da simulação: fixos no pé da tela, para aparecerem enquanto
          o visitante olha a página (no celular principalmente). Fixed e não
          sticky porque o Shell tem overflow-hidden, que anula o sticky. O
          espaçador abaixo evita cobrir o fim da página. */}
      <div aria-hidden="true" className="h-44" />
      <div className="fixed inset-x-3 bottom-3 z-30 mx-auto max-w-3xl">
        <Panel className="p-3 sm:p-4">
          <p
            className="mb-3 text-sm leading-snug"
            aria-live="polite"
            aria-atomic="true"
          >
            {passo > 0 && !fim && (
              <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--brand-via)]">
                Passo {passo} de {PASSOS.length}
              </span>
            )}
            {legenda}
          </p>
          <div className="flex flex-wrap gap-2">
            {passo === 0 && modo === "parado" ? (
              <button type="button" onClick={comecar} className={BTN_PRIMARIO}>
                <Play className="h-4 w-4" />
                Ver como funciona
              </button>
            ) : (
              <>
                {!reduzido && !fim && modo === "auto" && (
                  <button
                    type="button"
                    onClick={() => setModo("pausado")}
                    className={BTN_SECUNDARIO}
                  >
                    <Pause className="h-4 w-4" />
                    Pausar
                  </button>
                )}
                {!reduzido && !fim && modo !== "auto" && (
                  <button
                    type="button"
                    onClick={() => setModo("auto")}
                    className={BTN_PRIMARIO}
                  >
                    <Play className="h-4 w-4" />
                    Continuar
                  </button>
                )}
                {!fim && (
                  <button
                    type="button"
                    onClick={() => {
                      if (modo === "auto") setModo("pausado");
                      avancar();
                    }}
                    className={reduzido ? BTN_PRIMARIO : BTN_SECUNDARIO}
                  >
                    <SkipForward className="h-4 w-4" />
                    Próximo passo
                  </button>
                )}
                <button
                  type="button"
                  onClick={recomecar}
                  className={fim ? BTN_PRIMARIO : BTN_SECUNDARIO}
                >
                  <RotateCcw className="h-4 w-4" />
                  Recomeçar
                </button>
              </>
            )}
          </div>
        </Panel>
      </div>
    </Shell>
  );
}

function Explicacao() {
  const itens = [
    {
      t: "O que é",
      d: "Uma página só do seu projeto, que abre no celular e no computador.",
    },
    {
      t: "O que você recebe",
      d: "Login e senha quando o projeto começa. Só quem trabalha no seu projeto vê o que está lá.",
    },
    {
      t: "O que você vê",
      d: "As etapas do trabalho, o que já foi entregue, em que parte estou trabalhando agora e as datas previstas.",
    },
    {
      t: "Como fala comigo",
      d: "Deixe um comentário na própria página, em qualquer etapa, ou chame no chat. Eu respondo por lá.",
    },
  ];
  return (
    <Panel accent className="p-6 sm:p-8">
      <p className="font-[family-name:var(--font-caveat)] text-base tracking-wide text-muted-foreground/80">
        {"// exemplo"}
      </p>
      <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
        Como eu acompanho o seu projeto com você
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Cada projeto tem uma página só dele, que eu atualizo conforme o trabalho
        anda. Você não precisa me perguntar como está: é só abrir e ver.
      </p>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        {itens.map((i) => (
          <div key={i.t}>
            <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--brand-via)]">
              {i.t}
            </dt>
            <dd className="mt-1 text-sm leading-relaxed">{i.d}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 border-t border-border/60 pt-4 text-sm leading-relaxed text-muted-foreground">
        O projeto abaixo é inventado (uma loja virtual de camisetas, da cliente
        fictícia Ana). Aperte em Ver como funciona para ver uma sequência de
        exemplo, ou mexa à vontade: aprovar uma etapa e escrever comentários
        funcionam, e nada sai desta página. Aqui as etapas aparecem como
        sprints.
      </p>
    </Panel>
  );
}
