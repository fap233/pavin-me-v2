"use client";

// "Meus projetos": o que EU peguei no Quadro (shared_projects.claimed_by).
//
// É o recorte que o colaborador abre pra saber o que está na mão dele, sem o
// backlog inteiro em volta. A tela é de leitura — pegar, largar e mover de
// coluna continua sendo o Quadro.

import Link from "next/link";
import { ScopedList } from "../_components/WorkList";

export default function MeusProjetosPage() {
  return (
    <ScopedList
      scope="mine"
      kicker={"// o que eu peguei"}
      title="Meus projetos"
      emptyTitle="Você não pegou nenhum projeto"
      emptyBody={
        <>
          Escolha um em{" "}
          <Link
            href="/projetos/disponiveis"
            className="text-[var(--brand-via)] underline-offset-4 hover:underline"
          >
            Disponíveis
          </Link>{" "}
          e clique em “Pegar” no{" "}
          <Link
            href="/projetos"
            className="text-[var(--brand-via)] underline-offset-4 hover:underline"
          >
            Quadro
          </Link>
          .
        </>
      }
    />
  );
}
