import PropTypes from "prop-types";
import React from "react";
import FullWidthInputWithLength from "@/components/advance/FullWidthInputWithLength";
import { useDispatch, useSelector } from "react-redux";
import {
  updateGtmId,
  updatePixelApiKey,
  updatePixelId,
} from "@/store/slices/mutateAuthSlice";

export const PixelIdField = ({ isSubmittionAttempted }) => {
  const pixelId = useSelector((state) => state.mutateAuth?.pixelId);
  const dispatch = useDispatch();

  return (
    <FullWidthInputWithLength
      containerStyleOverrides={{
        mb: "0px",
        gap: "5px",
      }}
      label={"Pixel ID"}
      placeholder={"Pixel ID"}
      name="pixelId"
      adornmentChildren={<></>}
      value={pixelId}
      onChange={(e) => {
        dispatch(updatePixelId(e.target.value));
      }}
      error={isSubmittionAttempted}
      onBlur={() => {
        // addBlurredInput('title');
      }}
    />
  );
};

export const PixelApiKeyField = ({ isSubmittionAttempted }) => {
  const pixelAccessToken = useSelector(
    (state) => state.mutateAuth?.pixelAccessToken,
  );
  const dispatch = useDispatch();

  return (
    <FullWidthInputWithLength
      containerStyleOverrides={{
        mb: "0px",
      }}
      label={"Pixel API Key"}
      placeholder={"Pixel API Key"}
      name="pixelAccessToken"
      adornmentChildren={<></>}
      value={pixelAccessToken}
      onChange={(e) => {
        dispatch(updatePixelApiKey(e.target.value));
      }}
      error={isSubmittionAttempted}
      onBlur={() => {
        // addBlurredInput('title');
      }}
    />
  );
};

export const GTMIdField = ({ isSubmittionAttempted }) => {
  const gtmId = useSelector((state) => state.mutateAuth?.gtmId);
  const dispatch = useDispatch();

  return (
    <FullWidthInputWithLength
      containerStyleOverrides={{
        mb: "0px",
        gap: "5px",
      }}
      label={"GTM ID"}
      placeholder={"GTM ID"}
      name="gtmId"
      adornmentChildren={<></>}
      value={gtmId}
      onChange={(e) => {
        dispatch(updateGtmId(e.target.value));
      }}
      error={isSubmittionAttempted}
      onBlur={() => {
        // addBlurredInput('title');
      }}
    />
  );
};

PixelIdField.propTypes = {
  isSubmittionAttempted: PropTypes.boolean,
};

PixelApiKeyField.propTypes = {
  isSubmittionAttempted: PropTypes.boolean,
};

GTMIdField.propTypes = {
  isSubmittionAttempted: PropTypes.boolean,
};
