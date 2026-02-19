// import { getPreSignedUrl, uploadFile } from '../api';

import { setCookie } from "cookies-next";
import { getPreSignedUrl, uploadFile } from "../api";

const uploadFileService = async (fileType, fileExtension, binaryImageData) => {
	try {
		const response = await getPreSignedUrl(fileType, fileExtension);

		const preSignedUrlData = response.data?.data;
		const imageUrl = preSignedUrlData?.url.split("?")[0];
		setCookie("imageUrl", imageUrl);

		if (response?.data.success) {
			const result = await uploadFile(
				preSignedUrlData.url,
				binaryImageData,
				fileExtension,
			);
			console.log("result", result);
			return { success: true, imageUrl };
		} else {
			console.error("Error fetching pre-signed URL");
			return { success: false, imageUrl: null };
		}
	} catch (error) {
		console.error("An error occurred:", error);
		return { success: false, imageUrl: null };
	}
};

export default uploadFileService;
