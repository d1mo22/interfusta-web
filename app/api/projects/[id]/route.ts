import { deleteProject } from "@/app/actions/project";
import { NextResponse } from "next/server";

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const projectId = await Promise.resolve(id);

	if (!projectId) {
		return NextResponse.json(
			{ error: "ID de proyecto no proporcionado" },
			{ status: 400 },
		);
	}

	try {
		const result = await deleteProject(Number(projectId));

		if (result.error) {
			return NextResponse.json({ error: result.error }, { status: 400 });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error en la ruta DELETE:", error);
		return NextResponse.json(
			{ error: "Error interno del servidor" },
			{ status: 500 },
		);
	}
}
