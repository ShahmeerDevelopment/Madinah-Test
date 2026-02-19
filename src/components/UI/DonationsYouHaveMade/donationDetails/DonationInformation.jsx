"use client";

import React from "react";
import StackComponent from "@/components/atoms/StackComponent";
import SubHeading from "@/components/atoms/createCampaigns/SubHeading";
import { theme } from "@/config/customTheme";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import Paragraph from "@/components/atoms/createCampaigns/Paragraph";
import { getCardIcon } from "@/config/constant";
import PropTypes from "prop-types";
import { formatDateMonthToYear, formatNumberWithCommas } from "@/utils/helpers";
import useResponsiveScreen from "@/hooks/useResponsiveScreen";
import Image from "next/image";

const DonationInformation = ({ data, setOpenModal, setDeleteModal }) => {
  const { isMobile } = useResponsiveScreen();
  return (
    <>
      <StackComponent
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <SubHeading sx={{ color: theme.palette.primary.dark }}>
          Donation information
        </SubHeading>
        {data?.isRecurring && data?.status === "active" ? (
          <BoxComponent
            display="flex"
            gap={{ xs: 0, sm: 1.5 }}
            justifyContent={"space-between"}
            alignItems="center"
          >
            <ButtonComp
              variant="outlined"
              height="34px"
              size="normal"
              padding={isMobile ? "10px 10px 8px 10px" : "10px 19px 8px 19px"}
              fontSize="14px"
              lineHeight="16px"
              fontWeight={500}
              onClick={() => setOpenModal(true)}
            >
              Modify donations{" "}
            </ButtonComp>
            <BoxComponent sx={{ display: { xs: "none", sm: "block" } }}>
              <ButtonComp
                color="error"
                variant="outlined"
                height="34px"
                size="normal"
                padding="10px 19px 8px 19px"
                fontSize="14px"
                lineHeight="16px"
                fontWeight={500}
                sx={{ color: "#E61D1D" }}
                onClick={() => setDeleteModal(true)}
              >
                Cancel subscription
              </ButtonComp>
            </BoxComponent>
          </BoxComponent>
        ) : data?.isRecurring && data?.status === "future" ? (
          <BoxComponent
            display="flex"
            gap={{ xs: 0, sm: 1.5 }}
            justifyContent={"space-between"}
            alignItems="center"
          >
            <ButtonComp
              color="error"
              variant="outlined"
              height="34px"
              size="normal"
              padding="10px 19px 8px 19px"
              fontSize="14px"
              lineHeight="16px"
              fontWeight={500}
              sx={{ color: "#E61D1D" }}
              onClick={() => setDeleteModal(true)}
            >
              Cancel subscription
            </ButtonComp>
          </BoxComponent>
        ) : null}
      </StackComponent>
      <BoxComponent
        display="flex"
        flexDirection="column"
        gap={2}
        mt={2}
        sx={{ width: { xs: "90%", sm: "300px" } }}
      >
        <BoxComponent
          display={"flex"}
          justifyContent="space-between"
          alignItems="center"
          gap={1}
          sx={{ width: "100%" }}
        >
          <Paragraph textColor={theme.palette.primary.gray}>Status</Paragraph>
          <BoxComponent
            sx={{
              height: "34px",
              width: "88px",
              borderRadius: "25px",
              padding: "10px 14px",
              textAlign: "center",
              background: data?.status === "expired" ? "#FFEDED" : "#E1FBF2",
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: "16px",
              color: data?.status === "expired" ? "#E61D1D" : "#0CAB72",
              textTransform: "capitalize",
            }}
          >
            {data?.status}
          </BoxComponent>
        </BoxComponent>
        <BoxComponent
          display={"flex"}
          justifyContent="space-between"
          alignItems="center"
          gap={1}
          sx={{ width: "100%" }}
        >
          <Paragraph textColor={theme.palette.primary.gray}>
            Donation amount
          </Paragraph>
          <Paragraph textColor={theme.palette.primary.darkGray}>
            {data?.currency} {formatNumberWithCommas(data?.amount)}
          </Paragraph>
        </BoxComponent>
        <BoxComponent
          display={"flex"}
          justifyContent="space-between"
          alignItems="center"
          gap={1}
          sx={{ width: "100%" }}
        >
          <Paragraph textColor={theme.palette.primary.gray}>
            Madinah Tip
          </Paragraph>
          <Paragraph textColor={theme.palette.primary.darkGray}>
            {data?.currency}{" "}
            {data?.tipAmount ? formatNumberWithCommas(data?.tipAmount) : 0}
          </Paragraph>
        </BoxComponent>
        <BoxComponent
          display={"flex"}
          justifyContent="space-between"
          alignItems="center"
          gap={1}
          sx={{ width: "100%" }}
        >
          <Paragraph textColor={theme.palette.primary.gray}>
            Next payment
          </Paragraph>
          <Paragraph textColor={theme.palette.primary.darkGray}>
            {data?.isRecurring === true && data?.status !== "expired"
              ? formatDateMonthToYear(data?.nextPayment)
              : "N/A"}
          </Paragraph>
        </BoxComponent>
        <BoxComponent
          display={"flex"}
          justifyContent="space-between"
          alignItems="center"
          gap={1}
          sx={{
            width: "100%",
            fontSize: "14px",
            lineHeight: "16px",
            color: "#606062",
          }}
        >
          <Paragraph textColor={theme.palette.primary.gray}>
            Payment method
          </Paragraph>
          <StackComponent>
            <div style={{ borderRadius: "4px" }}>
              <Image
                width={33}
                height={22}
                src={getCardIcon(data?.paymentMethod?.cardType)}
                alt={data?.paymentMethod?.cardType}
              />{" "}
            </div>
            &nbsp; &nbsp;{data?.paymentMethod?.lastFourDigits && "****"}
            {data?.paymentMethod?.lastFourDigits}
          </StackComponent>
        </BoxComponent>
      </BoxComponent>
    </>
  );
};

DonationInformation.propTypes = {
  data: PropTypes.any,
  setOpenModal: PropTypes.func,
  setDeleteModal: PropTypes.func,
};
export default DonationInformation;
