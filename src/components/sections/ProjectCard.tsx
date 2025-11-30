import React from "react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from "lucide-react";

interface ProjectCardProps {
	title: string;
	description: string;
	tags: string[];
	githubUrl?: string;
	liveUrl?: string;
	featured?: boolean;
}

export default function ProjectCard({
	title,
	description,
	tags,
	githubUrl,
	liveUrl,
	featured,
}: ProjectCardProps) {
	return (
		<Card
			className={`flex flex-col h-full transition-all hover:shadow-md ${featured ? "border-primary/50" : ""}`}
		>
			<CardHeader>
				<div className="flex justify-between items-start gap-2">
					<CardTitle className="text-2xl font-semibold mb-3">{title}</CardTitle>
					{featured && (
						<Badge
							variant="default"
							className="bg-primary/20 text-primary hover:bg-primary/30 border-none"
						>
							Featured
						</Badge>
					)}
				</div>
			</CardHeader>
			<CardContent className="flex-grow space-y-4">
				<p className="text-muted-foreground text-sm leading-relaxed">
					{description}
				</p>
				<div className="flex flex-wrap gap-2">
					{tags.map((tag) => (
						<Badge
							key={tag}
							variant="secondary"
							className="text-xs font-normal"
						>
							{tag}
						</Badge>
					))}
				</div>
			</CardContent>
			<CardFooter className="gap-2 pt-2">
				{githubUrl && (
					/* MUDANÇA AQUI: de w-full para flex-1 */
					<Button variant="outline" size="sm" className="flex-1 gap-2" asChild>
						<a href={githubUrl} target="_blank" rel="noopener noreferrer">
							<Github className="h-4 w-4" /> Code
						</a>
					</Button>
				)}
				{liveUrl && liveUrl !== "#" && (
					/* MUDANÇA AQUI: de w-full para flex-1 */
					<Button size="sm" className="flex-1 gap-2" asChild>
						<a href={liveUrl} target="_blank" rel="noopener noreferrer">
							<ExternalLink className="h-4 w-4" /> Demo
						</a>
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}
