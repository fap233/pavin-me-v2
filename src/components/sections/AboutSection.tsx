"use client";

import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

export function AboutSection() {
	const { t } = useLanguage();

	return (
		<section id="about" className="py-20">
			<div className="container mx-auto px-4">
				<div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
					<div className="space-y-6">
						<h2 className="text-3xl font-bold">{t.about.title}</h2>
						<p className="text-muted-foreground leading-relaxed">
							{t.about.description}
						</p>
					</div>

					<div className="grid gap-4">
						{t.about.stats.map((stat: any, index: number) => (
							<Card key={index} className="p-6">
								<p className="text-sm text-muted-foreground mb-1">
									{stat.label}
								</p>
								<p className="text-2xl font-bold">{stat.value}</p>
							</Card>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
