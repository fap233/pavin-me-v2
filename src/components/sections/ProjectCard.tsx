import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";

interface Project {
	id: number;
	title: string;
	description: string;
	tags: string[];
}

interface ProjectCardProps {
	project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => (
	<Card className="flex flex-col justify-between p-6 h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-primary/30 dark:hover:shadow-primary/50">
		<div>
			<CardHeader>
				<CardTitle className="text-2xl font-semibold mb-3">
					{project.title}
				</CardTitle>

				<CardDescription>{project.description}</CardDescription>
			</CardHeader>
		</div>
		<CardContent className="flex flex-wrap gap-2 mt-4">
			{project.tags.map((tag) => (
				<Badge key={tag}>{tag}</Badge>
			))}
		</CardContent>
	</Card>
);

export default ProjectCard;
