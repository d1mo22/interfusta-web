// Renders "Els nostres *serveis*" with the starred words in the brand colour,
// so each language can put the accent wherever it falls in its own sentence.
// Every message has at most one *…* pair (the drafting script enforces the
// Catalan markers); anything after a second "*" is shown as typed.
export function Accent({ text }: { text: string }) {
	const [before, accent, ...rest] = text.split("*");
	if (accent === undefined) return <>{before}</>;
	return (
		<>
			{before}
			<span className="text-brand">{accent}</span>
			{rest.join("*")}
		</>
	);
}
