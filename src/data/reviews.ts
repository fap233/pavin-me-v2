/**
 * Avaliações reais do perfil do Fellipe no 99freelas.
 * Fonte: https://www.99freelas.com.br/user/fellipe-augusto-pavin
 * Coletadas em 2026-07-14. 4,92/5 de média em 28 avaliações; estas são as 10 que
 * têm comentário escrito (as demais são só nota, sem texto). NÃO edite o texto —
 * são depoimentos de clientes reais; qualquer alteração descaracteriza a prova social.
 */

export type Review = {
  project: string;
  text: string;
  rating: number; // de 0 a 5
  date: string; // rótulo curto, ex: "jun. 2026"
};

export const REVIEW_SUMMARY = {
  average: 4.92,
  total: 28,
  profileUrl: "https://www.99freelas.com.br/user/fellipe-augusto-pavin",
} as const;

export const REVIEWS: Review[] = [
  {
    project: "Configurar automação de fluxo de trabalho para imóveis com Python e Zoho",
    text: "Fellipe é muito profissional e mantém a comunicação de forma constante, paciente e colaborativo e esteve disponível para esclarecer dúvidas. Comprometimento com as entregas, flexibilidade para ajustar o escopo à realidade do projeto e boa postura durante toda a execução. Entregou parte importante da estrutura operacional, estabilizando processos e implementando integrações relevantes. Algumas funcionalidades ficaram para uma próxima fase, mas já vou recontratá-lo para evoluirmos",
    rating: 5,
    date: "mai. 2026",
  },
  {
    project: "Configurar e corrigir mapas do app marketplace (Mapbox/OpenStreetMap)",
    text: "O problema deu um pouco de trabalho para ser resolvido, mas ele fez exatamente o que era pra ser feito de uma forma muito melhor e estável. Eu pensei que eu não ia conseguir, mas ele foi lá e se superou no que eu estava esperando. Talvez ele demore um pouco para responder, mas ele trabalha em outros projetos, afinal o cara é bom, mas quando ele pegar para resolver ele vai te escutar com atenção sobre o que você pretende criar.",
    rating: 5,
    date: "mai. 2026",
  },
  {
    project: "Agendar atualização de banco PostgreSQL no Gateway do Power BI",
    text: "Recomendo demais, foi rápido e muito profissional. Pode contratar de olhos fechados, muito profissional",
    rating: 5,
    date: "mai. 2026",
  },
  {
    project: "Back de VPS na nuvem e PC",
    text: "Alto nível de profissionalismo, conhecimento, proatividade e conduta ética.",
    rating: 5,
    date: "mai. 2026",
  },
  {
    project: "Preparar, testar e publicar aplicativo na App Store",
    text: "Equipe altamente especializada e comprometida com o resultado e prazos.",
    rating: 4.8,
    date: "jun. 2026",
  },
  {
    project: "Integração em C# com API do Mercado Livre",
    text: "Fellipe foi muito rápido em pegar o que precisava ser feito e fez com muita qualidade.",
    rating: 5,
    date: "abr. 2026",
  },
  {
    project: "Revisão de segurança (pentest) para sistema multi-tenant",
    text: "Ótimo profissional!",
    rating: 5,
    date: "jun. 2026",
  },
  {
    project: "Implementação de app nativo, checkout internacional e entregabilidade",
    text: "Muito atencioso aos detalhes.",
    rating: 5,
    date: "mar. 2026",
  },
  {
    project: "Finalização de site para psicólogos",
    text: "Ótimo trabalho e atendimento",
    rating: 5,
    date: "jun. 2026",
  },
  {
    project: "Dashboard em Power BI para case de Analista de BI",
    text: "Atento aos detalhes.",
    rating: 5,
    date: "mai. 2026",
  },
];
