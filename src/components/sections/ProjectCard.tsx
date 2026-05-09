import React from "react";
import Image from "next/image";
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
	imageUrl?: string;
	featured?: boolean;
}

export default function ProjectCard({
	title,
	description,
	tags,
	githubUrl,
	liveUrl,
	imageUrl,
	featured,
}: ProjectCardProps) {
	return (
		<Card
			className={`group relative flex flex-col h-full overflow-hidden transition-all duration-300 ease-out
				hover:-translate-y-1
				hover:shadow-[0_12px_40px_-12px_rgba(168,85,247,0.35),0_0_24px_-8px_rgba(236,72,153,0.25)]
				${featured ? "border-primary/50" : ""}
				${imageUrl ? "pt-0" : ""}`}
		>
			<span
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
				style={{
					background:
						"linear-gradient(to right, var(--color-primary), #a855f7, #ec4899)",
					WebkitMask:
						"linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
					WebkitMaskComposite: "xor",
					maskComposite: "exclude",
					padding: "1.5px",
				}}
			/>
			{imageUrl && (
				<div className="relative aspect-video w-full overflow-hidden bg-secondary/30">
					<Image
						src={imageUrl}
						alt={title}
						fill
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
					/>
					<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
				</div>
			)}
			<CardHeader>
				<div className="flex justify-between items-start gap-2">
					<CardTitle className="text-2xl font-semibold mb-3 transition-colors duration-300 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:via-purple-500 group-hover:to-pink-500 group-hover:bg-clip-text group-hover:text-transparent">
						{title}
					</CardTitle>
					{featured && (
						<Badge
							variant="default"
							className="bg-primary/20 text-primary hover:bg-primary/30 border-none transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-primary/30 group-hover:via-purple-500/30 group-hover:to-pink-500/30"
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
							className="text-xs font-normal transition-colors duration-300 group-hover:border-primary/30 group-hover:bg-secondary/80"
						>
							{tag}
						</Badge>
					))}
				</div>
			</CardContent>
			<CardFooter className="gap-2 pt-2">
				{githubUrl && (
					<Button variant="outline" size="sm" className="flex-1 gap-2" asChild>
						<a href={githubUrl} target="_blank" rel="noopener noreferrer">
							<Github className="h-4 w-4" /> Code
						</a>
					</Button>
				)}
				{liveUrl && liveUrl !== "#" && (
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
