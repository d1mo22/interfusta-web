"use server";
import { Resend } from "resend";
import { ContactNotification } from "@/components/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function createContact(formData: FormData) {
	try {
		// Guardar en DB
		const nom = formData.get("firstName");
		const cognom = formData.get("lastName");
		const email = formData.get("email");
		const telefon = formData.get("phone");
		const missatge = formData.get("message");

		// Intentar enviar email
		const { error } = await resend.emails.send({
			from: "Interfusta-Web <no-reply@interfustaandorra.com>",
			to: "interfusta@interfusta.ad",
			subject: `Nova consulta de ${nom} ${cognom}`,
			react: ContactNotification({
				firstName: nom as string,
				lastName: cognom as string,
				email: email as string,
				phone: telefon as string,
				message: missatge as string,
			}),
		});

		if (error) {
			console.error("Error Resend:", error);
			throw new Error(error.message);
		}

		return { success: true };
	} catch (error) {
		console.error("Error completo:", error);
		return { error: "Error al processar la consulta" };
	}
}
