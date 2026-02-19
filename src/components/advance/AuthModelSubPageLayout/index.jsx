"use client";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import StackComponent from "../../atoms/StackComponent";
import BackBtnWithIcon from "../BackBtnWithIcon";
import { changeModal } from "../../../store/slices/authSlice";
import { useDispatch } from "react-redux";
import useResponsiveScreen from "../../../hooks/useResponsiveScreen";
import ButtonComp from "../../atoms/buttonComponent/ButtonComp";

const AuthModelSubPageLayout = ({
  children,
  hideButtonInMobile = false,
  isSkipButton = false,
  hideButton = false,
}) => {
  const dispatch = useDispatch();
  const { isSmallScreen } = useResponsiveScreen();

  const changeModalDispatch = useMemo(
    () => () => dispatch(changeModal(0)),
    [dispatch],
  );
  const shouldDisplayBackButton = !isSmallScreen || !hideButtonInMobile;

  return (
    <>
      <StackComponent
        direction={"row"}
        justifyContent={
          isSkipButton
            ? isSmallScreen
              ? "flex-end"
              : "space-between"
            : "flex-start"
        }
        alignItems="center"
        sx={{ width: "100%", mb: "32px !important" }}
      >
        {shouldDisplayBackButton ||
          (!hideButton && (
            <BackBtnWithIcon onClick={changeModalDispatch}>
              Back
            </BackBtnWithIcon>
          ))}
        {isSkipButton && (
          <ButtonComp
            variant="text"
            onClick={changeModalDispatch}
            sx={{
              fontSize: "14px",
              fontWeight: 400,

              padding: "10px 0px",
            }}
          >
            Skip
          </ButtonComp>
        )}
      </StackComponent>
      {children}
    </>
  );
};

AuthModelSubPageLayout.propTypes = {
  children: PropTypes.any,
  hideButtonInMobile: PropTypes.bool,
  isSkipButton: PropTypes.bool,
  hideButton: PropTypes.bool,
};

export default AuthModelSubPageLayout;
