"use client";

import React, { useEffect, useRef, useState } from "react";
import CampaignHeading from "../../../../../components/atoms/createCampaigns/CampaignHeading";
import StackComponent from "../../../../../components/atoms/StackComponent";
import { useFormik } from "formik";
import { getSaveCardFormValidationSchema } from "../formValidation";
import AuthModelForm from "../../../../../components/advance/AuthModelForm/AuthModelForm";
import GridComp from "../../../../../components/atoms/GridComp/GridComp";
import {
  CVVField,
  CardNumberField,
  ExpiryDateField,
  NameOnCardField,
} from "./field";
import PropTypes from "prop-types";
import ButtonComp from "../../../../../components/atoms/buttonComponent/ButtonComp";
import BoxComponent from "../../../../../components/atoms/boxComponent/BoxComponent";
import CircularLoader from "../../../../../components/atoms/ProgressBarComponent/CircularLoader";
import TypographyComp from "../../../../../components/atoms/typography/TypographyComp";
import axios from "axios";
import toast from "react-hot-toast";
import { postCardDetails } from "../../../../../api";
import useResponsiveScreen from "../../../../../hooks/useResponsiveScreen";
import { updatePaymentCard } from "../../../../../api/update-api-service";
import ThreeDSecureAuthentication from "@/components/advance/ThreeDSecureAuthentication";
// import { useTheme } from '@mui/material/styles';
// import { useMediaQuery } from '@mui/material';

