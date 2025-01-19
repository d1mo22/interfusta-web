export function Footer() {
	return (
		<footer className="bg-gray-900 text-white py-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid md:grid-cols-3 gap-8">
					<div>
						<h3 className="text-xl font-bold mb-4">Fusteria InterFusta</h3>
						<p className="text-gray-400">
							Servicios profesionales de carpintería con <br />
							años de experiencia en la creación de
							<br /> hermosas soluciones de madera.
						</p>
					</div>
					<div>
						<h3 className="text-xl font-bold mb-4">Contacto</h3>
						<p className="text-gray-400">Email: interfusta@andorra.ad</p>
						<p className="text-gray-400">Teléfono: +376 804 440</p>
						<p className="text-gray-400">
							Dirección: Andorra la Vella, Andorra
						</p>
					</div>
					<div>
						<h3 className="text-xl font-bold mb-4">Horario</h3>
						<p className="text-gray-400">Lunes - Viernes: 9:00 - 17:00</p>
						<p className="text-gray-400">Sábado: 10:00 - 13:00</p>
						<p className="text-gray-400">Domingo: Cerrado</p>
					</div>
				</div>
				<div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
					<p>
						&copy; {new Date().getFullYear()} Interfusta. Todos los derechos
						reservados.
					</p>
				</div>
			</div>
		</footer>
	);
}
