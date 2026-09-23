import { Grain } from "@/components/grain";
import { SectionHeading } from "@/components/section-heading";

export const metadata = {
	title: "Política de Privacitat",
	description:
		"Com Fusteria InterFusta recull, utilitza i protegeix les dades personals que ens facilita a través d'aquest lloc web.",
	alternates: {
		canonical: "/privacitat",
	},
	openGraph: {
		title: "Política de Privacitat",
		description:
			"Com Fusteria InterFusta recull, utilitza i protegeix les dades personals que ens facilita a través d'aquest lloc web.",
		images: [
			{
				url: "/thumbnail.webp",
				width: 1280,
				height: 720,
			},
		],
	},
};

const sections: { title: string; body: React.ReactNode }[] = [
	{
		title: "1. Responsable del tractament",
		body: (
			<>
				<p>
					El responsable del tractament de les dades recollides a través
					d&apos;aquest lloc web és{" "}
					<strong className="text-ink">Fusteria InterFusta SL</strong>{" "}
					(NRT: [PLACEHOLDER: número de registre tributari]), amb domicili a
					Passatge d&apos;Enclar S/N, Santa Coloma, AD500, Andorra.
				</p>
				<p>
					Per a qualsevol qüestió relacionada amb la privacitat de les seves
					dades, pot contactar-nos a{" "}
					<a
						href="mailto:interfusta@interfusta.ad"
						className="text-ink underline underline-offset-2 hover:text-brand-ink"
					>
						interfusta@interfusta.ad
					</a>{" "}
					o al telèfon{" "}
					<a
						href="tel:+376804440"
						className="text-ink underline underline-offset-2 hover:text-brand-ink"
					>
						+376 804 440
					</a>
					.
				</p>
			</>
		),
	},
	{
		title: "2. Quines dades recollim",
		body: (
			<p>
				A través del formulari de contacte d&apos;aquest lloc web li demanem
				el nom, els cognoms, l&apos;adreça electrònica, el telèfon i el
				missatge que vulgui fer-nos arribar. Facilitar aquestes dades és
				voluntari, però necessari perquè puguem respondre a la seva
				consulta.
			</p>
		),
	},
	{
		title: "3. Amb quina finalitat les utilitzem",
		body: (
			<p>
				Utilitzem les dades que ens facilita únicament per a respondre a la
				seva consulta o sol·licitud de pressupost, i per a comunicar-nos amb
				vostè sobre el seu projecte. No utilitzem aquestes dades amb
				finalitats comercials diferents ni les cedim a tercers per a fins
				publicitaris.
			</p>
		),
	},
	{
		title: "4. Base legal",
		body: (
			<p>
				La base legal per al tractament de les seves dades és el
				consentiment que ens dona en omplir i enviar voluntàriament el
				formulari de contacte.
			</p>
		),
	},
	{
		title: "5. Amb qui compartim les dades",
		body: (
			<>
				<p>
					Quan envia el formulari de contacte, les dades es transmeten a
					través del servei extern{" "}
					<a
						href="https://resend.com"
						target="_blank"
						rel="noopener noreferrer"
						className="text-ink underline underline-offset-2 hover:text-brand-ink"
					>
						Resend
					</a>
					, que s&apos;encarrega d&apos;enviar-nos un correu electrònic amb el
					contingut del seu missatge a{" "}
					<span className="font-mono text-[15px]">
						interfusta@interfusta.ad
					</span>
					. Les seves dades no queden emmagatzemades en cap base de dades
					pròpia d&apos;aquest lloc web: viuen únicament en aquest correu
					electrònic i en els registres tècnics del proveïdor d&apos;enviament.
				</p>
				<p>
					Aquest lloc web utilitza també Vercel Analytics i Vercel Speed
					Insights per a entendre, de manera agregada i no identificativa,
					com s&apos;utilitza el lloc web i com podem millorar-ne el
					rendiment.
				</p>
			</>
		),
	},
	{
		title: "6. Durant quant de temps conservem les dades",
		body: (
			<p>
				[PLACEHOLDER: definir i confirmar durant quant de temps es conserven
				els correus electrònics rebuts a través del formulari abans de
				suprimir-los.]
			</p>
		),
	},
	{
		title: "7. Els seus drets",
		body: (
			<p>
				Vostè té dret a accedir a les seves dades personals, rectificar-les
				si són inexactes, sol·licitar-ne la supressió, i oposar-se o
				sol·licitar la limitació del seu tractament. Pot exercir aquests
				drets enviant-nos un correu a{" "}
				<a
					href="mailto:interfusta@interfusta.ad"
					className="text-ink underline underline-offset-2 hover:text-brand-ink"
				>
					interfusta@interfusta.ad
				</a>
				. Si considera que no hem tractat les seves dades correctament,
				també té dret a presentar una reclamació davant l&apos;Agència
				Andorrana de Protecció de Dades (APDA).
			</p>
		),
	},
	{
		title: "8. Canvis en aquesta política",
		body: (
			<p>
				Podem actualitzar aquesta política de privacitat per a reflectir
				canvis en com tractem les seves dades. Li recomanem revisar-la
				periòdicament. Darrera actualització: [PLACEHOLDER: data de
				publicació].
			</p>
		),
	},
];

export default function PrivacyPage() {
	return (
		<div className="bg-paper text-ink">
			<Grain />

			<section className="pt-[104px] pb-[72px]">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20">
					<SectionHeading
						title={
							<>
								Política de <span className="text-brand">privacitat</span>
							</>
						}
						intro="Com recollim, utilitzem i protegim les dades personals que ens facilita a través d'aquest lloc web."
					/>
				</div>
			</section>

			<section className="pb-[136px]">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20">
					<div className="max-w-[70ch] flex flex-col border-b border-hairline">
						{sections.map((section) => (
							<div
								key={section.title}
								className="flex flex-col gap-4 py-10 border-t border-hairline first:border-t-0 first:pt-0"
							>
								<h2 className="h-display text-[24px]">{section.title}</h2>
								<div className="text-ink-muted flex flex-col gap-4 leading-relaxed">
									{section.body}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
