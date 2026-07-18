"use client";

// O Kanban dentro do back-office.
//
// Antes a navbar do /admin mandava o Fellipe pra FORA, pro /projetos — e ele
// caía numa tela com outro topo, outro "Sair" e nenhum caminho de volta. O
// /projetos continua existindo (é a porta do colaborador); o que mudou é que o
// dono não precisa mais sair de casa pra ver o backlog.
//
// É o MESMO componente que o /projetos renderiza, não uma cópia: só a casca
// muda. E não há portão aqui — quem fecha a porta é o AdminShell, antes desta
// página existir na árvore.

import { KanbanBoard } from "../../projetos/_components/KanbanBoard";
import { useStaff } from "../_components/AdminShell";

export default function AdminKanbanPage() {
  const staff = useStaff();

  // Sem `onSignOut`: o "Sair" já está na casca do back-office, ali em cima.
  return (
    <KanbanBoard me={{ id: staff.id, email: staff.email }} role={staff.role} />
  );
}
