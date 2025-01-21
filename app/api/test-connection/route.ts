import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		if (!process.env.DATABASE_URL) {
			throw new Error("DATABASE_URL no está definida");
		}

		const sql = neon(process.env.DATABASE_URL);
		const result = await sql`SELECT NOW()`;

		return NextResponse.json({
			success: true,
			timestamp: result[0].now,
		});
	} catch (error: unknown) {
		return NextResponse.json({
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
}
