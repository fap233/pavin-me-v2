import { Github, Linkedin, Mail, Send } from "lucide-react"; // Removidos Instagram e Twitter
import { Card } from "../ui/card";
import { Button } from "../ui/button";

const contactData = {
	email: "fellipe306@gmail.com",
	linkedin: "https://linkedin.com/in/fellipe-pavin/",
	github: "https://github.com/fap233",
	instagram: "https://instagram.com/pavinf.a",
	x: "https://x.com/pavinfellipe",
};

const socialLinks = [
	{
		href: contactData.linkedin,
		label: "LinkedIn",
		icon: <Linkedin className="h-6 w-6" />,
	},
	{
		href: contactData.github,
		label: "GitHub",
		icon: <Github className="h-6 w-6" />,
	},
	{
		href: `mailto:${contactData.email}`,
		label: "Email",
		icon: <Mail className="h-6 w-6" />,
	},
];

const ContactSection = () => {
	return (
		<section id="contact" className="py-20 md:py-32 bg-background border-t">
			<div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="max-w-2xl mx-auto text-center">
					<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 flex items-center justify-center">
						<Send className="h-8 w-8 mr-3 text-primary" />
						Get in Touch
					</h2>
					<p className="text-lg md:text-xl text-muted-foreground mb-12">
						Feel free to reach out for collaborations, inquiries, or just to say
						hello!
					</p>

					<Card className="p-8">
						<div className="flex justify-center flex-wrap gap-4">
							{socialLinks.map((link) => (
								<a
									key={link.label}
									href={link.href}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={`Connect via ${link.label}`}
								>
									<Button
										variant="outline"
										size="lg"
										className="h-14 sm:h-auto sm:2-auto sm:px-6"
									>
										{link.icon}
										<span className="hidden sm:inline sm:ml-2">
											{link.label}
										</span>
									</Button>
								</a>
							))}
						</div>
					</Card>
				</div>
			</div>
		</section>
	);
};

export default ContactSection;
