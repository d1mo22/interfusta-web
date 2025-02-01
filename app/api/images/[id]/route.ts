import { type NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const imageId = Number.parseInt(params.id);

		await sql`DELETE FROM image WHERE id = ${imageId}`;

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error al eliminar imagen:", error);
		return NextResponse.json(
			{ success: false, error: "Error al eliminar imagen" },
			{ status: 500 },
		);
	}
}

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const fileName = searchParams.get("key");

		if (!fileName) {
			return NextResponse.json(
				{ success: false, error: "Nombre de archivo no proporcionado" },
				{ status: 400 },
			);
		}

		const publicUrl = `${process.env.R2_URL}/${fileName}`;

		return NextResponse.json({
			success: true,
			url: publicUrl,
		});
	} catch (error) {
		console.error("Error al obtener archivo: ", error);
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Error desconocido",
			},
			{ status: 500 },
		);
	}
}
