import React, { useEffect, useState } from "react";
import EditCampaignHeading from "@/components/advance/EditCampaignHeading";
import LargeBtn from "@/components/advance/LargeBtn";
import StackComponent from "@/components/atoms/StackComponent";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import DropDown from "@/components/atoms/inputFields/DropDown";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import CircularLoader from "@/components/atoms/ProgressBarComponent/CircularLoader";
import { ASSET_PATHS } from "@/utils/assets";
const emptyProfile = ASSET_PATHS.svg.emptyProfile;
import { useDispatch, useSelector } from "react-redux";
import "react-image-crop/dist/ReactCrop.css";
import {
  FirstNameField,
  LastNameField,
  StateField,
  CityField,
  EmailField,
  PhoneField,
} from "../userDetails/Fields";
import EmailVerification from "./Fields/EmailVerification";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import ImageUploading from "react-images-uploading";
import ModalComponent from "@/components/molecules/modal/ModalComponent";
import CropImage from "@/components/molecules/uploadImage/CropImage";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import { base64ToFile } from "@/utils/base64ToFile";
import useUploadFileService from "@/hooks/useUploadFileService";
import { PROFILE_IMAGE } from "@/config/constant";
import toast from "react-hot-toast";
import {
  updateCountry,
  updateProfileImage,
} from "@/store/slices/mutateAuthSlice";
import DetailsFormSubmit from "./DetailsFormSubmit";
import ResetPassword from "./ResetPassword";
import SubHeading1 from "@/components/atoms/createCampaigns/SubHeading1";
import Image from "@/components/atoms/imageComponent/Image";

