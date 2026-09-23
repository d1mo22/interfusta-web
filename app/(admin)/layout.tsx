export const metadata = {
	title: "Panell",
	robots: { index: false, follow: false },
};

export default function AdminGroupLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main id="main" className="min-h-[100dvh] bg-paper text-ink">
			{children}
		</main>
	);
}
