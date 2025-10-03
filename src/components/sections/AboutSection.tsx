import { User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

const portfolioData = {
	about: `Software Engineer with a passion for product and proven business acumen.
Seeking to collaborate with dynamic teams to develop high-performance web
applications using JavaScript/TypeScript, React, and Node.js, applying my
experience in scaling a digital business from scratch.`,
	skills: [
		"React / Next.js",
		"TypeScript",
		"Tailwind CSS / shadcn/ui",
		"Node.js / Express",
		"PostgreSQL / Prisma",
		"Docker",
		"Vercel",
		"Git / Github",
		"JWT / HttpOnly / CSRF",
	],
};

const AboutSection = () => (
	<section
		id="about"
		className="py-20 md:py-32 bg-secondary/20 border-t border-b"
	>
		<div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div className="grid md:grid-cols-2 gap-12 items-center">
				<div className="order-2 md:order-1">
					<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 flex items-center">
						<User className="h-8 w-8 mr-3 text-primary" />
						About Me
					</h2>

					<p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
						{portfolioData.about}
					</p>
				</div>
				<div className="order-1 md:order-2">
					<Card className="p-6 bg-background/90 border-primary/20 backdrop-blur-sm">
						<CardHeader>
							<CardTitle className="font-mono text-sm text-primary mb-3">
								{"// Main Stack"}
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							{portfolioData.skills.map((skill, index) => (
								<Badge key={index} variant="secondary">
									{skill}
								</Badge>
							))}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	</section>
);

export default AboutSection;
