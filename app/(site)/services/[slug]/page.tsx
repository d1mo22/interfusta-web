import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Grain } from "@/components/grain";
import { SectionHeading } from "@/components/section-heading";
import { services, type Service } from "@/data/services";

type ProcessStep = {
	title: string;
	text: string;
};

type ServiceContent = {
	extra: string[];
	process: [ProcessStep, ProcessStep, ProcessStep, ProcessStep];
	related: string[];
};

const content: Record<string, ServiceContent> = {
	"mobles-a-mesura": {
		extra: [
			"Un moble a mida permet aprofitar cada racó de l'espai disponible, des d'armaris encastats fins a mobiliari per a zones amb formes irregulars, sense limitar-se a les mides estàndard del mercat.",
			"Aquest servei és habitual quan un espai té una forma poc convencional, quan es vol aprofitar al màxim l'alçada o la fondària disponible, o simplement quan es busca un moble que no es trobi en cap catàleg. El punt de partida no és mai un model tancat, sinó l'espai real i l'ús que se li vol donar.",
		],
		process: [
			{
				title: "Mesurament i visita",
				text: "Ens desplacem al seu espai per prendre mides exactes i conèixer com pensa utilitzar-lo. Així ens assegurem que el moble s'hi adapti a la perfecció, tant en dimensions com en funcionalitat.",
			},
			{
				title: "Disseny",
				text: "Traduïm les seves idees en un disseny concret, ajustant proporcions, acabats i distribució interior. Revisem els detalls amb vostè fins que el resultat respongui exactament al que necessita.",
			},
			{
				title: "Fabricació al taller",
				text: "Cada peça es fabrica al nostre taller, on combinem tècniques artesanals amb maquinària moderna. Aquest procés ens permet controlar la qualitat de cada element abans que surti cap al seu espai.",
			},
			{
				title: "Instal·lació",
				text: "Un cop enllestit, transportem i instal·lem el moble al seu espai. Comprovem que tot encaixi, que portes i calaixos funcionin correctament i que l'acabat sigui l'esperat.",
			},
		],
		related: ["restauracio", "mesuraments-i-planificacio", "lacatge-i-vernissat"],
	},
	"instal-lacio-de-cuines": {
		extra: [
			"En moltes cuines, l'encimera és un dels elements que més defineix l'acabat final. Si busca una superfície llisa i sense junts visibles, treballem també amb Corian per a aquest tipus de projectes.",
			"La instal·lació d'una cuina implica coordinar mobiliari, electrodomèstics i acabats perquè funcionin com un conjunt, no com a peces independents. Per això valorem la distribució de l'espai des del primer moment, abans de fabricar cap element.",
		],
		process: [
			{
				title: "Mesurament i visita",
				text: "Visitem la cuina per prendre mides precises i valorar la ubicació d'electrodomèstics, aigua i electricitat. Aquest pas és clau per evitar descoordinacions un cop comença el muntatge.",
			},
			{
				title: "Disseny",
				text: "Dissenyem la distribució d'armaris, calaixos i zones d'emmagatzematge perquè la cuina sigui còmoda d'utilitzar. Busquem que cada element tingui un lloc coherent amb el dia a dia de la cuina.",
			},
			{
				title: "Fabricació al taller",
				text: "Fabriquem els mòduls i els fronts al taller, ajustant cada peça a les mides exactes de l'espai. Els acabats es preparen seguint el disseny acordat prèviament.",
			},
			{
				title: "Instal·lació",
				text: "Muntem i instal·lem tots els elements a la seva cuina, verificant nivells i encaixos. Comprovem també el funcionament correcte de calaixos, portes i tiradors abans de donar la feina per acabada.",
			},
		],
		related: ["mobles-a-mesura", "disseny-amb-corian", "mesuraments-i-planificacio"],
	},
	"lacatge-i-vernissat": {
		extra: [
			"El lacatge aporta un acabat opac i uniforme, mentre que el vernissat manté visible la veta natural de la fusta. La tècnica es tria en funció de l'estètica que busqui i de la protecció que necessiti la peça davant de l'ús diari, la humitat o la llum.",
			"Aquest servei s'aplica tant a mobles nous com a peces ja existents que necessiten renovar el seu acabat, i sol combinar-se amb altres serveis de fusteria quan una peça requereix, a més, alguna reparació prèvia.",
		],
		process: [
			{
				title: "Mesurament i visita",
				text: "Valorem la peça o superfície al seu espai o al nostre taller per determinar l'estat de la fusta. D'aquí en surt el tipus d'acabat més adequat per a cada cas.",
			},
			{
				title: "Disseny",
				text: "Definim junts el color, la textura i el grau de brillantor del lacat o vernís. Tenim en compte l'ús que se li donarà a la peça i l'ambient on estarà situada.",
			},
			{
				title: "Fabricació al taller",
				text: "Apliquem el procés de lacatge o vernissat al taller, en diverses capes. Cada capa necessita el seu temps d'assecat abans d'aplicar la següent, per aconseguir un acabat uniforme i resistent.",
			},
			{
				title: "Instal·lació",
				text: "Un cop sec l'acabat, retornem i col·loquem la peça al seu lloc, o la lliurem llesta per instal·lar. Revisem que el color i la textura coincideixin amb el que s'havia acordat.",
			},
		],
		related: ["mobles-a-mesura", "restauracio", "finestres-i-balconeres"],
	},
	"disseny-amb-corian": {
		extra: [
			"Corian és una superfície sòlida i no porosa que permet crear peces amb junts pràcticament invisibles, fet que facilita mantenir-la neta. La seva flexibilitat permet donar-li formes corbes i integrar lavabos o aixetes en una mateixa peça contínua, cosa que no sempre és possible amb altres materials.",
			"És una opció habitual per a encimeres de cuina, lavabos de bany i altres superfícies decoratives on es busca un acabat continu, sense les línies de junt típiques d'altres materials.",
		],
		process: [
			{
				title: "Mesurament i visita",
				text: "Prenem mides exactes de l'espai on s'instal·larà la peça de Corian, tenint en compte aixetes, desguassos i altres elements que hi hagin d'encaixar.",
			},
			{
				title: "Disseny",
				text: "Dissenyem la forma, el color i l'acabat de la peça, valorant si necessita junts invisibles, vores arrodonides o elements integrats com un lavabo. Definim tots els detalls abans de tallar el material.",
			},
			{
				title: "Fabricació al taller",
				text: "Tallem i modelem el Corian al taller amb les eines específiques que requereix aquest material. Treballem per aconseguir superfícies contínues, ben segellades i sense porus.",
			},
			{
				title: "Instal·lació",
				text: "Instal·lem la peça al seu espai, segellant els junts perquè quedi una superfície uniforme i fàcil de netejar, i comprovem que encaixi correctament amb aixetes i desguassos.",
			},
		],
		related: ["instal-lacio-de-cuines", "mobles-a-mesura", "lacatge-i-vernissat"],
	},
	"estructures-de-fusta": {
		extra: [
			"Com que es tracta d'elements exposats a la intempèrie, la fusta que s'hi destina rep un tractament protector abans del muntatge, per ajudar-la a resistir millor la humitat i els canvis de temperatura.",
			"Aquest tipus d'estructura permet guanyar un espai exterior aprofitable durant gran part de l'any, ja sigui com a zona d'ombra, com a coberta o com a element que complementa l'arquitectura de la propietat.",
		],
		process: [
			{
				title: "Mesurament i visita",
				text: "Visitem l'espai exterior per avaluar el terreny, l'orientació i les mides disponibles. Aquests factors condicionen directament el tipus d'estructura que té sentit plantejar.",
			},
			{
				title: "Disseny",
				text: "Dissenyem la pèrgola, coberta o element arquitectònic tenint en compte l'ús que se li vol donar. Busquem que s'integri amb la resta de la propietat, tant en forma com en acabat.",
			},
			{
				title: "Fabricació al taller",
				text: "Preparem les peces de fusta al taller, tallant-les i tractant-les segons l'estructura definida. Aquesta preparació prèvia agilitza el muntatge posterior a l'exterior.",
			},
			{
				title: "Instal·lació",
				text: "Muntem l'estructura al seu emplaçament, fixant-la de manera segura al terreny o a la construcció existent. Verifiquem l'estabilitat i l'acabat un cop finalitzat el muntatge.",
			},
		],
		related: ["finestres-i-balconeres", "mesuraments-i-planificacio", "restauracio"],
	},
	restauracio: {
		extra: [
			"Restaurar una peça de fusta permet conservar-ne el valor sentimental o històric, en lloc de substituir-la per una de nova. Sovint es tracta de mobles amb un valor familiar que val la pena mantenir en ús.",
			"L'abast de la restauració varia molt segons l'estat de cada peça: pot anar des d'un simple repintat fins a la reparació d'estructures o elements que ja no funcionen correctament.",
		],
		process: [
			{
				title: "Mesurament i visita",
				text: "Examinem la peça per valorar el seu estat, identificar danys i entendre com estava construïda originalment. Aquest diagnòstic determina l'abast real de la intervenció.",
			},
			{
				title: "Disseny",
				text: "Planifiquem la intervenció necessària, decidint què cal reparar, reforçar o repintar. L'objectiu és conservar el caràcter original de la peça en tot moment.",
			},
			{
				title: "Fabricació al taller",
				text: "Portem la peça al taller, on reparem l'estructura, substituïm les parts malmeses si cal i apliquem l'acabat corresponent. Treballem amb cura per respectar la identitat original del moble.",
			},
			{
				title: "Instal·lació",
				text: "Un cop restaurada, li retornem la peça o la col·loquem de nou al seu espai, comprovant que quedi estable i llesta per tornar-se a utilitzar amb normalitat.",
			},
		],
		related: ["lacatge-i-vernissat", "mobles-a-mesura", "mesuraments-i-planificacio"],
	},
	"mesuraments-i-planificacio": {
		extra: [
			"Una bona planificació inicial permet detectar possibles incompatibilitats abans que la fusta arribi al taller, cosa que estalvia temps i evita haver de refer feina més endavant.",
			"Aquest servei sol ser el punt de partida de qualsevol altre projecte de fusteria: mobles, cuines, estructures o finestres, ja que totes aquestes feines depenen de disposar de mides i condicionants correctes des del principi.",
		],
		process: [
			{
				title: "Mesurament i visita",
				text: "Aquest és el nucli del servei: visitem l'espai, prenem totes les mides necessàries i identifiquem condicionants com preses elèctriques, desguassos o parets no del tot escaires.",
			},
			{
				title: "Disseny",
				text: "Amb les mides recollides, elaborem la planificació detallada del projecte: distribució, encaixos i seqüència de treball. Aquest document és el que guiarà la resta del procés.",
			},
			{
				title: "Fabricació al taller",
				text: "Aquesta planificació es trasllada al taller, on serveix de base perquè cada peça es fabriqui ajustada exactament a l'espai mesurat, sense marges d'error que calgui corregir després.",
			},
			{
				title: "Instal·lació",
				text: "El dia de la instal·lació, seguim el pla definit des de l'inici, cosa que agilitza el muntatge i redueix els ajustos d'última hora sobre el terreny.",
			},
		],
		related: ["mobles-a-mesura", "instal-lacio-de-cuines", "estructures-de-fusta"],
	},
	"finestres-i-balconeres": {
		extra: [
			"Com que es tracta d'elements exteriors, sol aplicar-se un tractament protector abans de la instal·lació, semblant al que utilitzem en el nostre servei de lacatge i vernissat.",
			"Una finestra o balconera de fusta a mida permet ajustar-se a obertures que no segueixen mides estàndard, cosa freqüent en edificis més antics o en reformes on es vol mantenir la coherència amb la resta de la fusteria de l'habitatge.",
		],
		process: [
			{
				title: "Mesurament i visita",
				text: "Prenem les mides exactes dels buits on aniran les finestres o balconeres, tenint en compte l'orientació i les condicions de l'obertura existent.",
			},
			{
				title: "Disseny",
				text: "Definim el tipus d'obertura, el gruix del perfil i l'acabat de la fusta. Busquem coherència amb l'estil de la resta de la fusteria de l'habitatge.",
			},
			{
				title: "Fabricació al taller",
				text: "Fabriquem cada finestra o balconera al taller, ajustant-la amb precisió a les mides preses i aplicant l'acabat escollit abans de traslladar-la a l'obra.",
			},
			{
				title: "Instal·lació",
				text: "Instal·lem les finestres i balconeres al seu emplaçament, comprovant que tanquin correctament i quedin ben segellades davant l'aire i la humitat.",
			},
		],
		related: ["estructures-de-fusta", "lacatge-i-vernissat", "mesuraments-i-planificacio"],
	},
};

