import { getPreSignedUrl, uploadFile } from "../api";

const useUploadFileService = () => {
	const uploadFileService = async (
		fileType,
		fileExtension,
		binaryImageData,
	) => {
		try {
			const response = await getPreSignedUrl(fileType, fileExtension);
			const preSignedUrlData = response.data?.data;
			const imageUrl = preSignedUrlData?.url.split("?")[0];

			if (response?.data.success) {
				await uploadFile(preSignedUrlData.url, binaryImageData, fileExtension);

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

	return { uploadFileService };
};

export default useUploadFileService;
