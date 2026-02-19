import React, { useCallback, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import * as Yup from "yup";
import Image from "next/image";

import { updateUpSellData } from "../../../../../api";
import CurrencyField from "../addUpsells/CurrencyField";
import { theme } from "../../../../../config/customTheme";
import { getVideoThumbnail } from "../../../../../utils/helpers";
import StackComponent from "../../../../../components/atoms/StackComponent";
import { addUpSellLevel } from "../../../../../store/slices/mutateCampaignSlice";
import ButtonComp from "../../../../../components/atoms/buttonComponent/ButtonComp";
import BoxComponent from "../../../../../components/atoms/boxComponent/BoxComponent";
import TextFieldComp from "../../../../../components/atoms/inputFields/TextFieldComp";
import ModalComponent from "../../../../../components/molecules/modal/ModalComponent";
import TypographyComp from "../../../../../components/atoms/typography/TypographyComp";
import CircularLoader from "../../../../../components/atoms/ProgressBarComponent/CircularLoader";
import ImageAndVideoUploader from "../../../../../components/templates/imageAndVideoUploader/ImageAndVideoUploader";
import { DONATION_METHOD_OPTION } from "@/config/constant";
import RadioButtonGroups from "@/components/molecules/radionButtonGroups/RadioButtonGroups";

export const boxStyles = {
  height: "223px",
  width: "100%",
  borderRadius: "8px",
  padding: { xs: "10px 5px 10px 5px", sm: "32px 48px" },
  border: `2px dashed ${theme.palette.primary.lightGray}`,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  mt: "24px",
  mb: "18px",
};

const LeftCard = React.memo(
  ({ item, setShowEditUpsellCard, onImage, onPreviousValues }) => {
    const dispatch = useDispatch();

    const [thumbnailUrl, setThumbnailUrl] = useState();

    const id = useSelector((state) => state.mutateCampaign.id);
    const { allowRecurringDonations, allowOneTimeDonations } = useSelector(
      (state) => state.mutateCampaign,
    );
    const campaignDetails = useSelector((state) => state.mutateCampaign);

    const isMonthly =
      item?.isRecurring === true ? "recurringDonation" : "oneTimeDonation";

    const [donationOption, setDonationOption] = useState(isMonthly);
    const [openImageModal, setOpenImageModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [specialDays, setSpecialDays] = useState(
      item?.recurringType || "monthly",
    );

    // Get recurring end date from recurlyPlans based on recurringType
    const getRecurringEndDate = () => {
      if (item?.recurlyPlans && item?.recurringType) {
        const matchingPlan = item.recurlyPlans.find(
          (plan) => plan.type === item.recurringType,
        );
        return matchingPlan?.recurringEndDate || null;
      }
      return null;
    };

    const [specialDaysEndDate, setSpecialDaysEndDate] = useState(
      getRecurringEndDate(),
    );
    const [amount, setAmount] = useState({
      amount: item?.amount || 0,
      currency: "",
    });

    const [imageOrVideoUrl, setImageOrVideoUrl] = useState(
      item?.imageUrl || null,
    );

    useEffect(() => {
      onImage(imageOrVideoUrl);
    }, [imageOrVideoUrl, onImage]);

    const addUpsellsSchema = Yup.object().shape({
      title: Yup.string().required("Required field"),
      description:
        item.type !== "orderBump" &&
        item.type !== "downSell" &&
        Yup.string().required("Required field"),
      yesButtonText:
        item.type !== "orderBump" && Yup.string().required("Required field"),
      noButtonText:
        item.type !== "orderBump" && Yup.string().required("Required field"),
    });

    const formik = useFormik({
      initialValues: {
        title: item.title || "",
        subTitle: item?.subTitle || "",
        description: item?.description || "",
        yesButtonText: item?.yesButtonText || "",
        noButtonText: item.noButtonText || "",
        isRecurring: donationOption === "recurringDonation" ? true : false,
      },
      validationSchema: addUpsellsSchema,
      onSubmit: (values) => {
        setIsLoading(true);
        let payload = {
          title: values.title,
          subTitle: values.subTitle,
          amount: amount.amount === "" ? 0 : Number(amount.amount),
          sellConfigId: item._id,
          isRecurring: donationOption === "recurringDonation" ? true : false,
          recurringType:
            donationOption === "oneTimeDonation" ? null : specialDays,
          recurringEndDate:
            donationOption === "oneTimeDonation" ? null : specialDaysEndDate,
        };

        if (item.type !== "orderBump") {
          payload = {
            ...payload,
            description: values.description,
            imageUrl: imageOrVideoUrl,
            yesButtonText: values.yesButtonText,
            noButtonText: values.noButtonText,
            // isRecurring: donationOption === "recurringDonation" ? true : false,
          };
        }

        updateUpSellData(id, payload)
          .then((res) => {
            if (res.data.message === "Success" && res.data.success === true) {
              toast.success("Added successfully");
              dispatch(addUpSellLevel(res.data.data.sellConfigs));
              setShowEditUpsellCard(false);
              return res;
            }
            toast.error(res.data.message);
          })
          .catch((err) => {
            console.error(err);
          })
          .finally(() => {
            setIsLoading(false);
          });
      },
    });

    useEffect(() => {
      onPreviousValues(formik.values);
    }, [formik, onPreviousValues]);

    const onUploadButton = useCallback(() => setOpenImageModal(true), []);

    const youtubeUrlHandler = useCallback((url) => {
      const videoUrl = url;
      if (videoUrl) {
        setImageOrVideoUrl(videoUrl);
      }
    }, []);

    const handleCurrencyChange = useCallback((newCurrencyData) => {
      setAmount((prevAmount) => ({
        ...newCurrencyData,
        // If the new amount is empty, keep the previous amount value
        amount:
          newCurrencyData.amount === ""
            ? prevAmount.amount
            : newCurrencyData.amount,
      }));
    }, []);

    const handleSpecialDaysClick = (value, endDate) => {
      setSpecialDays(value || "monthly");
      setSpecialDaysEndDate(endDate);
    };

    useEffect(() => {
      const fetchThumbnail = async (imageOrVideoUrl) => {
        if (
          imageOrVideoUrl.includes("youtube.com") ||
          imageOrVideoUrl.includes("youtu.be") ||
          imageOrVideoUrl.includes("vimeo.com")
        ) {
          const thumbnail = await getVideoThumbnail(imageOrVideoUrl);
          setThumbnailUrl(thumbnail);
        } else {
          setThumbnailUrl(imageOrVideoUrl);
        }
      };

      {
        item.type !== "orderBump" && fetchThumbnail(imageOrVideoUrl);
      }
    }, [imageOrVideoUrl]);

    return (
      <>
        {item.type !== "orderBump" ? (
          <BoxComponent>
            <BoxComponent sx={boxStyles}>
              <Image
                src={thumbnailUrl}
                alt="cover_image"
                width={217}
                height={137}
                style={{
                  maxWidth: "217px",
                  minWidth: "217px",
                  maxHeight: "137px",
                  borderRadius: "16px",
                  marginBottom: "10px",
                  objectFit: "cover",
                }}
              />
              <ButtonComp
                fontSize={"14px"}
                fontWeight={500}
                lineHeight={"16px"}
                padding="10px 19px"
                size="normal"
                height="36px"
                // sx={{ width: '161px' }}
                variant="outlined"
                onClick={onUploadButton}
              >
                Choose another photo
              </ButtonComp>
            </BoxComponent>
          </BoxComponent>
        ) : null}
        <form onSubmit={formik.handleSubmit}>
          {item.type !== "orderBump" && allowRecurringDonations ? (
            <BoxComponent
              sx={{
                mt: 2,
                mb: 2,
                display: "flex",
                flexDirection: { xs: "column", sm: "column" },
                alignItems: { xs: "flex-start", sm: "flex-start" },
                gap: { xs: 0, sm: 2 },
              }}
            >
              {DONATION_METHOD_OPTION.map((item) => (
                <RadioButtonGroups
                  key={item.id}
                  label=""
                  options={item}
                  value={donationOption}
                  onChange={(e) => setDonationOption(e)}
                  specialDays={specialDays}
                  handleSpecialDaysClick={handleSpecialDaysClick}
                  specialDaysEndDate={specialDaysEndDate}
                  automaticDonationDays={campaignDetails?.automaticDonationDays}
                  isEdit
                />
              ))}
            </BoxComponent>
          ) : null}
          <TextFieldComp
            id="title"
            name="title"
            label={"Title"}
            autoComplete="title"
            placeholder={"Enter title here"}
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
            fullWidth
          />
          <TextFieldComp
            id="subTitle"
            name="subTitle"
            label={"Subtitle"}
            autoComplete="subTitle"
            placeholder={"Enter subTitle here"}
            value={formik.values.subTitle}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.subTitle && Boolean(formik.errors.subTitle)}
            helperText={formik.touched.subTitle && formik.errors.subTitle}
            fullWidth
          />
          {item.type !== "orderBump" && item.type !== "downSell" ? (
            <TextFieldComp
              multiline
              id="description"
              name="description"
              label={"Description"}
              autoComplete="description"
              // placeholder={'Enter description here'}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
              fullWidth
            />
          ) : null}
          {item.type !== "orderBump" ? (
            <TextFieldComp
              id="yesButtonText"
              name="yesButtonText"
              label={"Yes button text"}
              autoComplete="yesButtonText"
              placeholder={"Enter yes button text here"}
              value={formik.values.yesButtonText}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.yesButtonText &&
                Boolean(formik.errors.yesButtonText)
              }
              helperText={
                formik.touched.yesButtonText && formik.errors.yesButtonText
              }
              fullWidth
            />
          ) : null}
          {item.type !== "orderBump" ? (
            <TextFieldComp
              id="noButtonText"
              name="noButtonText"
              label={"No button text"}
              autoComplete="noButtonText"
              placeholder={"Enter no button text here"}
              value={formik.values.noButtonText}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.noButtonText &&
                Boolean(formik.errors.noButtonText)
              }
              helperText={
                formik.touched.noButtonText && formik.errors.noButtonText
              }
              fullWidth
            />
          ) : null}
          <CurrencyField
            onValueChange={handleCurrencyChange}
            amount={item.amount}
          />
          <BoxComponent
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: { xs: "space-between", sm: "flex-start" },
              gap: 4,
              mt: "24px",
            }}
          >
            <ButtonComp
              height="46px"
              size="normal"
              type="submit"
              sx={{ width: { xs: "100%", sm: "135px" } }}
            >
              {isLoading ? (
                <StackComponent alignItems="center" component="span">
                  <CircularLoader color="white" size="20px" />
                  <TypographyComp>Updating...</TypographyComp>
                </StackComponent>
              ) : (
                "Update"
              )}
            </ButtonComp>
            <ButtonComp
              height="46px"
              onClick={() => setShowEditUpsellCard(false)}
              size="normal"
              variant="outlined"
              sx={{
                width: { xs: "100%", sm: "135px" },
              }}
            >
              Cancel
            </ButtonComp>
          </BoxComponent>
        </form>
        {openImageModal && (
          <ModalComponent
            width={422}
            padding={"48px 32px"}
            open={openImageModal}
            onClose={() => setOpenImageModal(false)}
          >
            <ImageAndVideoUploader
              setOpenImageModal={(choice) => setOpenImageModal(choice)}
              setCoverImageUrlData={(image) => setImageOrVideoUrl(image)}
              updateVideo={youtubeUrlHandler}
              heading="Upload Image or photo"
            />
          </ModalComponent>
        )}
      </>
    );
  },
);

LeftCard.displayName = "LeftCard";
LeftCard.propTypes = {
  item: PropTypes.any,
  setShowEditUpsellCard: PropTypes.any,
  onImage: PropTypes.func,
  onPreviousValues: PropTypes.func,
};
export default LeftCard;
