import { type NextRequest, NextResponse } from "next/server";
import { r2Client } from "@/lib/r2Client";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return NextResponse.json(
				{ success: false, error: "No se proporcionó ningún archivo" },
				{ status: 400 },
			);
		}

		const buffer = await file.arrayBuffer();
		const fileName = `${Date.now()}-${file.name}`;

		await r2Client.send(
			new PutObjectCommand({
				Bucket: process.env.R2_BUCKET_NAME,
				Key: fileName,
				Body: Buffer.from(buffer),
				ContentType: file.type,
			}),
		);

		// Generar URL firmada
		const publicUrl = `${process.env.NEXT_PUBLIC_R2_URL}/${fileName}`;
		//const signedUrl = await getSignedImageUrl(fileName);

		return NextResponse.json({
			success: true,
			url: publicUrl,
			fileName,
		});
	} catch (error) {
		console.error("Error detallado:", error);
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Error desconocido",
			},
			{ status: 500 },
		);
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const fileName = searchParams.get("key");

		if (!fileName) {
			return NextResponse.json(
				{ success: false, error: "Nombre de archivo no proporcionado" },
				{ status: 400 },
			);
		}

		await r2Client.send(
			new DeleteObjectCommand({
				Bucket: process.env.R2_BUCKET_NAME,
				Key: fileName,
			}),
		);

		return NextResponse.json({
			success: true,
			message: `Archivo ${fileName} eliminado correctamente`,
		});
	} catch (error) {
		console.error("Error al eliminar archivo:", error);
		return NextResponse.json(
			{
				success: false,
				error:
					error instanceof Error ? error.message : "Error al eliminar archivo",
			},
			{ status: 500 },
		);
	}
}
