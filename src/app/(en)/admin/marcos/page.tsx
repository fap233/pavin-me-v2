"use client";

// "Marcos" no back-office: o índice read-through de TODOS os projetos.
//
// A tela em si mora no _view.tsx (MarcosView), COMPARTILHADA com
// /projetos/marcos — a mesma lista, a mesma marca. A diferença entre as duas
// rotas não está no componente e sim na RLS: aqui o dono vê tudo; lá o Gustavo
// vê só o dele. Ver _view.tsx e _marcos-data.ts.

import { MarcosView } from "./_view";

export default function MarcosPage() {
  return <MarcosView />;
}
