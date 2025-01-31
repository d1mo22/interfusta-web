export function Footer() {
	return (
		<footer className="bg-gray-900 text-white py-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid md:grid-cols-3 gap-8">
					<div>
						<h3 className="text-xl font-bold mb-4">Fusteria InterFusta</h3>
						<p className="text-gray-400">
							Serveis professionals de fusteria amb <br />
							anys d&apos;experiència en la creació de
							<br /> elegants solucions de fusta.
						</p>
					</div>
					<div>
						<h3 className="text-xl font-bold mb-4">Contacte</h3>
						<p className="text-gray-400">
							Email:{" "}
							<a
								href="mailto:interfusta@andorra.ad"
								className="hover:underline"
							>
								interfusta@andorra.ad
							</a>
						</p>
						<p className="text-gray-400">Telèfon: +376 804 440</p>
						<p className="text-gray-400">
							Direcció: Passatge d&apos;Enclar S/N,
							<br /> Santa Coloma, AD500, Andorra
						</p>
					</div>
					<div>
						<h3 className="text-xl font-bold mb-4">Horari</h3>
						<p className="text-gray-400">Dilluns - Divendres: 9:00 - 17:00</p>
						<p className="text-gray-400">Dissabte: 10:00 - 13:00</p>
						<p className="text-gray-400">Diumenge: Tancat</p>
					</div>
				</div>
				<div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
					<p>
						&copy; {new Date().getFullYear()} Interfusta. Tots els drets
						reservats.
					</p>
				</div>
			</div>
		</footer>
	);
}
