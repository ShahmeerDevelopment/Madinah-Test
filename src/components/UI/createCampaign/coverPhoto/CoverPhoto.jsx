"use client";

import React, { useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import axios from "axios";

import {
  campaignStepperIncrementHandler,
  createCampaignHandler,
  // resetActiveStepper,
  // resetCampaignValues,
} from "@/store/slices/campaignSlice";

import ImageModal from "./ImageModal";
import { createCampaign } from "@/api";
import { theme } from "@/config/customTheme";
// import AIIcon from "@/assets/iconComponent/AIIcon";
// import HoverableAIButton from "./HoverableAIButton";
import { WrapperLayout } from "../createCampaign.style";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import useUploadFileService from "@/hooks/useUploadFileService";
import {
  CAMPAIGN_COVER_IMAGE,
  IMAGE_COMPRESSION_OPTIONS,
  // RANDOM_URL,
} from "@/config/constant";
import StackComponent from "@/components/atoms/StackComponent";
import BackButton from "@/components/atoms/createCampaigns/BackButton";
// import IconButtonComp from "@/components/atoms/buttonComponent/IconButtonComp";
import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
import PopOver from "@/components/molecules/popOver/PopOver";
import SubHeading1 from "@/components/atoms/createCampaigns/SubHeading1";
import UploadImage from "@/components/molecules/uploadImage/UploadImage";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import TextFieldComp from "@/components/atoms/inputFields/TextFieldComp";
import AttachLink from "@/assets/iconComponent/AttachLink";
import SubmitButton from "@/components/atoms/createCampaigns/SubmitButton";
import ModalComponent from "@/components/molecules/modal/ModalComponent";
import SocialShare from "@/components/molecules/socialShare/SocialShare";
import AiImageModal from "./AiImageModal";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";

const CoverPhoto = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { isSmallScreen } = useResponsiveScreen();
  const { uploadFileService } = useUploadFileService();

  const campaignValues = useSelector((state) => state.campaign.campaignValues);
  const randomToken = useSelector(
    (state) => state.campaign?.campaignValues?.randomToken
  );
  const { youtubeLink, imageUrl } = useSelector(
    (state) => state.campaign.campaignValues
  );

  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [openAiModal, setOpenAiModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowImage, setIsShowImage] = useState(false);
  const [isShowButton, setIsShowButton] = useState(false);
  const [customUrlData] = useState(null);
  const [imageLink, setImageLink] = useState(imageUrl || "");
  const [images, setImages] = useState([{ data_url: imageUrl }]);
  const [socialShareModal, setSocialShareModal] = useState(false);
  const [aiGeneratedImage, setAiGeneratedImage] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (imageUrl === "" || imageUrl === undefined || !imageUrl) {
      setIsShowImage(false);
    } else {
      setIsShowImage(true);
      setImageLink(imageUrl);
    }
  }, [imageUrl]);

  // const youtubeLinkSchema = Yup.object().shape({
  //   youtubeLink: Yup.string().matches(
  //     /^(https?:\/\/)?(www\.)?(youtube\.com\/(c\/)?[a-zA-Z0-9_-]+|youtu\.be\/[a-zA-Z0-9_-]+)(\S+)?$/,
  //     "Incorrect data",
  //   ),
  // });
  const youtubeLinkSchema = Yup.object().shape({
    youtubeLink: Yup.string().matches(
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(c\/)?[a-zA-Z0-9_-]+|youtu\.be\/[a-zA-Z0-9_-]+|vimeo\.com\/[a-zA-Z0-9_-]+)(\S+)?$/,
      "Please enter a valid YouTube or Vimeo URL"
    ),
  });

  const formik = useFormik({
    initialValues: {
      youtubeLink: youtubeLink,
    },
    validationSchema: youtubeLinkSchema,
    onSubmit: (value) => {
      setIsLoading(true);
      const urlType = value?.youtubeLink?.includes("vimeo")
        ? "vimeo"
        : "youtube";
      const {
        zipCode,
        fundraisingFor,
        imageUrl,
        currency,
        startingGoal,
        countryId,
        categoryId,
        charityOrganizationId,
        title,
        story,
        campaignTitle,
        campaignStory,
      } = campaignValues;

      const fundraising = { currencyUnit: currency, amount: startingGoal };

      const charityId =
        fundraisingFor === "charity-organization"
          ? charityOrganizationId?._id || charityOrganizationId
          : null;

      const payload = {
        countryId: countryId,
        categoryId: categoryId,
        campaignTitle: title || campaignTitle,
        coverImageUrl: imageUrl,
        zipCode: zipCode,
        fundraisingGoal: fundraising,
        fundraiser: fundraisingFor,
        charityOrganizationId: charityId,
        campaignStory: story || campaignStory,
        videoLinks: value.youtubeLink
          ? [{ url: value.youtubeLink, type: urlType }]
          : [],
        isRecurringDonation: campaignValues.isRecurringDonation,
        isZakatEligible: campaignValues.isZakatEligible,
        isOneTimeDonation: campaignValues.isOneTimeDonation,
        isTaxDeductable: campaignValues.isTaxDeductable,
        isDraft: true,
        draftId: campaignValues.draftId,
      };
      createCampaignAsyncHandler(payload);
    },
  });

  const createCampaignAsyncHandler = (payload) => {
    createCampaign(payload)
      .then((res) => {
        const result = res?.data;
        if (result.success) {
          dispatch(createCampaignHandler(payload));
          dispatch(campaignStepperIncrementHandler(1));
          // toast.success("Campaign Created Successfully");
          // startTransition(() => {
          //   router.push("/campaign-success");
          // });
          // setIsLoading(false);
          // setCustomUrlData(`${RANDOM_URL}${result.data.randomToken}`);

          // setTimeout(() => {
          //   dispatch(resetCampaignValues());
          //   dispatch(resetActiveStepper(0));
          // }, 5000);
        } else {
          toast.error(result.message);
          setIsLoading(false);
        }
      })
      .catch(() => {
        toast.error("Something went wrong");
        setIsLoading(false);
      });
  };

  const handleUpload = async (croppedImage, closeCroppingModal) => {
    setLoader(true);
    const file = croppedImage[0].file;
    try {
      const compressedFile = await imageCompression(
        file,
        IMAGE_COMPRESSION_OPTIONS
      );
      const readerForUpload = new FileReader();
      readerForUpload.onloadend = () => {
        const lastDotIndex = compressedFile.name.lastIndexOf(".");
        const fileExtension = compressedFile.name.substring(lastDotIndex + 1);
        handleUploadClick(
          fileExtension,
          readerForUpload.result,
          closeCroppingModal
        );
      };
      readerForUpload.readAsArrayBuffer(compressedFile);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleUploadClick = async (
    fileExtension,
    fileData,
    closeCroppingModal
  ) => {
    try {
      const res = await uploadFileService(
        CAMPAIGN_COVER_IMAGE,
        fileExtension,
        fileData
      );

      const { success, imageUrl } = res;
      if (success) {
        setImageLink(imageUrl);
        setIsShowImage(true);
        toast.success("Image uploaded successfully");
        const {
          zipCode,
          linkType,
          fundraisingFor,
          youtubeLink,
          // imageUrl,
          currency,
          startingGoal,
          countryId,
          categoryId,
          charityOrganizationId,
        } = campaignValues;

        const charityId =
          fundraisingFor === "charity-organization"
            ? charityOrganizationId?._id || charityOrganizationId
            : null;

        const fundraising = { currencyUnit: currency, amount: startingGoal };

        const campaignPayload = {
          countryId: countryId,
          categoryId: categoryId,
          campaignTitle: campaignValues.title,
          coverImageUrl: imageUrl,
          zipCode: zipCode,
          fundraisingGoal: fundraising,
          fundraiser: fundraisingFor,
          charityOrganizationId: charityId,
          campaignStory: campaignValues.story,
          videoLinks: youtubeLink ? [{ url: youtubeLink, type: linkType }] : [],
          isRecurringDonation: campaignValues.isRecurringDonation,
          isZakatEligible: campaignValues.isZakatEligible,
          isOneTimeDonation: campaignValues.isOneTimeDonation,
          isDraft: true,
          draftId: campaignValues.draftId,
        };

        const res = await saveDraft(campaignPayload);
        const response = res?.data?.data;
        const urlType = formik.values?.youtubeLink?.includes("vimeo")
          ? "vimeo"
          : "youtube";

        const payload = {
          youtubeLink: formik.values.youtubeLink,
          imageUrl: imageUrl,
          linkType: formik.values.youtubeLink ? urlType : "",
          draftId: response._id,
        };
        dispatch(createCampaignHandler(payload));
        setLoader(false);
        setIsShowButton(true);
        closeCroppingModal();
      } else {
        console.error(res);
        toast.error("Error uploading file");
        setLoader(false);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  const saveDraft = async (campaignPayload) => {
    return await createCampaign(campaignPayload);
  };

  const handleAiImage = async (prompt) => {
    const toastId = toast.loading("Generating image from AI...");
    // const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    const endpoint = "https://api.openai.com/v1/images/generations"; // Adjust the endpoint as needed

    try {
      const response = await axios.post(
        endpoint,
        {
          model: "dall-e-3", // Use the appropriate model for image generation
          prompt: prompt,
          n: 1,
          size: "1792x1024",
          response_format: "b64_json",
        }
        // {
        //   headers: {
        //     Authorization: `Bearer ${apiKey}`,
        //     "Content-Type": "application/json",
        //   },
        // },
      );
      const b64Json = response.data.data[0].b64_json;
      const imageSrc = `data:image/png;base64,${b64Json}`;

      setAiGeneratedImage(imageSrc);
      toast.dismiss(toastId);
      toast.success("Image generated.");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Error generating image:", error);
    }
  };

  const isContinueEnabled =
    (formik.values.youtubeLink && !formik.errors.youtubeLink) ||
    isShowButton ||
    (imageLink !== null && imageLink !== undefined && imageLink !== "");

  return (
    <>
      <WrapperLayout isFullHeight={true}>
        <StackComponent
          direction={"row"}
          justifyContent="space-between"
          alignItems="center"
        >
          <BackButton />
          <StackComponent direction="row" spacing={2}>
            {/* {isSmallScreen ? (
              <IconButtonComp>
                <AIIcon onClick={() => setOpenAiModal(true)} />
              </IconButtonComp>
            ) : (
              <HoverableAIButton onClick={() => setOpenAiModal(true)} />
            )} */}
            <ButtonComp
              onClick={() => {
                router.push(`/preview?id=${randomToken}`);
              }}
              variant="outlined"
              size={"small"}
            >
              Preview
            </ButtonComp>
          </StackComponent>
        </StackComponent>
        <form onSubmit={formik.handleSubmit}>
          <BoxComponent sx={{ mt: { xs: 3, sm: 5 } }}>
            <BoxComponent
              sx={{
                display: "flex",
                justifyContent: { xs: "space-between", sm: "flex-start" },
                alignItems: "flex-start",
                gap: 1,
              }}
            >
              <CampaignHeading marginBottom={0} mobileMarginBottom={0}>
                Add a cover photo or video
              </CampaignHeading>
              <PopOver
                maxWidth={isSmallScreen ? "300px" : "500px"}
                popoverContent="Choose an image that: Choose an image that clearly reflects your campaign's purpose and its benefits to donors. Feature happy individuals, preferably children if applicable, interacting with what your campaign offers. This showcases the positive impact of donations. Subjects should face the camera for a more personal connection. Include subtle branding, like a logo on uniforms, to keep the focus on your message. Opt for a high-resolution, visually appealing image with little to no text. Ensure the image is appropriate for all audiences and aligns with community guidelines."
              />
            </BoxComponent>

            <SubHeading1 sx={{ color: theme.palette.primary.gray }}>
              Using a bright and clear photo helps people connect to your
              fundraiser right away
            </SubHeading1>
          </BoxComponent>
          <BoxComponent
            sx={{
              height: "253px",
              width: "100%",
              borderRadius: "8px",
              padding: { xs: "10px 5px 10px 5px", sm: "32px 48px" },
              border: `2px dashed ${theme.palette.primary.lightGray}`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 5,
            }}
          >
            <UploadImage
              setImages={setImages}
              images={images}
              // setIsShowImage={setIsShowImage}
              isShowImage={isShowImage}
              onUploadHandler={handleUpload}
              loader={loader}
              imageLink={imageLink}
              setOpen={setOpen}
              aiGeneratedImage={aiGeneratedImage}
            />
          </BoxComponent>
          <Divider
            textAlign="center"
            sx={{ width: "100%", mt: 2.5, mb: 1.5, fontSize: "14px" }}
          >
            or
          </Divider>
          <TextFieldComp
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachLink />
                </InputAdornment>
              ),
            }}
            label={"Youtube link (Optional)"}
            fontColor={theme.palette.primary.gray}
            placeholder={"Enter Youtube link"}
            name="youtubeLink"
            fullWidth
            value={formik.values.youtubeLink}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.youtubeLink && Boolean(formik.errors.youtubeLink)
            }
            helperText={formik.touched.youtubeLink && formik.errors.youtubeLink}
          />
          <SubmitButton
            sx={{ marginTop: "24px" }}
            withSticky={false}
            type="submit"
            submitCampaign
            isContinueButtonDisabled={
              Object.keys(formik.errors).length > 0 ||
              !isContinueEnabled ||
              isLoading
            }
          >
            {isLoading ? "Verifying..." : "Continue"}
          </SubmitButton>
        </form>
        {open && (
          <ModalComponent
            width={"480px"}
            padding={("26px", "36px")}
            open={open}
            onClose={() => setOpen(false)}
            containerStyleOverrides={{
              padding: { xs: "40px 16px", sm: "auto" },
            }}
          >
            <ImageModal setOpen={setOpen} />
          </ModalComponent>
        )}
      </WrapperLayout>

      {socialShareModal && (
        <ModalComponent
          width={600}
          open={socialShareModal}
          onClose={() => setSocialShareModal(false)}
        >
          <SocialShare
            setSocialShareModal={setSocialShareModal}
            customUrlData={customUrlData}
          />
        </ModalComponent>
      )}
      {openAiModal && (
        <ModalComponent
          open={openAiModal}
          onClose={() => setOpenAiModal(false)}
          width={"612px"}
          padding={"48px 32px"}
          responsivePadding={"40px 16px 56px 16px"}
          containerStyleOverrides={{
            maxHeight: "92vh",
            overflowY: "auto",
            "::-webkit-scrollbar": {
              width: "0px",
              background: "transparent",
            },
            "::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "::-webkit-scrollbar-thumb": {
              background: "transparent",
            },
          }}
        >
          <AiImageModal
            setOpenAiModal={setOpenAiModal}
            promptHandler={handleAiImage}
          />
        </ModalComponent>
      )}
    </>
  );
};

CoverPhoto.propTypes = {};

export default CoverPhoto;
