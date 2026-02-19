"use client";

import React, { useState, useRef } from "react";

import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
import TextFieldComp from "@/components/atoms/inputFields/TextFieldComp";
import InputAdornment from "@mui/material/InputAdornment";
// import DropDown from "@/components/atoms/inputFields/DropDown";
// import { FREQUENCY_data } from "./constant";
// import DatePickerComp from "@/components/molecules/datePicker/DatePickerComp";
import dayjs from "dayjs";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import StackComponent from "@/components/atoms/StackComponent";
import CircularLoader from "@/components/atoms/ProgressBarComponent/CircularLoader";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import PropTypes from "prop-types";
import Paragraph from "@/components/atoms/createCampaigns/Paragraph";
import { getCardIcon } from "@/config/constant";
import DropDownIcon from "./icons/DropDownIcon";
import { formatDateMonthToYear } from "@/utils/helpers";
import Image from "next/image";
import AuthModelForm from "@/components/advance/AuthModelForm/AuthModelForm";
import GridComp from "@/components/atoms/GridComp/GridComp";
import { CardNumberField, CVVField, ExpiryDateField, NameOnCardField } from "../DonationOnCampaign/donationCardInfo/FormFields";
import { useFormik } from "formik";
import { getSaveCardFormValidationSchema } from "../AccountSettings/saveCards/formValidation";
import axios from "axios";
import toast from "react-hot-toast";
import { postCardDetails } from "@/api";
import ThreeDSecureAuthentication from "@/components/advance/ThreeDSecureAuthentication";

