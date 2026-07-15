/**
 * Avaliações reais de clientes do Fellipe (coletadas do perfil no 99freelas em
 * 2026-07-14). São 10 depoimentos com texto escrito, de uma média de 4,92/5.
 *
 * BILÍNGUE: cada avaliação tem o texto ORIGINAL em português (`text`, `project`)
 * e a tradução em inglês (`text_en`, `project_en`). A home mostra o par conforme
 * o idioma. O original em pt NÃO é editado (é o depoimento real do cliente); o
 * inglês é tradução fiel do mesmo texto.
 */

export type Review = {
  project: string;
  project_en: string;
  text: string;
  text_en: string;
  rating: number; // de 0 a 5
  date: string; // ISO "YYYY-MM-DD"; a home formata por idioma
};

export const REVIEW_SUMMARY = {
  average: 4.92,
  total: 28,
} as const;

export const REVIEWS: Review[] = [
  {
    project: "Automação de fluxo de trabalho para imóveis com Python e Zoho",
    project_en: "Workflow automation for real estate with Python and Zoho",
    text: "Fellipe é muito profissional e mantém a comunicação de forma constante, paciente e colaborativo e esteve disponível para esclarecer dúvidas. Comprometimento com as entregas, flexibilidade para ajustar o escopo à realidade do projeto e boa postura durante toda a execução. Entregou parte importante da estrutura operacional, estabilizando processos e implementando integrações relevantes. Algumas funcionalidades ficaram para uma próxima fase, mas já vou recontratá-lo para evoluirmos",
    text_en: "Fellipe is very professional and keeps communication constant: patient, collaborative, and always available to clear up questions. Commitment to the deliverables, flexibility to adjust the scope to the project's reality, and a great attitude throughout. He delivered an important part of the operational structure, stabilizing processes and implementing relevant integrations. A few features were left for a next phase, but I'll definitely rehire him to keep evolving it.",
    rating: 5,
    date: "2026-05-15",
  },
  {
    project: "Configurar e corrigir mapas do app marketplace (Mapbox/OpenStreetMap)",
    project_en: "Fixing marketplace app maps (Mapbox/OpenStreetMap)",
    text: "O problema deu um pouco de trabalho para ser resolvido, mas ele fez exatamente o que era pra ser feito de uma forma muito melhor e estável. Eu pensei que eu não ia conseguir, mas ele foi lá e se superou no que eu estava esperando. Talvez ele demore um pouco para responder, mas ele trabalha em outros projetos, afinal o cara é bom, mas quando ele pegar para resolver ele vai te escutar com atenção sobre o que você pretende criar.",
    text_en: "The problem took some work to solve, but he did exactly what needed to be done, in a much better and more stable way. I thought I wouldn't manage it, but he went ahead and exceeded what I was expecting. He may take a little while to reply, since he works on other projects (after all, the guy is good), but once he takes it on, he listens carefully to what you want to build.",
    rating: 5,
    date: "2026-05-15",
  },
  {
    project: "Atualização de banco PostgreSQL no Gateway do Power BI",
    project_en: "PostgreSQL database update on the Power BI Gateway",
    text: "Recomendo demais, foi rápido e muito profissional. Pode contratar de olhos fechados, muito profissional",
    text_en: "Highly recommend. Fast and very professional. You can hire him with your eyes closed, very professional.",
    rating: 5,
    date: "2026-05-15",
  },
  {
    project: "Backup de VPS na nuvem e PC",
    project_en: "Cloud VPS and PC backup",
    text: "Alto nível de profissionalismo, conhecimento, proatividade e conduta ética.",
    text_en: "A high level of professionalism, knowledge, proactivity, and ethical conduct.",
    rating: 5,
    date: "2026-05-15",
  },
  {
    project: "Preparar, testar e publicar aplicativo na App Store",
    project_en: "Preparing, testing and publishing an app on the App Store",
    text: "Equipe altamente especializada e comprometida com o resultado e prazos.",
    text_en: "Highly specialized, committed to the result and to the deadlines.",
    rating: 4.8,
    date: "2026-06-15",
  },
  {
    project: "Integração em C# com API do Mercado Livre",
    project_en: "C# integration with the Mercado Livre API",
    text: "Fellipe foi muito rápido em pegar o que precisava ser feito e fez com muita qualidade.",
    text_en: "Fellipe was very quick to grasp what needed to be done and delivered it with great quality.",
    rating: 5,
    date: "2026-04-15",
  },
  {
    project: "Revisão de segurança (pentest) para sistema multi-tenant",
    project_en: "Security review (pentest) for a multi-tenant system",
    text: "Ótimo profissional!",
    text_en: "Great professional!",
    rating: 5,
    date: "2026-06-15",
  },
  {
    project: "Implementação de app nativo, checkout internacional e entregabilidade",
    project_en: "Native app, international checkout and deliverability",
    text: "Muito atencioso aos detalhes.",
    text_en: "Very attentive to detail.",
    rating: 5,
    date: "2026-03-15",
  },
  {
    project: "Finalização de site para psicólogos",
    project_en: "Finishing a website for psychologists",
    text: "Ótimo trabalho e atendimento",
    text_en: "Great work and great service.",
    rating: 5,
    date: "2026-06-15",
  },
  {
    project: "Dashboard em Power BI para case de Analista de BI",
    project_en: "Power BI dashboard for a BI Analyst case",
    text: "Atento aos detalhes.",
    text_en: "Attentive to detail.",
    rating: 5,
    date: "2026-05-15",
  },
];
