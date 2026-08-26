"use client";

// "Disponíveis": o backlog livre — projetos que ninguém pegou (claimed_by null).
//
// O que aparece aqui não é decisão desta tela: a RLS já entrega pro colaborador
// só o backlog livre SEM cliente (projeto com cliente é do dono). A tela só
// separa o que está livre do que já tem dono.

import Link from "next/link";
import { ScopedList } from "../_components/WorkList";

export default function DisponiveisPage() {
  return (
    <ScopedList
      scope="free"
      kicker={"// o que dá pra pegar"}
      title="Disponíveis"
      emptyTitle="Nada livre no momento"
      emptyBody={
        <>
          Quando entrar projeto novo no backlog, ele aparece aqui. O que já está
          com alguém fica no{" "}
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
