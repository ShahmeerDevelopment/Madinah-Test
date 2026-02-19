/* eslint-disable indent */
"use client";

import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getCookie } from "cookies-next";
import PropTypes from "prop-types";

import {
  cardHolderNameHandler,
  creditCardDetailsHandler,
  isSavedCardContinueHandler,
  paymentTypeHandler,
  resetDonationState,
  updateCardType,
} from "@/store/slices/donationSlice";

import { Divider } from "@mui/material";
import { getCardIcon } from "@/config/constant";
import CardPaymentForm from "./CardPaymentForm";
import { ASSET_PATHS } from "@/utils/assets";
const apple = ASSET_PATHS.svg.applePay;
import GridComp from "@/components/atoms/GridComp/GridComp";
const blackCard = ASSET_PATHS.svg.blackCard;
import {
  // getAddToCartFbTags,
  // getInitiateCheckoutFbTags,
  // getPaymentInfoFbTags,
  postCardDetails,
  useGetCreditCardList,
} from "@/api";
import SaveCardSkeleton from "../paymentSkeleton/SaveCardSkeleton";
const google = ASSET_PATHS.svg.googlePay;
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import DonationTemplate from "@/components/templates/donationTemplate/DonationTemplate";
import SelectAbleIconField from "@/components/atoms/selectAbleField/SelectAbleIconField";
import { generateRandomToken } from "@/utils/helpers";
import { usePathname } from "next/navigation";
import { getInitiateCheckoutFbTags } from "@/api/get-api-services";
import dayjs from "dayjs";
import { savePixelLogs } from "@/api/post-api-services";
import { emailValidation } from "@/api/api-services";

const recurlyKey = process.env.NEXT_PUBLIC_RECURLY_PUBLIC_KEY;

