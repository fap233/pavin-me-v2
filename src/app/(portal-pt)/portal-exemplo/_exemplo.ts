// Dados e roteiro da página pública /portal-exemplo.
//
// Tudo aqui é FICTÍCIO e vive em memória do componente (nada de Supabase, nada
// de sessionStorage, nada de store global): visitar /portal-exemplo não pode
// ligar o modo demonstração do /cliente de verdade. Funções puras: recebem o
// estado e devolvem o novo.

import type {
  ProjectEvent,
  SharedProject,
  Sprint,
  SprintTask,
} from "@/lib/supabase";

export type Exemplo = {
  project: SharedProject;
  sprints: Sprint[];
  events: ProjectEvent[];
};

export const PROJECT_ID = "exemplo-projeto";
export const CLIENT_COMMENT =
  "Dá pra deixar o botão de comprar em verde? Combina mais com a marca.";
export const OWNER_REPLY =
  "Dá sim. Já deixei o botão em verde e você vê na próxima entrega.";

const DAY = 86_400_000;

function iso(now: number, daysAgo: number, hour = 11): string {
  const d = new Date(now - daysAgo * DAY);
  d.setHours(hour, 30, 0, 0);
  return d.toISOString();
}

function ymd(now: number, daysFromNow: number): string {
  const d = new Date(now + daysFromNow * DAY);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

const PLAN: { title: string; description: string; tasks: string[]; end: number }[] = [
  {
    title: "Planejamento e visual",
    description: "Catálogo, telas e identidade visual da loja.",
    tasks: [
      "Definir categorias e produtos",
      "Desenhar as telas principais",
      "Aprovar cores e logotipo",
    ],
    end: 5,
  },
  {
    title: "Vitrine e carrinho",
    description: "Páginas de produto, carrinho e cálculo de frete.",
    tasks: [
      "Cadastrar os produtos",
      "Montar o carrinho de compras",
      "Calcular o frete por CEP",
    ],
    end: 14,
  },
  {
    title: "Pagamento e pedidos",
    description: "Pix, cartão e aviso de cada pedido por e-mail.",
    tasks: [
      "Receber por Pix e cartão",
      "Enviar e-mail a cada pedido",
      "Painel para ver os pedidos",
    ],
    end: 23,
  },
  {
    title: "Testes e publicação",
    description: "Revisão no celular, publicação e explicação de uso.",
    tasks: [
      "Testar no celular e no computador",
      "Publicar no seu endereço",
      "Mostrar como usar o painel",
    ],
    end: 30,
  },
];

export function seed(now: number = Date.now()): Exemplo {
  const project: SharedProject = {
    id: PROJECT_ID,
    source: null,
    ref_id: null,
    title: "Loja virtual de camisetas (exemplo)",
    description: "Exemplo fictício para mostrar o acompanhamento.",
    client: "Ana",
    link: null,
    status: "doing",
    notes: null,
    delivery_at: null,
    delivery_date: ymd(now, 30),
    claimed_by: null,
    claimed_email: null,
    claimed_at: null,
    created_at: iso(now, 3),
    updated_at: iso(now, 0),
  };

  const sprints: Sprint[] = PLAN.map((p, i) => {
    const id = `exemplo-s${i + 1}`;
    const tasks: SprintTask[] = p.tasks.map((t, j) => ({
      id: `${id}-t${j + 1}`,
      sprint_id: id,
      project_id: PROJECT_ID,
      idx: j + 1,
      title: t,
      done: i === 0 && j === 0,
      done_at: i === 0 && j === 0 ? iso(now, 1) : null,
    }));
    return {
      id,
      project_id: PROJECT_ID,
      idx: i + 1,
      title: p.title,
      description: p.description,
      status: i === 0 ? "in_progress" : "planned",
      planned_end: ymd(now, p.end),
      delivered_at: null,
      approved_at: null,
      approved_by: null,
      created_at: iso(now, 3),
      tasks,
    };
  });

  const events: ProjectEvent[] = [
    {
      id: "exemplo-e1",
      project_id: PROJECT_ID,
      sprint_id: null,
      type: "project_started",
      title: "Projeto iniciado",
      body: "Combinamos o plano em 4 etapas.",
      actor: "owner",
      author_id: null,
      created_at: iso(now, 3),
    },
    {
      id: "exemplo-e2",
      project_id: PROJECT_ID,
      sprint_id: "exemplo-s1",
      type: "sprint_started",
      title: "Etapa 1 começou: Planejamento e visual",
      body: null,
      actor: "owner",
      author_id: null,
      created_at: iso(now, 3, 12),
    },
  ];

  return { project, sprints, events };
}

let seq = 0;
function ev(
  s: Exemplo,
  e: Omit<ProjectEvent, "id" | "project_id" | "author_id" | "created_at">
): ProjectEvent[] {
  seq += 1;
  return [
    ...s.events,
    {
      ...e,
      id: `exemplo-n${seq}`,
      project_id: PROJECT_ID,
      author_id: null,
      created_at: new Date().toISOString(),
    },
  ];
}

// ---- Ações (usadas pelo roteiro E pelo clique do visitante) ---------------

/** Eu marco uma tarefa como feita. Não faz nada se já estava feita. */
export function markTask(s: Exemplo, sprintIdx: number, taskIdx: number): Exemplo {
  return {
    ...s,
    sprints: s.sprints.map((sp) =>
      sp.idx !== sprintIdx
        ? sp
        : {
            ...sp,
            tasks: (sp.tasks ?? []).map((t) =>
              t.idx === taskIdx && !t.done
                ? { ...t, done: true, done_at: new Date().toISOString() }
                : t
            ),
          }
    ),
  };
}

/** Entrego a etapa para aprovação. Só vale se ela está em andamento. */
export function deliver(s: Exemplo, sprintIdx: number): Exemplo {
  const sp = s.sprints.find((x) => x.idx === sprintIdx);
  if (!sp || sp.status !== "in_progress") return s;
  const now = new Date().toISOString();
  const next = {
    ...s,
    sprints: s.sprints.map((x) =>
      x.id === sp.id
        ? {
            ...x,
            status: "delivered" as const,
            delivered_at: now,
            tasks: (x.tasks ?? []).map((t) =>
              t.done ? t : { ...t, done: true, done_at: now }
            ),
          }
        : x
    ),
  };
  return {
    ...next,
    events: ev(next, {
      sprint_id: sp.id,
      type: "sprint_delivered",
      title: `Etapa ${sp.idx} entregue para sua aprovação`,
      body: sp.title,
      actor: "owner",
    }),
  };
}

/** O cliente aprova a etapa entregue; a próxima começa. */
export function approve(s: Exemplo, sprintId: string): Exemplo {
  const sp = s.sprints.find((x) => x.id === sprintId);
  if (!sp || sp.status !== "delivered") return s;
  const now = new Date().toISOString();
  const nextSp = s.sprints.find((x) => x.idx === sp.idx + 1);
  let out: Exemplo = {
    ...s,
    sprints: s.sprints.map((x) => {
      if (x.id === sp.id)
        return { ...x, status: "approved" as const, approved_at: now, approved_by: "visitante" };
      if (nextSp && x.id === nextSp.id) return { ...x, status: "in_progress" as const };
      return x;
    }),
  };
  out = {
    ...out,
    events: ev(out, {
      sprint_id: sp.id,
      type: "sprint_approved",
      title: `Etapa ${sp.idx} aprovada por você`,
      body: null,
      actor: "client",
    }),
  };
  if (nextSp)
    out = {
      ...out,
      events: ev(out, {
        sprint_id: nextSp.id,
        type: "sprint_started",
        title: `Etapa ${nextSp.idx} começou: ${nextSp.title}`,
        body: null,
        actor: "owner",
      }),
    };
  return out;
}

export function clientComment(s: Exemplo, text: string, sprintId: string | null): Exemplo {
  return {
    ...s,
    events: ev(s, {
      sprint_id: sprintId,
      type: "comment",
      title: "Comentário do cliente",
      body: text,
      actor: "client",
    }),
  };
}

export function ownerReply(s: Exemplo, text: string, sprintId: string | null): Exemplo {
  return {
    ...s,
    events: ev(s, {
      sprint_id: sprintId,
      type: "comment",
      title: "Resposta do Fellipe",
      body: text,
      actor: "owner",
    }),
  };
}

// ---- Roteiro ---------------------------------------------------------------

export type Passo = {
  /** Frase que explica ao visitante o que acabou de acontecer. */
  legenda: string;
  /** Quanto tempo (ms) o passo fica na tela antes do próximo, no modo automático. */
  ms: number;
  /** O que muda nos dados. Idempotente: se o visitante já fez a ação, não duplica. */
  aplicar: (s: Exemplo) => Exemplo;
  /** Passo em que o cliente "digita" no campo de comentário. */
  digitando?: boolean;
};

export const PASSOS: Passo[] = [
  {
    legenda: "Eu terminei mais uma tarefa da etapa 1. A barra de progresso andou.",
    ms: 3000,
    aplicar: (s) => markTask(s, 1, 2),
  },
  {
    legenda: "Última tarefa da etapa 1 pronta. O progresso chegou a 25%.",
    ms: 3000,
    aplicar: (s) => markTask(s, 1, 3),
  },
  {
    legenda:
      "Etapa 1 entregue. Um aviso novo apareceu em Acompanhamento e agora é a sua vez de aprovar.",
    ms: 3500,
    aplicar: (s) => deliver(s, 1),
  },
  {
    legenda:
      "Você aprovou a etapa 1 (basta um clique). Ela ficou concluída e eu comecei a etapa 2.",
    ms: 3500,
    aplicar: (s) => approve(s, "exemplo-s1"),
  },
  {
    legenda: "Você escreve um comentário no campo, como numa conversa.",
    ms: 3500,
    aplicar: (s) => s,
    digitando: true,
  },
  {
    legenda: "Comentário enviado. Ele aparece em Acompanhamento, com data e hora.",
    ms: 3000,
    aplicar: (s) => clientComment(s, CLIENT_COMMENT, null),
  },
  {
    legenda: "Eu respondo ali mesmo. Você não precisa procurar a resposta em outro lugar.",
    ms: 3500,
    aplicar: (s) => ownerReply(s, OWNER_REPLY, null),
  },
  {
    legenda: "Fim do exemplo. Clique em Recomeçar para ver de novo, ou mexa à vontade.",
    ms: 0,
    aplicar: (s) => markTask(s, 2, 1),
  },
];