const AddandEditModel = React.memo(
  ({ isEdit, setOpenEditModal, cardData, refetch }) => {
    const { isSmallScreen } = useResponsiveScreen();
    const recurlyKey = process.env.NEXT_PUBLIC_RECURLY_PUBLIC_KEY;
    const [is3d, setIs3d] = useState(false);
    const [is3dLoading, setIs3dLoading] = useState(false);
    const [is3dDisplayMode, setIs3dDisplayMode] = useState("inline"); // 'inline' or 'modal'

    const monthString = cardData.expMonth?.toString().padStart(2, "0");

    const modifiedYear = Number(cardData.expYear?.toString().slice(2));

    const [isLoading, setIsLoading] = useState(false);

    const scrollContainerRef = useRef(null);

    const containerStyles = isSmallScreen
      ? {
          overflowY: "auto",
          maxHeight: "calc(100vh - 200px)",
          width: "auto",
          boxSizing: "border-box",
          overflowX: "hidden",
          // eslint-disable-next-line no-mixed-spaces-and-tabs
        }
      : {};
    const formik = useFormik({
      initialValues: {
        cardNumber: isEdit ? "************" + cardData.lastFour : "",
        expiryDate: isEdit ? monthString + "/" + modifiedYear : "",
        cvv: isEdit ? cardData?.cvv : "",
        nameOnCard: isEdit
          ? cardData?.firstName + " " + cardData?.lastName
          : "",
      },
      validationSchema: getSaveCardFormValidationSchema(isEdit),
      onSubmit: async () => {
        setIsLoading(true);
        if (!isEdit) {
          const parts = formik?.values?.expiryDate?.split("/");
          const month = parts[0];
          const year = parts[1];
          const nameParts = formik.values.nameOnCard.split(" "); // Splits the string into an array based on the space

          const firstName = nameParts[0];
          const lastName =
            nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
          const publicApi = process.env.NEXT_PUBLIC_RECURLY_PUBLIC_KEY;
          const data = new URLSearchParams({
            first_name: firstName,
            last_name: lastName,
            number: formik.values.cardNumber,
            month: month,
            year: year,
            cvv: formik.values.cvv,

            version: "3.1.0",
            key: publicApi,
          }).toString();
          const queryString = data.toString();
          const tokenData = await axios({
            method: "get",
            url: `https://api.recurly.com/js/v1/token?${queryString}`,
          });
          if (tokenData?.data?.error) {
            toast.error(tokenData?.data?.error?.message);
          }
          if (tokenData.status === 200 && tokenData.data.type) {
            const token = tokenData.data.id;
            postCreditCard(token);
          }
        } else {
          const nameParts = formik.values.nameOnCard.split(" "); // Splits the string into an array based on the space

          const firstName = nameParts[0];
          const lastName =
            nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
          const payload = {
            firstName: firstName,
            lastName: lastName,
            // street: formik.values?.addressField,
            // city: formik.values?.cityField,
            // postalCode: formik.values.postalCode,
          };
          updatePaymentCard(payload)
            .then((res) => {
              const result = res?.data;
              if (result.success) {
                toast.success(result.message);
                refetch();
              } else {
                toast.error(result.message);
              }
            })
            .catch(() => {
              toast.error("Something went wrong");
            });
          setOpenEditModal(false);
        }
        setIsLoading(false);
      },
    });

    const postCreditCard = (token, postalCode) => {
      const payload = {
        cardToken: token,
        postalCode: postalCode,
        // country: country.isoAlpha2,
      };

      postCardDetails(payload)
        .then((res) => {
          const result = res?.data;

          if (result.success) {
            // toast.success(result.message);

            toast.success("Card details added successfully");
            setOpenEditModal(false);
            refetch();
            // postPaymentApi(null, token);
          } else if (result.data.is3dSecureAuthenticationRequired) {
            setIs3dLoading(true);
            if (window.recurly) {
              window.recurly.configure(recurlyKey);
              const risk = window.recurly.Risk();
              setIs3d(true);
              // if (typeof window !== "undefined") {
              //   scrollToComponent();
              // }
              const threeDSecure = risk.ThreeDSecure({
                actionTokenId: result.data.token,
              });
              threeDSecure.attach(document.querySelector("#my-container"));
              const loadingToast = toast.loading("Saving your card...");
              threeDSecure.on("ready", () => {
                setIs3dLoading(false);
                const container = document.querySelector("#my-container");
                const iframe = container?.querySelector("iframe");

                // If no direct iframe after ready event, it's probably using a modal
                if (!iframe) {
                  setIs3dDisplayMode("modal");
                }
              });
              threeDSecure.on("error", (err) => {
                setIs3d(false);
                toast.dismiss(loadingToast);
                setIs3dLoading(false);
                threeDSecure.remove(document.querySelector("#my-container"));
                toast.error(err.message);
                // display an error message to your user requesting they retry
                // or use a different payment method
              });

              threeDSecure.on("token", (newToken) => {
                payload.previousCardToken = token;
                payload.cardToken = newToken.id;
                // payload.previousTransactionId = result.data.transactionId;
                postCardDetails(payload).then((res) => {
                  setIs3d(false);
                  setIs3dLoading(false);
                  const result = res?.data;
                  if (result.success) {
                    toast.dismiss(loadingToast);
                    toast.success(result.message);
                    refetch();
                    setOpenEditModal(false);
                    // postPaymentApi(null, token);
                  } else {
                    toast.error(result.message);
                  }
                });

                // send `token.id` to your server to retry your API request
              });
            }
          } else {
            toast.error(result.message);
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error("Something went wrong");
        })
        .finally(() => {
          setIsLoading(false);
        });
      // postCardDetails(payload)
      //   .then((res) => {
      //     const result = res?.data;
      //     if (result.success) {
      //       toast.success(result.message);
      //       refetch();
      //     } else {
      //       toast.error(result.message);
      //     }
      //   })
      //   .catch(() => {
      //     toast.error("Something went wrong");
      //   })
      //   .finally(() => {
      //     setIsLoading(false);
      //   });
    };

    useEffect(() => {
      if (
        scrollContainerRef &&
        scrollContainerRef.current &&
        scrollContainerRef.current.scrollTop
      ) {
        scrollContainerRef.current.scrollTop = 0; // Scroll to the top of the container when the component mounts
      }
    }, []);

    const getButtonText = () => {
      if (isEdit) {
        return "Confirm";
      }
      return "Add card";
    };

    return (
      <>
        <div ref={scrollContainerRef} style={containerStyles}>
          <ThreeDSecureAuthentication isLoading={is3dLoading}>
            <div
              style={{
                height: is3d && is3dDisplayMode === "inline" ? "400px" : 0,
              }}
              id="my-container"
            />
          </ThreeDSecureAuthentication>
          <StackComponent
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ width: isSmallScreen ? "calc(100% - 17px)" : "auto" }}
            // sx={formContainerStyle}
          >
            <CampaignHeading>
              {isEdit ? "Edit card details" : "Add new card"}
            </CampaignHeading>
            <AuthModelForm dense mt="25px" formAction={formik.handleSubmit}>
              <GridComp container columnSpacing={{ xs: 1, sm: 2 }}>
                <GridComp item xs={12} sm={6}>
                  <CardNumberField isEdit={isEdit} formik={formik} />
                </GridComp>
                <GridComp item xs={12} sm={6}>
                  <NameOnCardField formik={formik} />
                </GridComp>
                <GridComp item xs={12} sm={6}>
                  <ExpiryDateField isEdit={isEdit} formik={formik} />
                </GridComp>
                <GridComp item xs={12} sm={6}>
                  <CVVField isEdit={isEdit} formik={formik} />
                </GridComp>
              </GridComp>

              <BoxComponent
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <ButtonComp type="submit" size="normal" sx={{ width: "166px" }}>
                  {isLoading ? (
                    <StackComponent alignItems="center" component="span">
                      <CircularLoader color="white" size="20px" />
                      <TypographyComp>Saving</TypographyComp>
                    </StackComponent>
                  ) : (
                    getButtonText()
                  )}
                </ButtonComp>
              </BoxComponent>
            </AuthModelForm>
          </StackComponent>
        </div>
      </>
    );
  }
);
AddandEditModel.propTypes = {
  isEdit: PropTypes.bool,
  setOpenEditModal: PropTypes.func,
  cardData: PropTypes.any,
  refetch: PropTypes.any,
};

AddandEditModel.propTypes = {
  isEdit: false,
  cardData: {},
};
AddandEditModel.displayName = "AddandEditModel";
export default AddandEditModel;
