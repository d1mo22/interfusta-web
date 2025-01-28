import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client } from "./r2Client";

export async function uploadToR2(file: File): Promise<string> {
	const filename = `${Date.now()}-${file.name}`;

	await r2Client.send(
		new PutObjectCommand({
			Bucket: "interfusta-web",
			Key: filename,
			Body: file,
			ContentType: file.type,
		}),
	);

	return `${process.env.NEXT_PUBLIC_R2_URL}/${filename}`;
}
