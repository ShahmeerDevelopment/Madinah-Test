import React, { useEffect, useState, useRef } from "react";
import DonationFormSubmit from "./DonationFormSubmit";
import StackComponent from "@/components/atoms/StackComponent";
import EditCampaignHeading from "@/components/advance/EditCampaignHeading";
import {
    CharitableOrganizationNameField,
    CharityRegistrationNumberField,
    CityField,
    CountryNameField,
    FullNameField,
    StateField,
    StreetAddress2Field,
    StreetAddressField,
    ZipField,
} from "./Fields";
import Image from "@/components/atoms/imageComponent/Image";
import { useSelector } from "react-redux";
import ImageUploading from "react-images-uploading";
import emptyProfile from "@/assets/svg/emptyProfile.svg";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import SubHeading1 from "@/components/atoms/createCampaigns/SubHeading1";
import ModalComponent from "@/components/molecules/modal/ModalComponent";
import CropImage from "@/components/molecules/uploadImage/CropImage";
import { base64ToFile } from "@/utils/base64ToFile";
import { PROFILE_IMAGE } from "@/config/constant";
import toast from "react-hot-toast";
import uploadFileService from "@/utils/uploadFileService";
import LargeBtn from "@/components/advance/LargeBtn";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import CircularLoader from "@/components/atoms/ProgressBarComponent/CircularLoader";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const DonationReceiptInfo = () => {
    const { isMobile } = useResponsiveScreen();
    const hasCroppingFunctionality = true;
    const DEFAULT_CROPPING_MODAL_STATE = {
        value: false,
        images: [],
    };
    const [loading, setLoading] = useState(false);
    const [receiptModalOpen, setReceiptModalOpen] = useState(false);
    const [receiptHtml, setReceiptHtml] = useState("");
    const receiptRef = useRef(null);

    const maxNumber = 69;

    const [loader, setLoader] = useState(false);

    const [openCroppingModal, setOpenCroppingModal] = React.useState(
        DEFAULT_CROPPING_MODAL_STATE
    );
    const companyLogo = useSelector(
        (state) => state.mutateAuth?.profileImage || null
    );
    const companySignature = useSelector(
        (state) => state.mutateAuth?.signatureImage || null
    );

    const [companySignatureLink, setCompanySignatureLink] =
        useState(companySignature);
    const [images, setImages] = useState();

    useEffect(() => {
        setCompanySignatureLink(companySignature);
    }, [companySignature]);

    const updateImages = (imagesArr) => setImages(imagesArr);

    const closeCroppingModal = () =>
        setOpenCroppingModal(DEFAULT_CROPPING_MODAL_STATE);

    const onChange = (imageList) => {
        // setIsShowImage(true);
        if (hasCroppingFunctionality) {
            setOpenCroppingModal({
                value: true,
                images: imageList,
            });
        } else {
            updateImages(imageList);
        }
    };

    const handleUploadClick = async (
        fileExtension,
        fileData,
        closeCroppingModal
    ) => {
        try {
            const res = await uploadFileService(
                PROFILE_IMAGE,
                fileExtension,
                fileData
            );
            const { success } = res;
            if (success) {
                setCompanySignatureLink(res.imageUrl);
                toast.success("Image uploaded successfully");
                setLoader(false);
                // dispatch(updateProfileImage(res.imageUrl));
                // setIsShowButton(true);
                closeCroppingModal();
            } else {
                toast.error("Error uploading file");
                setLoader(false);
            }
        } catch (error) {
            console.error("An unexpected error occurred:", error);
        }
    };

    const handleUpload = (croppedImage, closeCroppingModal) => {
        setLoader(true);
        const file = croppedImage[0].file;
        const readerForUpload = new FileReader();
        readerForUpload.onloadend = () => {
            const lastDotIndex = file.name.lastIndexOf(".");
            const fileExtension = file.name.substring(lastDotIndex + 1);
            handleUploadClick(
                fileExtension,
                readerForUpload.result,
                closeCroppingModal
            ); // Pass ArrayBuffer data for upload
        };
        readerForUpload.readAsArrayBuffer(file);
    };

    const onCropSaveHandler = (croppedImage) => {
        const file = base64ToFile(croppedImage, "login_image.png");
        handleUpload([{ data_url: croppedImage, file: file }], closeCroppingModal);
    };

    const handleSeeReceiptPreview = async () => {
        try {
            const response = await fetch("/receipt-template.html");
            const html = await response.text();
            setReceiptHtml(html);
            setReceiptModalOpen(true);
        } catch (error) {
            console.error("Error loading receipt preview:", error);
            toast.error("Failed to load receipt preview");
        }
    };

    const handleDownloadPDF = async () => {
        if (!receiptRef.current) return;

        try {
            toast.loading("Generating PDF...");
            
            const canvas = await html2canvas(receiptRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff",
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save("donation-receipt.pdf");
            
            toast.dismiss();
            toast.success("PDF downloaded successfully");
        } catch (error) {
            console.error("Error generating PDF:", error);
            toast.dismiss();
            toast.error("Failed to generate PDF");
        }
    };

    return (
        <>
            <DonationFormSubmit
                setLoading={setLoading}
            // setIsSubmittedAttempted={setIsSubmittedAttempted}
            >
                <ModalComponent
                    open={openCroppingModal.value}
                    onClose={() => closeCroppingModal()}
                >
                    <CropImage
                        image={openCroppingModal.images[0]?.data_url}
                        // userProfileImage
                        saveLabel={loader ? "Saving..." : "Save"}
                        isLoading={loader}
                        onCropSave={onCropSaveHandler}
                    />
                </ModalComponent>
                <ModalComponent
                    open={receiptModalOpen}
                    onClose={() => setReceiptModalOpen(false)}
                >
                    <BoxComponent
                        sx={{
                            width: { xs: "90vw", sm: "80vw", md: "650px" },
                            maxHeight: "90vh",
                            overflow: "auto",
                            bgcolor: "background.paper",
                            borderRadius: "8px",
                            "&::-webkit-scrollbar": {
                                display: "none",
                            },
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                        }}
                    >
                        <TypographyComp sx={{ textAlign: "center", fontWeight: 500, fontSize: "32px", lineHeight: "38px", color: "#090909", marginTop: "25px" }}>Preview</TypographyComp>
                        <div ref={receiptRef} style={{ marginTop: "25px" }} dangerouslySetInnerHTML={{ __html: receiptHtml }} />
                        <BoxComponent sx={{ display: "flex", gap: "15px", justifyContent: "center", marginTop: "25px", marginBottom: "25px" }}>
                            <ButtonComp variant="contained" onClick={handleDownloadPDF}>Download</ButtonComp>
                            <ButtonComp variant="outlined" onClick={() => setReceiptModalOpen(false)}>Close</ButtonComp>
                        </BoxComponent>
                    </BoxComponent>
                </ModalComponent>
                <StackComponent direction="column">
                    <EditCampaignHeading>Organization Details</EditCampaignHeading>
                    <StackComponent
                        spacing={2}
                        direction={{ xs: "column", sm: "row" }}
                        alignItems="center"
                    >
                        <CountryNameField />
                        <CharitableOrganizationNameField />
                    </StackComponent>
                    <StackComponent
                        spacing={2}
                        direction={{ xs: "column", sm: "row" }}
                        alignItems="center"
                    >
                        <CharityRegistrationNumberField />
                        <StreetAddressField />
                    </StackComponent>
                    <StackComponent
                        spacing={2}
                        direction={{ xs: "column", sm: "row" }}
                        alignItems="center"
                    >
                        <StreetAddress2Field />
                        <CityField />
                    </StackComponent>
                    <StackComponent>
                        <StateField />
                        <ZipField />
                    </StackComponent>
                </StackComponent>
                <StackComponent direction="column">
                    <EditCampaignHeading>Company logo</EditCampaignHeading>
                    <StackComponent spacing={2} direction="column" alignItems="center">
                        <Image
                            source={companyLogo || emptyProfile}
                            width={"300px"}
                            borderRadius={"12px"}
                            objectFit="cover"
                            height={"300px"}
                            alt="Profile Image"
                        // style={{ objectFit: "cover" }}
                        />
                    </StackComponent>
                </StackComponent>
                <StackComponent direction="column">
                    <EditCampaignHeading>
                        Signature of Authorized Representative
                    </EditCampaignHeading>
                    <StackComponent direction="column" spacing={2}>
                        <FullNameField />
                    </StackComponent>
                    <StackComponent
                        spacing={2}
                        direction={{ xs: "column", sm: "column" }}
                        alignItems="center"
                    >
                        <Image
                            source={companySignatureLink || emptyProfile}
                            width={"300px"}
                            borderRadius={"12px"}
                            objectFit="cover"
                            height={"300px"}
                            alt="Profile Image"
                        // style={{ objectFit: "cover" }}
                        />
                        <ImageUploading
                            multiple={false}
                            value={images}
                            onChange={onChange}
                            maxNumber={maxNumber}
                            dataURLKey="data_url"
                        >
                            {({ onImageUpload, dragProps, errors }) => (
                                <BoxComponent
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-start",
                                    }}
                                    {...dragProps}
                                >
                                    <ButtonComp
                                        variant="outlined"
                                        sx={{
                                            width: "fit-content",
                                            fontWeight: 500,
                                            fontSize: "14px",
                                            lineHeight: "16px",
                                        }}
                                        onClick={onImageUpload}
                                        size="normal"
                                        height="40px"
                                    >
                                        Add photo
                                    </ButtonComp>
                                    {errors && (
                                        <div>
                                            {errors.acceptType && (
                                                <SubHeading1 sx={{ color: "red", mt: 1 }}>
                                                    Your selected file type is not allow
                                                </SubHeading1>
                                            )}
                                        </div>
                                    )}
                                </BoxComponent>
                            )}
                        </ImageUploading>
                    </StackComponent>
                </StackComponent>
                <StackComponent direction="row">
                    <LargeBtn
                        variant="outlined"
                        fullWidth={isMobile ? true : false}
                        sx={{ mt: "40px", width: "fit-content" }}
                        onClick={handleSeeReceiptPreview}
                    >
                        See receipt preview
                    </LargeBtn>
                    <LargeBtn
                        type="submit"
                        fullWidth={isMobile ? true : false}
                        sx={{ mt: "40px" }}
                    >
                        {loading ? (
                            <StackComponent alignItems="center" component="span">
                                <CircularLoader color="white" size="20px" />
                                <TypographyComp>Saving</TypographyComp>
                            </StackComponent>
                        ) : (
                            "Save"
                        )}
                    </LargeBtn>
                </StackComponent>
            </DonationFormSubmit>
        </>
    );
};

const MemoizedDonation = React.memo(DonationReceiptInfo);
export default MemoizedDonation;
