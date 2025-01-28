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
