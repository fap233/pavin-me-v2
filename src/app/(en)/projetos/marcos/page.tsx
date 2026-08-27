"use client";

// "Marcos" na porta do colaborador: a MESMA tela do back-office (MarcosView),
// só que aqui dentro da casca do /projetos.
//
// O ponto de existir esta rota: o Gustavo não precisa mais passar pelo /admin
// (onde é barrado) pra ver e marcar os marcos dele. A RLS já recorta —
// loadMilestones/toggleMilestone só devolvem e só deixam marcar o que ele pode
// trabalhar (can_work_project) — então o mesmo componente serve às duas cascas
// sem uma segunda regra pra discordar da primeira. Ver ../../admin/marcos/_view.

import { MarcosView } from "../../admin/marcos/_view";

export default function MarcosColaboradorPage() {
  return <MarcosView />;
}