const UserDetails = () => {
  const { isSmallScreen } = useResponsiveScreen();
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const validatePhoneNumber = useSelector(
    (state) => state.meta.validatePhoneNumber,
  );
  const [resetModal, setResetModal] = useState(false);
  const [phoneDisabled, setPhoneDisabled] = useState(true);
  // const profileDetails = useSelector((state) => state.auth?.userDetails);
  const isEmailVerified = useSelector(
    (state) => state.mutateAuth?.isEmailVerified,
  );
  const { uploadFileService } = useUploadFileService();
  const DEFAULT_CROPPING_MODAL_STATE = {
    value: false,
    images: [],
  };
  const hasCroppingFunctionality = true;
  const [openCroppingModal, setOpenCroppingModal] = React.useState(
    DEFAULT_CROPPING_MODAL_STATE,
  );
  const [images, setImages] = useState();
  // const [isShowImage, setIsShowImage] = useState();
  const dispatch = useDispatch();
  const { isMobile } = useResponsiveScreen();

  const [isSubmittionAttempted, setIsSubmittedAttempted] = useState(false);
  const countries = useSelector((state) => state.meta.countries);
  const location_country = useSelector((state) =>
    countries?.find(
      (country) =>
        country._id === state.mutateAuth?.countryId ||
        country._id === state.mutateAuth?.addressDetails?.countryId,
    ),
  ) || {
    currencyUnit: "",
    imageUrl: "",
    isoAlpha2: "",
    isoAlpha3: "",
    isoNumeric: 0,
    mask: "",
    name: "",
    phoneCode: "",
    postalCodeFormat: "",
    postalCodeValidator: "",
    _id: "",
  };
  const phone = useSelector(
    (state) =>
      state.mutateAuth?.phoneNumber || state.auth?.userDetails?.phoneNumber,
  );

  const previousPhone = useSelector(
    (state) => state.auth?.userDetails?.phoneNumber,
  );
  const allValues = useSelector((state) => state.mutateAuth);
  const profileImage = useSelector(
    (state) => state.mutateAuth?.profileImage || null,
  );
  const [imageLink, setImageLink] = useState(profileImage);
  useEffect(() => {
    setImageLink(profileImage);
  }, [profileImage]);

  const updateImages = (imagesArr) => setImages(imagesArr);

  const closeCroppingModal = () =>
    setOpenCroppingModal(DEFAULT_CROPPING_MODAL_STATE);
  const maxNumber = 69;
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

  const onCropSaveHandler = (croppedImage) => {
    const file = base64ToFile(croppedImage, "login_image.png");
    handleUpload([{ data_url: croppedImage, file: file }], closeCroppingModal);
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
        closeCroppingModal,
      ); // Pass ArrayBuffer data for upload
    };
    readerForUpload.readAsArrayBuffer(file);
  };
  const handleUploadClick = async (
    fileExtension,
    fileData,
    closeCroppingModal,
  ) => {
    try {
      const res = await uploadFileService(
        PROFILE_IMAGE,
        fileExtension,
        fileData,
      );
      const { success } = res;
      if (success) {
        setImageLink(res.imageUrl);
        toast.success("Image uploaded successfully");
        setLoader(false);
        dispatch(updateProfileImage(res.imageUrl));
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

  return (
    <>
      <DetailsFormSubmit
        setLoading={setLoading}
        setIsSubmittedAttempted={setIsSubmittedAttempted}
      >
        {resetModal && (
          <ResetPassword
            resetModal={resetModal}
            setResetModal={setResetModal}
          />
        )}
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
        <StackComponent direction="column">
          <EditCampaignHeading>Profile photo</EditCampaignHeading>
          <StackComponent
            spacing={2}
            direction={{ xs: "row", sm: "row" }}
            alignItems="center"
          >
            <Image
              source={imageLink || emptyProfile}
              width={"90px"}
              borderRadius={"12px"}
              objectFit="cover"
              height={"90px"}
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
        <StackComponent direction="column">
          <EditCampaignHeading>Contact information</EditCampaignHeading>
          <StackComponent
            spacing={2}
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
          >
            <FirstNameField isSubmittionAttempted={isSubmittionAttempted} />
            <LastNameField isSubmittionAttempted={isSubmittionAttempted} />
          </StackComponent>
          {countries && countries.length > 0 && location_country ? (
            <StackComponent
              spacing={2}
              direction={{ xs: "column", sm: "row" }}
              alignItems="center"
            >
              <DropDown
                placeholder="Select Country"
                data={countries}
                label="Country*"
                selectedValue={location_country}
                onChange={(newVal) => dispatch(updateCountry(newVal?._id))}
                textColor="#606062"
              />
              <StateField isSubmittionAttempted={isSubmittionAttempted} />
            </StackComponent>
          ) : null}
          <StackComponent
            spacing={2}
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
          >
            <CityField isSubmittionAttempted={isSubmittionAttempted} />
            <EmailField isSubmittionAttempted={isSubmittionAttempted} />
          </StackComponent>
        </StackComponent>
        {!isEmailVerified ? (
          <StackComponent direction="column" sx={{ mt: "16px !important" }}>
            <EmailVerification />
          </StackComponent>
        ) : null}
        <StackComponent direction="column" sx={{ mt: "16px !important" }}>
          <EditCampaignHeading>Phone number</EditCampaignHeading>
          <StackComponent
            spacing={2}
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
          >
            <PhoneField
              previousPhone={previousPhone}
              disabled={phoneDisabled}
            />
            <ButtonComp
              height="40px"
              size="normal"
              onClick={() => setPhoneDisabled(false)}
              sx={{
                width: isSmallScreen ? "100%" : "fit-content",
                marginTop: "15px !important",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "16px",
                whiteSpace: "nowrap",
              }}
              variant="outlined"
            >
              {phone ? "Edit phone number" : "Add phone number"}
            </ButtonComp>
          </StackComponent>
        </StackComponent>
        <StackComponent direction="column" sx={{ mt: "16px !important" }}>
          <EditCampaignHeading>Password</EditCampaignHeading>
          <ButtonComp
            variant="outlined"
            onClick={() => setResetModal(true)}
            sx={{
              width: isSmallScreen ? "100%" : "fit-content",
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: "16px",
            }}
            size="normal"
            height="40px"
          >
            Change password
          </ButtonComp>
        </StackComponent>
        <LargeBtn
          type="submit"
          fullWidth={isMobile ? true : false}
          sx={{ mt: "40px" }}
          disabled={
            loading ||
            !allValues.firstName ||
            !allValues.lastName ||
            !allValues.countryId ||
            !allValues.city ||
            !allValues.state ||
            !allValues.phoneNumber ||
            !validatePhoneNumber
            // (allValues?.phoneNumber?.length < 4 &&
            //   (validatePhoneNumber || // When a new or existing phone number is valid
            //     (allValues?.phoneNumber && validatePhoneNumber !== false)))
          }
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
      </DetailsFormSubmit>
    </>
  );
};

const MemoizedDetails = React.memo(UserDetails);
export default MemoizedDetails;