export function generateStaticParams() {
	return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const service = services.find((s) => s.slug === slug);

	if (!service) {
		return {};
	}

	return {
		title: service.title,
		description: service.description,
		alternates: {
			canonical: `/services/${service.slug}`,
		},
		openGraph: {
			title: service.title,
			description: service.description,
			images: [
				{
					url: "/thumbnail.webp",
					width: 1280,
					height: 720,
				},
			],
		},
	};
}

export default async function ServiceDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const service = services.find((s) => s.slug === slug);
	const info = content[slug];

	if (!service || !info) {
		notFound();
	}

	const relatedServices = info.related
		.map((relatedSlug) => services.find((s) => s.slug === relatedSlug))
		.filter((s): s is Service => Boolean(s));

	return (
		<div className="bg-paper text-ink">
			<Grain />

			<section className="pt-[104px] pb-[72px]">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20">
					<SectionHeading
						title={<>{service.title}</>}
						intro={service.description}
					/>
				</div>
			</section>

			<section className="relative h-[560px] overflow-hidden">
				<Image
					src={service.imageUrl}
					alt={service.title}
					fill
					priority
					className="object-cover"
					sizes="100vw"
				/>
			</section>

			<section className="pt-28 pb-24">
				<div className="max-w-[1280px] mx-auto px-6 lg:px-20 grid lg:grid-cols-[7fr_5fr] gap-16 items-start">
					<div className="flex flex-col gap-10">
						{info.extra.length > 0 && (
							<div className="flex flex-col gap-5">
								{info.extra.map((paragraph) => (
									<p
										key={paragraph.slice(0, 24)}
										className="text-ink-muted text-lg max-w-[65ch]"
									>
										{paragraph}
									</p>
								))}
							</div>
						)}

						<div className="flex flex-col gap-6">
							<h2 className="h-display text-[30px]">Com treballem</h2>
							<span className="rule" />
							<div className="flex flex-col border-b border-hairline">
								{info.process.map((step, index) => (
									<div
										key={step.title}
										className="grid lg:grid-cols-[80px_1fr] gap-4 py-8 border-t border-hairline items-start"
									>
										<span className="font-mono text-[13px] tracking-[.02em] font-medium text-brand-ink">
											{String(index + 1).padStart(2, "0")}
										</span>
										<div className="flex flex-col gap-2">
											<h3 className="h-display text-[22px]">{step.title}</h3>
											<p className="text-ink-muted max-w-[55ch]">
												{step.text}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="bg-stone p-10 flex flex-col gap-5">
						<h2 className="h-display text-[26px]">
							Parlem del seu projecte
						</h2>
						<p className="text-ink-muted">
							Cada projecte és diferent. Expliqui&apos;ns què necessita i li
							preparem una proposta adaptada al seu espai i al seu pressupost.
						</p>
						<Link
							href="/contact"
							className="btn-press inline-flex h-[54px] items-center justify-center px-[30px] bg-brand text-on-dark text-[17px] font-bold rounded-none hover:bg-brand-deep hover:text-on-dark self-start"
						>
							Demana pressupost
						</Link>
					</div>
				</div>
			</section>

			{relatedServices.length > 0 && (
				<section className="bg-stone py-24">
					<div className="max-w-[1280px] mx-auto px-6 lg:px-20 flex flex-col gap-10">
						<h2 className="h-display text-[30px]">
							Altres serveis relacionats
						</h2>
						<div className="grid md:grid-cols-3 gap-12">
							{relatedServices.map((related) => (
								<Link
									key={related.slug}
									href={`/services/${related.slug}`}
									className="group flex flex-col gap-4"
								>
									<div className="relative aspect-[4/3] w-full overflow-hidden">
										<Image
											src={related.imageUrl}
											alt={related.title}
											fill
											className="object-cover transition-transform duration-200 group-hover:scale-105"
											sizes="(min-width: 768px) 33vw, 100vw"
										/>
									</div>
									<h3 className="h-display text-[22px] group-hover:text-brand-ink transition-colors duration-150">
										{related.title}
									</h3>
									<p className="text-ink-muted text-[15px]">
										{related.description}
									</p>
								</Link>
							))}
						</div>
					</div>
				</section>
			)}
		</div>
	);
}
