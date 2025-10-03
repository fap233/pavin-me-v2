import { Briefcase, Github } from "lucide-react";
import ProjectCard from "./ProjectCard";
import { Button } from "../ui/button";

const portfolioData = {
	projects: [
		{
			id: 1,
			title: "pavin-me-v2",
			description:
				"My personal portfolio built with the latest web technologies, including TypeScript and the components library shadcn/ui.",
			tags: ["Next.js", "TypeScript", "shadcn/ui", "Tailwind CSS"],
		},
		{
			id: 2,
			title: "To-do DApp",
			description:
				"A decentralized to-do application that allows users to manage their tasks securely on the blockchain showing my habilities with smart contracts creation with Solidity.",
			tags: [
				"React",
				"TypeScript",
				"Solidity",
				"Ethereum",
				"Smart contracts",
				"Blockchain",
			],
		},
		{
			id: 3,
			title: "HydraSMM",
			description:
				"A SMM e-commerce plataform using my experiences on SEO, Social Media and Web Development",
			tags: [
				"E-commerce",
				"Next.js",
				"TypeScript",
				"Tailwind CSS",
				"Node.js",
				"Express",
				"PostgreSQL",
				"Prisma",
				"JWT",
				"HttpOnly",
				"CSRF",
			],
		},
	],
	contact: {
		github: "https://github.com/fap233",
	},
};

const ProjectsSection = () => (
	<section id="projects" className="py-20 md-py32 bg-background">
		<div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-12 text-center flex items-center justify-center">
				<Briefcase className="h-8 w-8 mr-3 text-primary" />
				Featured Projects
			</h2>

			<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
				{portfolioData.projects.map((project) => (
					<ProjectCard key={project.id} project={project} />
				))}
			</div>
			<div className="mt-16 text-center">
				<a
					href={portfolioData.contact.github}
					target="_blank"
					rel="noopener noreferrer"
				>
					<Button
						variant="outline"
						size="lg"
						className="text-lg hover:bg-primary/10 transition-colors"
					>
						View More on GitHub
						<Github className="ml-2 h-5 w-5" />
					</Button>
				</a>
			</div>
		</div>
	</section>
);

export default ProjectsSection;
