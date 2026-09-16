export function SectionHeading({
	title,
	intro,
	as = "h1",
}: {
	title: React.ReactNode;
	intro?: string;
	as?: "h1" | "h2";
}) {
	const Tag = as;
	return (
		<div className="flex flex-col gap-7">
			<Tag className="h-page">{title}</Tag>
			<span className="rule" />
			{intro && <p className="text-ink-muted text-xl max-w-[58ch]">{intro}</p>}
		</div>
	);
}
