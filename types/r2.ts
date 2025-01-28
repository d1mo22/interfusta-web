export interface GetUrlResponse {
	url: string;
}

export interface UploadRequest {
	file: string;
	fileName: string;
	contentType: string;
}

export interface ImageFile {
	id: string;
	url: string;
	fileName: string;
	contentType: string;
}

export interface R2UploadResponse {
	success: boolean;
	filePath: string;
	url: string;
}