const EditDonationModal = ({ loading, data, updateHandler, onClose, refetch }) => {
	const recurlyKey = process.env.NEXT_PUBLIC_RECURLY_PUBLIC_KEY;
	const threeDSecureRef = useRef(null);

	const [amount, setAmount] = useState(data?.amount || "");
	const [is3d, setIs3d] = useState(false);
	const [is3dLoading, setIs3dLoading] = useState(false);
	const [is3dDisplayMode, setIs3dDisplayMode] = useState("inline"); // 'inline' or 'modal'
	const [cardProcessing, setCardProcessing] = useState(false);
	const [tipAmount, setTipAmount] = useState(data?.tipAmount || "");
	const [cardForm, setCardForm] = useState(false);
	const previousDate =
		data.nextPayment === null || data.nextPayment === undefined
			? dayjs()
			: dayjs(data.nextPayment);
	const [selectedStartDate] = useState(previousDate);

	const [selectedFrequency] = useState(data?.donationHistory?.records[0]?.subscriptionType);

	const scrollTo3DSecure = () => {
		if (threeDSecureRef.current) {
			threeDSecureRef.current.scrollIntoView({
				behavior: "smooth",
				block: "center"
			});
		}
	};

	const updateDonation = async () => {
		if (cardForm) {
			setCardProcessing(true);
			console.log("Card values being edited:", {
				cardNumber: formik.values.cardNumber,
				expiryDate: formik.values.expiryDate,
				cvv: formik.values.cvv
			});
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
				setCardProcessing(false);
				return; // Don't proceed if there's an error
			}
			if (tokenData.status === 200 && tokenData.data.type) {
				const token = tokenData.data.id;
				postCreditCard(token);
				// Don't call updateHandler here, it will be called after card API completes
				return;
			}
		}
		// Only call updateHandler if cardForm is false or if we're not processing card
		if (!cardForm) {
			// For non-card updates, call updateHandler first then refetch
			updateHandler(amount, tipAmount);
			if (refetch) {
				Promise.resolve(refetch()).then(() => {
					// Data is now fresh after refetch
					console.log("Data refetched successfully");
				});
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

					toast.success("Card details added successfully");
					// Call updateHandler first to update the backend
					updateHandler(amount, tipAmount);
					// Then refetch data to get fresh details and close modal
					if (refetch) {
						Promise.resolve(refetch()).then(() => {
							// Add a small delay to ensure parent component updates with fresh data
							setTimeout(() => {
								// Close modal only after refetch completes and data is fresh
								if (cardForm && onClose) {
									onClose();
								}
							}, 100);
						});
					} else {
						// Close modal only when cardForm is true and all APIs are done
						if (cardForm && onClose) {
							onClose();
						}
					}
					setCardProcessing(false);
				} else if (result.data.is3dSecureAuthenticationRequired) {
					setIs3dLoading(true);
					if (window.recurly) {
						window.recurly.configure(recurlyKey);
						const risk = window.recurly.Risk();
						setIs3d(true);
						// Scroll to 3D Secure container
						setTimeout(() => {
							scrollTo3DSecure();
						}, 100);
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
							setCardProcessing(false);
							threeDSecure.remove(document.querySelector("#my-container"));
							toast.error(err.message);
							// display an error message to your user requesting they retry
							// or use a different payment method
						});

						threeDSecure.on("token", (newToken) => {
							payload.previousCardToken = token;
							payload.cardToken = newToken.id;
							postCardDetails(payload).then((res) => {
								setIs3d(false);
								setIs3dLoading(false);
								const result = res?.data;
								if (result.success) {
									toast.dismiss(loadingToast);
									toast.success(result.message);
									// Call updateHandler first to update the backend
									updateHandler(amount, tipAmount);
									// Then refetch data to get fresh details and close modal
									if (refetch) {
										Promise.resolve(refetch()).then(() => {
											// Add a small delay to ensure parent component updates with fresh data
											setTimeout(() => {
												// Close modal only after refetch completes and data is fresh
												if (cardForm && onClose) {
													onClose();
												}
											}, 100);
										});
									} else {
										// Close modal only when cardForm is true and all APIs are done
										if (cardForm && onClose) {
											onClose();
										}
									}
									setCardProcessing(false);
								} else {
									toast.error(result.message);
									setCardProcessing(false);
								}
							});
						});
					}
				} else {
					toast.error(result.message);
					setCardProcessing(false);
				}
			})
			.catch((error) => {
				console.error(error);
				toast.error("Something went wrong");
				setCardProcessing(false);
			})
			.finally(() => {

			});
	};

	const formik = useFormik({
		initialValues: {
			cardNumber: "",
			expiryDate: "",
			cvv: "",
			nameOnCard: "",
		},
		validationSchema: getSaveCardFormValidationSchema(false),
	});


	return (
		<BoxComponent display="flex" flexDirection="column" alignItems="center">
			<ThreeDSecureAuthentication isLoading={is3dLoading}>
				<div
					ref={threeDSecureRef}
					style={{
						height: is3d && is3dDisplayMode === "inline" ? "400px" : 0,
					}}
					id="my-container"
				/>
			</ThreeDSecureAuthentication>
			<CampaignHeading marginBottom={2} sx={{ color: "#090909" }}>
				Edit payment details
			</CampaignHeading>
			<TextFieldComp
				type="number"
				label={"Donation amount"}
				fullWidth
				InputProps={{
					startAdornment: <InputAdornment position="start">$</InputAdornment>,
				}}
				value={amount}
				onChange={(e) => setAmount(e.target.value)}
				sx={{ color: "#090909" }}
			/>
			<TextFieldComp
				type="number"
				label={"Tip amount"}
				fullWidth
				InputProps={{
					startAdornment: <InputAdornment position="start">$</InputAdornment>,
				}}
				value={tipAmount}
				onChange={(e) => setTipAmount(e.target.value)}
				sx={{ color: "#090909" }}
			/>
			<TextFieldComp
				label={"Frequency"}
				fullWidth
				value={selectedFrequency}
				disabled
				sx={{ color: "#090909" }}
			/>
			<BoxComponent sx={{ width: "100%", mt: 2, opacity: 0.6 }}>
				<TypographyComp
					sx={{
						fontWeight: 400,
						fontSize: "14px",
						lineHeight: "16px",
						color: "#A1A1A8",
					}}
				>
					Payment method
				</TypographyComp>
				<BoxComponent
					display="flex"
					justifyContent="space-between"
					alignItems="center"
					sx={{
						borderRadius: "16px",
						border: "1px solid #E9E9EB",
						padding: "12px 16px 10px 16px",
						height: "40px",
						width: "100%",
						cursor: "pointer"
					}}
					onClick={() => setCardForm(!cardForm)}
				>
					<StackComponent>
						<Image
							width={33}
							height={22}
							borderRadius={"4px"}
							src={getCardIcon(data.paymentMethod.cardType)}
							alt={data.paymentMethod.cardType}
						/>{" "}
						&nbsp; &nbsp;***{data.paymentMethod.lastFourDigits}
					</StackComponent>
					<DropDownIcon />
				</BoxComponent>
				{cardForm ? (
					<AuthModelForm dense mt="25px"
					>
						<GridComp container columnSpacing={{ xs: 1, sm: 2 }}>
							<GridComp item xs={12} sm={12}>
								<CardNumberField
									sx={{ color: "#090909" }}
									formik={formik}
								/>
							</GridComp>
							<GridComp item xs={12} sm={12}>
								<NameOnCardField sx={{ color: "#090909" }} formik={formik} />
							</GridComp>
							<GridComp item xs={12} sm={6}>
								<ExpiryDateField
									sx={{ color: "#090909" }}
									formik={formik}
								/>
							</GridComp>
							<GridComp item xs={12} sm={6}>
								<CVVField
									sx={{ color: "#090909" }}
									formik={formik}
								/>
							</GridComp>
						</GridComp>

						<BoxComponent
							sx={{
								width: "100%",
								display: "flex",
								justifyContent: "flex-end",
							}}
						>
						</BoxComponent>
					</AuthModelForm>
				) : null}
			</BoxComponent>
			{
				selectedStartDate ? (
					<Paragraph sx={{ fontWeight: 500, mt: 4, mb: 4 }} textColor="#606062">
						Next payment is on {formatDateMonthToYear(selectedStartDate)}
					</Paragraph>
				) : null
			}
			<ButtonComp
				height="46px"
				size="normal"
				sx={{ width: { xs: "100%", sm: "166px" } }}
				onClick={() => updateDonation()}
				disabled={loading || cardProcessing || is3dLoading || is3d}
			>
				{loading || cardProcessing || is3dLoading ? (
					<StackComponent alignItems="center" component="span">
						<CircularLoader color="white" size="20px" />
						<TypographyComp>
							{is3dLoading || is3d ? "Processing 3D Secure..." : "Updating..."}
						</TypographyComp>
					</StackComponent>
				) : (
					"Confirm"
				)}
			</ButtonComp>
		</BoxComponent >
	);
};
EditDonationModal.propTypes = {
	loading: PropTypes.bool,
	data: PropTypes.any,
	updateHandler: PropTypes.func,
	onClose: PropTypes.func,
	refetch: PropTypes.func,
};

export default EditDonationModal;
