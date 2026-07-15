// Modo demonstração do portal do cliente.
//
// A migração do Supabase (sprints / project_events / project_members) pode
// ainda não estar aplicada. Este arquivo é uma fonte de dados em memória com o
// MESMO formato do banco, pra dar pra ver e clicar a tela inteira sem banco.
//
// Como ligar:
//   • abrir /cliente?mock=1  (fica valendo pela sessão da aba), ou
//   • NEXT_PUBLIC_CLIENTE_MOCK=1 no .env.local, ou
//   • nada disso + Supabase não configurado → cai em mock sozinho.
// Como desligar: /cliente?mock=0 (ou fechar a aba / limpar o sessionStorage).
//
// Aprovar sprint e comentar MUTAM este store e notificam os assinantes — é o
// mesmo caminho de código do realtime, então o pulso da timeline e a barra de
// progresso reagem igual ao que o Supabase faria.

import type { ProjectEvent, SharedProject, Sprint } from "@/lib/supabase";

export const MOCK_USER = {
  id: "00000000-0000-4000-8000-000000000001",
  email: "cliente@exemplo.com",
};

const P1 = "11111111-1111-4111-8111-111111111111";
const P2 = "22222222-2222-4222-8222-222222222222";

export const MOCK_PROJECT_IDS = [P1, P2];

function iso(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(11, 30, 0, 0);
  return d.toISOString();
}

