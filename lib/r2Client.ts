import { S3Client } from "@aws-sdk/client-s3";

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
