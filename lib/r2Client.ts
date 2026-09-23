import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const r2Client = new S3Client({
	region: "auto",
	endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
	},
});

// export async function getSignedImageUrl(key: string) {
// 	const command = new GetObjectCommand({
// 		Bucket: process.env.R2_BUCKET_NAME,
// 		Key: key,
// 	});
// 	return getSignedUrl(r2Client, command, { expiresIn: 3600 });
// }

export function getPublicUrl(key: string) {
	return `${process.env.R2_URL}/${key}`;
}

// ponytail: best-effort. A failed delete leaves an orphaned file in the bucket
// (cents); failing the save over it would lose the worker's changes.
export async function deleteR2Urls(urls: string[]) {
	const prefix = `${process.env.R2_URL}/`;
	await Promise.allSettled(
		urls
			.filter((u) => u.startsWith(prefix))
			.map((u) =>
				r2Client.send(
					new DeleteObjectCommand({
						Bucket: process.env.R2_BUCKET_NAME,
						Key: u.slice(prefix.length),
					}),
				),
			),
	);
}
