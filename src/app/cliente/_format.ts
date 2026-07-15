// Datas em português, sem biblioteca.
//
// Coluna `date` do Postgres vem como "YYYY-MM-DD". `new Date("2026-08-28")`
// interpreta como UTC e, no fuso do Brasil (UTC-3), volta um dia. Por isso todo
// parse de data pura força T00:00:00 local.

export function parseYmd(ymd: string | null): Date | null {
  if (!ymd) return null;
  const d = new Date(`${ymd.slice(0, 10)}T00:00:00`);
  return isNaN(d.getTime()) ? null : d;
}

export function parseIso(iso: string | null): Date | null {
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}

/** "28 de agosto de 2026" */
export function longDate(value: string | null): string | null {
  const d = value && value.length <= 10 ? parseYmd(value) : parseIso(value);
  if (!d) return null;
  return d.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** "13/07" */
export function shortDate(iso: string | null): string {
  const d = parseIso(iso);
  if (!d) return "--/--";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

/** "13/07 às 09:42" */
export function dateTime(iso: string | null): string {
  const d = parseIso(iso);
  if (!d) return "";
  return (
    d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) +
    " às " +
    d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  );
}

/** "15/08" a partir de "2026-08-15" (data pura, sem fuso). */
export function shortYmd(ymd: string | null): string {
  const d = parseYmd(ymd);
  if (!d) return "";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

/** Dias até a data (negativo = atrasado). */
export function daysUntil(ymd: string | null): number | null {
  const d = parseYmd(ymd);
  if (!d) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((d.getTime() - today.getTime()) / 86_400_000);
}

/** Texto humano do prazo: "faltam 46 dias", "entrega hoje", "atrasado 3 dias". */
export function deadlineLabel(ymd: string | null): string | null {
  const days = daysUntil(ymd);
  if (days === null) return null;
  if (days < 0) return `atrasado ${Math.abs(days)} ${plural(Math.abs(days), "dia", "dias")}`;
  if (days === 0) return "entrega hoje";
  if (days === 1) return "falta 1 dia";
  return `faltam ${days} dias`;
}

function plural(n: number, one: string, many: string): string {
  return n === 1 ? one : many;
}

/** "agora há pouco" / "há 3 dias" — usado no topo da timeline. */
export function relative(iso: string | null): string {
  const d = parseIso(iso);
  if (!d) return "";
  const mins = Math.round((Date.now() - d.getTime()) / 60_000);
  if (mins < 2) return "agora há pouco";
  if (mins < 60) return `há ${mins} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `há ${hours} ${plural(hours, "hora", "horas")}`;
  const days = Math.round(hours / 24);
  if (days < 30) return `há ${days} ${plural(days, "dia", "dias")}`;
  const months = Math.round(days / 30);
  return `há ${months} ${plural(months, "mês", "meses")}`;
}