function ymd(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

type MockState = {
  projects: SharedProject[];
  sprints: Sprint[];
  events: ProjectEvent[];
};

function seed(): MockState {
  const base = {
    source: null,
    ref_id: null,
    client: "Cliente demo",
    link: null,
    notes: null,
    delivery_at: null,
    claimed_by: null,
    claimed_email: null,
    claimed_at: null,
    updated_at: iso(0),
  };

  const projects: SharedProject[] = [
    {
      ...base,
      id: P1,
      title: "E-commerce Mercado Livre",
      description:
        "Loja integrada ao Mercado Livre com painel de pedidos e relatórios.",
      status: "doing",
      delivery_date: ymd(46),
      created_at: iso(16),
    },
    {
      ...base,
      id: P2,
      title: "Site institucional + blog",
      description: "Presença nova, com blog e formulário de contato.",
      status: "backlog",
      delivery_date: null,
      created_at: iso(2),
    },
  ];

  const sprints: Sprint[] = [
    {
      id: "s1",
      project_id: P1,
      idx: 1,
      title: "Fundação e catálogo",
      description: "Estrutura da loja, cadastro de produtos e vitrine.",
      status: "approved",
      planned_end: ymd(-15),
      delivered_at: iso(17),
      approved_at: iso(13),
      approved_by: MOCK_USER.id,
      created_at: iso(20),
    },
    {
      id: "s2",
      project_id: P1,
      idx: 2,
      title: "Painel admin",
      description: "Onde você acompanha e despacha os pedidos.",
      status: "delivered",
      planned_end: ymd(-6),
      delivered_at: iso(6),
      approved_at: null,
      approved_by: null,
      created_at: iso(20),
    },
    {
      id: "s3",
      project_id: P1,
      idx: 3,
      title: "Integração com o Mercado Livre",
      description:
        "Seus anúncios e pedidos do ML entram sozinhos, sem digitar nada.",
      status: "in_progress",
      planned_end: ymd(9),
      delivered_at: null,
      approved_at: null,
      approved_by: null,
      created_at: iso(20),
    },
    {
      id: "s4",
      project_id: P1,
      idx: 4,
      title: "Relatórios de venda",
      description: "Faturamento por período, produtos que mais saem.",
      status: "planned",
      planned_end: ymd(24),
      delivered_at: null,
      approved_at: null,
      approved_by: null,
      created_at: iso(20),
    },
    {
      id: "s5",
      project_id: P1,
      idx: 5,
      title: "Testes e ajustes finais",
      description: "Revisão geral antes de colocar no ar.",
      status: "planned",
      planned_end: ymd(38),
      delivered_at: null,
      approved_at: null,
      approved_by: null,
      created_at: iso(20),
    },
    {
      id: "s6",
      project_id: P1,
      idx: 6,
      title: "Publicação",
      description: "Loja no ar, com o time treinado pra operar.",
      status: "planned",
      planned_end: ymd(46),
      delivered_at: null,
      approved_at: null,
      approved_by: null,
      created_at: iso(20),
    },
  ];

  const events: ProjectEvent[] = [
    {
      id: "e1",
      project_id: P1,
      sprint_id: null,
      type: "project_started",
      title: "Projeto iniciado",
      body: "Combinado fechado. Começamos pela fundação da loja.",
      actor: "owner",
      created_at: iso(20),
    },
    {
      id: "e2",
      project_id: P1,
      sprint_id: "s1",
      type: "sprint_delivered",
      title: "Sprint 1 entregue",
      body: "Fundação e catálogo no ar pra você conferir.",
      actor: "owner",
      created_at: iso(17),
    },
    {
      id: "e3",
      project_id: P1,
      sprint_id: "s1",
      type: "sprint_approved",
      title: "Sprint 1 aprovada por você",
      body: null,
      actor: "client",
      created_at: iso(13),
    },
    {
      id: "e4",
      project_id: P1,
      sprint_id: "s2",
      type: "sprint_delivered",
      title: "Sprint 2 entregue",
      body: "Painel admin pronto: dá pra ver e despachar pedido por lá.",
      actor: "owner",
      created_at: iso(6),
    },
    {
      id: "e5",
      project_id: P1,
      sprint_id: null,
      type: "comment",
      title: "Comentário do cliente",
      body: "Dá pra deixar o botão de finalizar compra em verde?",
      actor: "client",
      created_at: iso(5),
    },
    {
      id: "e6",
      project_id: P1,
      sprint_id: null,
      type: "note",
      title: "Resposta do Fellipe",
      body: "Dá sim — já ajustei, entra junto com a sprint 3.",
      actor: "owner",
      created_at: iso(4),
    },
    {
      id: "e7",
      project_id: P1,
      sprint_id: "s3",
      type: "sprint_started",
      title: "Sprint 3 iniciada",
      body: "Integração com a API do Mercado Livre.",
      actor: "owner",
      created_at: iso(1),
    },
    // Thread da Sprint 1 (aprovada): um comentário só — mostra o contador "1".
    {
      id: "ec1",
      project_id: P1,
      sprint_id: "s1",
      type: "comment",
      title: "Comentário do cliente",
      body: "Ficou ótimo o catálogo, muito fácil de cadastrar produto. Obrigado!",
      actor: "client",
      created_at: iso(12),
    },
    // Thread da Sprint 2 (entregue): cliente pergunta, Fellipe responde na sprint.
    {
      id: "ec2",
      project_id: P1,
      sprint_id: "s2",
      type: "comment",
      title: "Comentário do cliente",
      body: "No painel, dá pra ter uma busca de pedido por nome do cliente?",
      actor: "client",
      created_at: iso(5),
    },
    {
      id: "ec3",
      project_id: P1,
      sprint_id: "s2",
      type: "comment",
      title: "Resposta do Fellipe",
      body: "Dá sim — coloco busca por nome e por status do pedido. Entra ainda nesta sprint.",
      actor: "owner",
      created_at: iso(4),
    },
  ];

  return { projects, sprints, events };
}

let state: MockState = seed();

type Listener = () => void;
const listeners = new Set<Listener>();

function emit() {
  for (const fn of listeners) fn();
}

export function mockSubscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function mockListProjects(): SharedProject[] {
  return state.projects.slice();
}

export function mockProject(projectId: string): SharedProject | null {
  return state.projects.find((p) => p.id === projectId) ?? null;
}

export function mockSprints(projectId: string): Sprint[] {
  return state.sprints
    .filter((s) => s.project_id === projectId)
    .sort((a, b) => a.idx - b.idx);
}

export function mockEvents(projectId: string): ProjectEvent[] {
  return state.events
    .filter((e) => e.project_id === projectId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function mockApproveSprint(sprintId: string, userId: string) {
  const sprint = state.sprints.find((s) => s.id === sprintId);
  if (!sprint || sprint.status !== "delivered") return;
  const now = new Date().toISOString();
  state = {
    ...state,
    sprints: state.sprints.map((s) =>
      s.id === sprintId
        ? { ...s, status: "approved", approved_at: now, approved_by: userId }
        : s
    ),
    // No banco real este evento nasce de trigger/Monitor (a RLS só deixa o
    // cliente inserir `comment`). Aqui simulamos pra timeline ficar coerente.
    events: [
      ...state.events,
      {
        id: `e${Date.now()}`,
        project_id: sprint.project_id,
        sprint_id: sprint.id,
        type: "sprint_approved",
        title: `Sprint ${sprint.idx} aprovada por você`,
        body: null,
        actor: "client",
        created_at: now,
      },
    ],
  };
  emit();
}

/** `sprintId` gruda o comentário numa sprint (thread). null = caixa geral. */
export function mockComment(
  projectId: string,
  body: string,
  sprintId: string | null = null
) {
  state = {
    ...state,
    events: [
      ...state.events,
      {
        id: `e${Date.now()}`,
        project_id: projectId,
        sprint_id: sprintId,
        type: "comment",
        title: "Comentário do cliente",
        body,
        actor: "client",
        created_at: new Date().toISOString(),
      },
    ],
  };
  emit();
}
