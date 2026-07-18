"use client";

// Casca do back-office: o PORTÃO de staff + a navegação.
//
// Mora aqui (e não no layout.tsx) por um motivo bobo do Next: a sessão do
// Supabase só existe no browser, então o portão é client component — e client
// component não exporta `metadata`. O layout fica server, exporta o noindex, e
// delega o resto pra cá.
//
// O portão não substitui a RLS: quem decide de verdade é o banco (is_staff()).
// Isto aqui é pra não desenhar uma tela vazia e sem explicação pra quem não é
// staff — e pra não vazar NADA (nem o nome de um projeto) pra quem é cliente.

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShieldOff } from "lucide-react";
import { Shell } from "../../cliente/_components/Shell";
import { ErrorState, Loading, Panel } from "../../cliente/_components/States";
import { currentStaff, type StaffUser } from "../_data";

// Quem está logado, resolvido UMA vez no portão. As páginas só renderizam depois
// que ele passou, então dentro delas o staff nunca é null — daí o hook estourar
// em vez de devolver null e espalhar `?.` por toda a árvore.
const StaffContext = createContext<StaffUser | null>(null);

export function useStaff(): StaffUser {
  const s = useContext(StaffContext);
  if (!s) throw new Error("useStaff() fora do portão do /admin");
  return s;
}

type Gate =
  | { kind: "checking" }
  | { kind: "staff"; user: StaffUser }
  | { kind: "denied" }
  | { kind: "error"; message: string };

const LINKS = [
  // O Kanban é a MESMA tela do /projetos, renderizada dentro desta casca. Já foi
  // um link pra fora; virou item de casa quando ficou claro que mandar o dono
  // pra outra casca (outro topo, outro "Sair", sem volta) era a pior parte do
  // back-office.
  { href: "/admin/kanban", label: "Kanban" },
  { href: "/admin/meus", label: "Meus" },
  { href: "/admin/clientes", label: "Clientes" },
];

/** O Kanban são 4 colunas; o resto do back-office é leitura em coluna única.
 *  A casca do portal nasceu estreita (max-w-3xl) porque é a medida certa pra
 *  ler — e é a medida errada pra um quadro. */
function isWide(pathname: string): boolean {
  return pathname === "/admin/kanban";
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [gate, setGate] = useState<Gate>({ kind: "checking" });

  const check = useCallback(async () => {
    setGate({ kind: "checking" });
    const res = await currentStaff();
    if (res.kind === "anon") {
      // Mesmo login do portal (/cliente/login) — é a mesma tabela de usuários e
      // o mesmo Supabase Auth; não existe "login do admin" pra manter. O `next`
      // faz voltar pra cá em vez de largar o staff no portal do cliente, que
      // pra ele é uma tela vazia.
      router.replace(`/cliente/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (res.kind === "staff") setGate({ kind: "staff", user: res.user });
    else if (res.kind === "denied") setGate({ kind: "denied" });
    else setGate({ kind: "error", message: res.message });
  }, [pathname, router]);

  useEffect(() => {
    check();
  }, [check]);

  if (gate.kind === "checking") {
    return (
      <Shell label="Back-office">
        <Loading label="Conferindo seu acesso" />
      </Shell>
    );
  }

  if (gate.kind === "error") {
    return (
      <Shell label="Back-office">
        <ErrorState message={gate.message} onRetry={check} />
      </Shell>
    );
  }

  if (gate.kind === "denied") {
    // Sem acesso ≠ erro. E, principalmente: sem nenhuma pista do que tem aqui
    // dentro — o texto não diz nem que existe um /admin, nem por que a conta
    // reprovou.
    //
    // Quem cai aqui logado é COLABORADOR ou CLIENTE, e cada um tem uma porta
    // diferente. Não dá pra perguntar o papel pra escolher o link (seria dizer
    // "você é da equipe, só que não" pra quem não devia saber que a distinção
    // existe), então oferecemos os dois e deixamos a pessoa se reconhecer. O
    // erro que isso evita é o antigo: mandar o Gustavo pro /cliente, um portal
    // que pra ele é uma tela vazia — beco sem saída de novo, agora do outro lado.
    return (
      <Shell label="Back-office">
        <Panel className="p-8 text-center" accent>
          <ShieldOff className="mx-auto h-6 w-6 text-muted-foreground" />
          <h1 className="mt-3 text-xl font-bold tracking-tight">Sem acesso</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Esta área é da administração. Sua conta não tem acesso a ela.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
            <Link
              href="/projetos"
              className="text-[var(--brand-via)] underline-offset-4 hover:underline"
            >
              Ir para o backlog de projetos
            </Link>
            <Link
              href="/cliente"
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Ir para o meu portal
            </Link>
          </div>
        </Panel>
      </Shell>
    );
  }

  return (
    <StaffContext.Provider value={gate.user}>
      <Shell label="Back-office" email={gate.user.email} wide={isWide(pathname)}>
        <Nav pathname={pathname} role={gate.user.role} />
        {children}
      </Shell>
    </StaffContext.Provider>
  );
}

function Nav({ pathname, role }: { pathname: string; role: string }) {
  return (
    <nav className="mb-6 flex flex-wrap items-center gap-2 border-b border-border/60 pb-4">
      <Link
        href="/admin"
        className={`mr-1 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${
          pathname === "/admin"
            ? "text-foreground"
            : "text-muted-foreground/70 hover:text-foreground"
        }`}
      >
        admin
      </Link>
      <span aria-hidden="true" className="mr-1 text-muted-foreground/30">
        /
      </span>

      {LINKS.map((l) => {
        // O item vale pra rota dele e pra tudo abaixo (/admin/clientes segue
        // ativo dentro do portal de um cliente).
        const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
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

      <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">
        {role}
      </span>
    </nav>
  );
}