const PaymentMethod = memo(
  ({ activeStep, setActiveStep, setCurrentIndex, setCardToken }) => {
    const dispatch = useDispatch();

    const isCardSave = useSelector(
      (state) => state.donation.isSaveCardForFuture,
    );

    const isSaveCardContinue = useSelector(
      (state) => state.donation?.isSaveCardContinue,
    );
    const campaignDetails = useSelector(
      (state) => state.donation?.campaignDetails,
    );
    const campaignId = useSelector((state) => state.donation.campaignId);

    const selectedBoxData = useSelector(
      (state) => state.donation.selectedBoxData,
    );
    const utmParameters = useSelector((state) => state.utmParameters);
    const fbclid = utmParameters.fbclid;
    // Format fbc as "fb.subdomainIndex.creationTime.fbclid"
    const fbc = fbclid ? `fb.1.${Date.now()}.${fbclid}` : null;
    const event_month = dayjs().format("MMMM");
    const event_day = dayjs().format("dddd");
    const event_hour =
      dayjs().format("H-") + (parseInt(dayjs().format("H")) + 1);
    const traffic_source =
      utmParameters?.utmMedium === "email" ||
      utmParameters?.utmMedium === "Email"
        ? ""
        : "";
    const content_ids = [campaignId];
    const content_type = "product";
    const user_roles = "guest";
    const url = window?.location?.href;
    const donationValues = useSelector(
      (state) => state.donation.donationValues,
    );
    const [is3d, setIs3d] = useState(false);
    const [selectedBox, setSelectedBox] = useState(
      useSelector((state) => state.donation.cardType),
    );
    const [isStoredCardSelected, setIsStoredCardSelected] = useState(
      isSaveCardContinue ? 0 : null,
    );
    const externalId = getCookie("externalId");
    const [isLoader, setIsLoader] = useState(false);
    const isLogin = getCookie("token");
    // App Router hooks
    const pathname = usePathname();
    const previousPathRef = useRef(pathname);
    const hasUrlChanged = useRef(false); // Track if the URL has changed
    const fbpData = getCookie("_fbp");
    const experimentalFeature = getCookie("abtesting");
    const campaignVersion = getCookie("campaign_testing");
    const experimentKey = localStorage.getItem("experimentKey");
    const variationKey = localStorage.getItem("variationKey");
    const componentRef = useRef(null);

    const scrollToComponent = () => {
      if (componentRef.current) {
        componentRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    const {
      data: creditCardList,
      isLoading,
      isError,
      error,
    } = useGetCreditCardList({ enabled: isLogin ? true : false });

    useEffect(() => {
      if (isError) {
        toast.error(`Error: ${error.message}`);
      }
    }, [isError, error]);

    const getCardDetails = creditCardList?.data.data.cards;
    const isSaveCard = getCardDetails?.length > 0 ? true : false;

    const handleBoxClick = useCallback(
      (title, index) => {
        setSelectedBox((prevSelected) =>
          prevSelected === index ? null : index,
        );
        dispatch(updateCardType(index));
        dispatch(paymentTypeHandler(title));
      },
      [selectedBox, dispatch],
    );

    const storedCardHandler = useCallback(
      (item, index) => {
        setIsStoredCardSelected((previousSelected) => {
          const isSelected = previousSelected !== index;
          dispatch(isSavedCardContinueHandler(isSelected));
          if (isSelected) {
            setCardToken(item._id);
          } else {
            setCardToken(null); // or any default state
          }
          return isSelected ? index : null;
        });
      },
      [(dispatch, setCardToken)],
    );

    const sendCardDetailsToRecurly = async (
      value,
      selectedCountry,
      selectedCountryInfo,
    ) => {
      if (selectedBox === 2) {
        setIsLoader(true);
        const parts = value.expiryDate?.split("/");
        const month = parts[0];
        const year = parts[1];
        const publicApi = process.env.NEXT_PUBLIC_RECURLY_PUBLIC_KEY;
        const data = new URLSearchParams({
          first_name: value.firstName,
          last_name: value.lastName,
          number: value.cardNumber,
          month: month,
          year: year,
          cvv: value.cvv,

          version: "3.1.0",
          key: publicApi,
        }).toString();

        const queryString = data.toString();

        const payload = {
          email: value.email,
        };
        try {
          const emailValidationResponse = await emailValidation(payload);
          const validationResult = emailValidationResponse?.data;

          if (validationResult && validationResult.success) {
            // Only proceed with Recurly API call after successful email validation
            const tokenData = await axios({
              method: "get",
              url: `https://api.recurly.com/js/v1/token?${queryString}`,
            });

            if (tokenData.status === 200 && tokenData.data.type) {
              // if (!isCardSave) {
              //   toast.success("Card details added successfully");
              // }
              const token = tokenData.data.id;
              setCardToken(token);
              const cardHolder = {
                firstName: value.firstName,
                lastName: value.lastName,
                email: value.email,
                phoneNumber: value.phone,
              };

              dispatch(cardHolderNameHandler(cardHolder));
              dispatch(
                creditCardDetailsHandler({
                  postalCode: value.postalCode,
                  country: selectedCountry,
                  number: value.cardNumber,
                  cvv: value.cvv,
                  expiryDate: month + "/" + year,
                  address1: value.address,
                  city: value.city,
                  state: value.state,
                  nameOnCard: value.nameOnCard,
                  countryInfo: selectedCountryInfo,
                }),
              );

              if (isLogin && isSaveCard) {
                postCreditCard(token, value.postalCode);
              } else if (isLogin && !isSaveCard && isCardSave) {
                postCreditCard(token, value.postalCode);
              } else if (isLogin && !isSaveCard && !isCardSave) {
                nextButtonHandler();
                setIsLoader(false);
              } else {
                nextButtonHandler();
                setIsLoader(false);
              }
            } else {
              toast.error(tokenData.data.error.message);
              setIsLoader(false);
            }
          } else {
            toast.error(validationResult?.message);
            setIsLoader(false);
          }
        } catch (error) {
          console.error(
            "Error during validation or payment processing:",
            error,
          );
          toast.error("Something went wrong. Please try again.");
          setIsLoader(false);
        }
      } else if (selectedBox === 0) {
        setIsLoader(true);
        const payload = {
          email: value.email,
        };

        try {
          const emailValidationResponse = await emailValidation(payload);
          const validationResult = emailValidationResponse?.data;

          if (validationResult && validationResult.success) {
            nextButtonHandler();
          } else {
            toast.error(validationResult?.message || "Invalid email address");
          }
        } catch (error) {
          console.error("Error validating email:", error);
          toast.error("Email validation failed. Please try again.");
        } finally {
          setIsLoader(false);
        }
      }
    };

    const postCreditCard = (token, postalCode) => {
      const payload = {
        cardToken: token,
        postalCode: postalCode,
      };
      postCardDetails(payload)
        .then((res) => {
          const result = res?.data;

          if (result.success) {
            // toast.success(result.message);

            toast.success("Card details added successfully");
            nextButtonHandler();
          } else if (result.data.is3dSecureAuthenticationRequired) {
            if (window.recurly) {
              window.recurly.configure(recurlyKey);
              const risk = window.recurly.Risk();
              setIs3d(true);
              if (typeof window !== "undefined") {
                scrollToComponent();
              }
              const threeDSecure = risk.ThreeDSecure({
                actionTokenId: result.data.token,
              });
              threeDSecure.attach(document.querySelector("#my-container"));
              threeDSecure.on("error", (err) => {
                setIs3d(false);
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
                  const result = res?.data;
                  if (result.success) {
                    toast.success(result.message);
                    nextButtonHandler();
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
          setIsLoader(false);
        });
    };

    const nextButtonHandler = useCallback(() => {
      setActiveStep((prevActiveStep) => {
        setCurrentIndex(prevActiveStep);
        return prevActiveStep + 1;
      });
    }, [setActiveStep, setCurrentIndex]);

    useEffect(() => {
      if (typeof window !== "undefined") {
        scrollToComponent();
      }
      const eventId = generateRandomToken("a", 5) + dayjs().unix();

      if (window.fbq) {
        const fbqData = {
          value: selectedBoxData
            ? selectedBoxData.amount
            : donationValues?.totalAmount,
          currency: campaignDetails?.amountCurrency,
          campaignName: campaignDetails?.title,
          category: campaignDetails?.categoryId?.name,
          givingLevel: selectedBoxData?.title,
        };

        // Prepare UTM parameters and add only valid ones
        const utmParams = {
          utmSource: utmParameters?.utmSource,
          utmMedium: utmParameters?.utmMedium,
          utmCampaign: utmParameters?.utmCampaign,
          utmTerm: utmParameters?.utmTerm,
          utmContent: utmParameters?.utmContent,
          referral: utmParameters?.referral,
          src: utmParameters?.src,
          fbc: fbc,
          event_month,
          event_day,
          event_hour,
          traffic_source,
          content_ids,
          content_type,
          user_roles,
          url,
        };

        // Filter and append valid UTM parameters to fbqData
        Object.entries(utmParams).forEach(([key, value]) => {
          if (
            value !== null &&
            value !== undefined &&
            value !== "null" &&
            value !== "undefined"
          ) {
            fbqData[key] = value;
          }
        });

        // window.fbq("track", "AddToCart", fbqData);
        window.fbq("track", "InitiateCheckout", fbqData, {
          eventID: eventId,
          fbp: fbpData,
          external_id: externalId,
        });
        // window.fbq("track", "AddPaymentInfo", fbqData);

        const payload = {
          campaignId: campaignDetails?._id,
          totalAmount: fbqData.value,
          currency: fbqData.currency,
          givingLevelTitle: fbqData.givingLevel,
          utmSource: fbqData.utmSource,
          utmMedium: fbqData.utmMedium,
          utmCampaign: fbqData.utmCampaign,
          utmTerm: fbqData.utmTerm,
          utmContent: fbqData.utmContent,
          referral: fbqData.referral,
          src: fbqData.src,
          fbc: fbc,
          event_month,
          event_day,
          event_hour,
          traffic_source,
          content_ids,
          content_type,
          user_roles,
          url,
          eventId: eventId,
          fbp: fbpData,
          externalId: externalId,
          version: experimentalFeature,
          campaignVersion,
          experimentKey,
          variationKey,
        };

        const pixelPayload = {
          campaignId: campaignDetails?._id,
          totalAmount: fbqData.value,
          currency: fbqData.currency,
          givingLevelTitle: fbqData.givingLevel,
          utmSource: fbqData.utmSource,
          utmMedium: fbqData.utmMedium,
          utmCampaign: fbqData.utmCampaign,
          utmTerm: fbqData.utmTerm,
          utmContent: fbqData.utmContent,
          referral: fbqData.referral,
          src: fbqData.src,
          fbc: fbc,
          event_month,
          event_day,
          event_hour,
          traffic_source,
          content_ids,
          content_type,
          user_roles,
          url,
          eventId: eventId,
          fbp: fbpData,
          externalId: externalId,
          eventName: "InitiateCheckout",
        };

        savePixelLogs(pixelPayload, campaignDetails?._id);
        getInitiateCheckoutFbTags(payload).catch((err) =>
          console.error(err, "Initiate checkout script did not work"),
        );

        // getPaymentInfoFbTags(payload).catch((err) =>
        //   console.error(err, "Payment info script did not work"),
        // );
      }
    }, []);

    // App Router: Track route changes via pathname instead of router.events
    useEffect(() => {
      if (previousPathRef.current !== pathname) {
        hasUrlChanged.current = true;
        dispatch(resetDonationState());
        previousPathRef.current = pathname;
      }

      return () => {
        if (hasUrlChanged.current) {
          dispatch(resetDonationState());
        }
      };
    }, [pathname, dispatch]);

    const isInstagramBrowser = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      return userAgent.includes("Instagram");
    };

    const isInstagram = isInstagramBrowser();

    return (
      <DonationTemplate
        ref={componentRef} // Add ref here
        setActiveStep={setActiveStep}
        activeStep={activeStep}
        setCurrentIndex={setCurrentIndex}
        heading="Payment method"
        onClickHandler={nextButtonHandler}
        isContinueButtonDisabled={selectedBox === null}
        isSubmitButton={
          selectedBox === 0
            ? false
            : selectedBox === 1
              ? true
              : isStoredCardSelected !== null
        }
      >
        <div style={{ height: is3d ? "400px" : undefined }} id="my-container" />
        {/* <BoxComponent
          sx={{
            // display: { xs: "none", sm: "block" },
            width: { xs: "100px", sm: "200px" },
            position: "absolute",
            right: 0,
            bottom: { xs: 200, sm: 80 },
            opacity: 0,
            cursor: "default",
          }}
        >
          <SelectAbleIconField
            isActive={selectedBox === 1}
            onClick={() => handleBoxClick("google_pay", 1)}
            heading={"Google Pay"}
            icon={google}
            isGoogleButton={true}
            isPaymentButton={true}
          />
        </BoxComponent> */}
        <GridComp container spacing={2}>
          {!isInstagram && (
            <GridComp item xs={12} sm={4}>
              <SelectAbleIconField
                isActive={selectedBox === 0}
                onClick={() => handleBoxClick("apple_pay", 0)}
                heading={"Apple Pay"}
                icon={apple}
                isPaymentButton={true}
              />
            </GridComp>
          )}
          {!isInstagram && (
            <GridComp item xs={12} sm={4}>
              <SelectAbleIconField
                isActive={selectedBox === 1}
                onClick={() => handleBoxClick("google_pay", 1)}
                heading={"Google Pay"}
                icon={google}
                isGoogleButton={true}
                isPaymentButton={true}
              />
            </GridComp>
          )}
          <GridComp item xs={12} sm={4}>
            <SelectAbleIconField
              isActive={selectedBox === 2}
              onClick={() => handleBoxClick("credit_card", 2)}
              heading={"Credit or debit card"}
              icon={blackCard}
              isPaymentButton={true}
            />
          </GridComp>
          {/* <GridComp item xs={12} sm={4}>
            <SelectAbleIconField
              isActive={selectedBox === 0}
              onClick={() => handleBoxClick("apple_pay", 0)}
              heading={"Apple Pay"}
              icon={apple}
              isPaymentButton={true}
            />
          </GridComp> */}
        </GridComp>
        {isLoading ? (
          <SaveCardSkeleton />
        ) : selectedBox === 2 || selectedBox === 0 ? (
          <BoxComponent sx={{ mt: 2, mb: 4 }}>
            {selectedBox === 2 && (
              <GridComp container spacing={2}>
                {getCardDetails?.map((item, index) => (
                  <GridComp item xs={12} sm={6} lg={4} key={index}>
                    <SelectAbleIconField
                      isStoredCard={true}
                      height={"41px"}
                      isActive={isStoredCardSelected === index}
                      onClick={() => storedCardHandler(item, index)}
                      heading={`Use card ending with ***${item.lastFour}`}
                      icon={getCardIcon(item.brand)}
                    />
                  </GridComp>
                ))}
              </GridComp>
            )}
            {selectedBox === 2 && (
              <Divider
                textAlign="center"
                sx={{
                  width: "100%",
                  my: 1,
                  "& .MuiDivider-wrapper": {
                    px: "8px",
                    color: "#A1A1A8",
                    fontWeight: 500,
                    fontSize: "14px",
                    marginTop: "-1px",
                  },
                }}
              >
                or
              </Divider>
            )}
            <CardPaymentForm
              isLogin={isLogin}
              isStoredCardSelected={
                isStoredCardSelected === null ? false : true
              }
              onClick={sendCardDetailsToRecurly}
              isLoader={isLoader}
              disabledButton={is3d}
              isSaveCard={isSaveCard}
              cardType={selectedBox}
            />
          </BoxComponent>
        ) : null}
      </DonationTemplate>
    );
  },
);

PaymentMethod.propTypes = {
  setActiveStep: PropTypes.func,
  setCurrentIndex: PropTypes.func,
  setCardToken: PropTypes.func,
  activeStep: PropTypes.number,
};
PaymentMethod.displayName = "PaymentMethod";
export default PaymentMethod;
