"use client";

import React from "react";
import dynamic from "next/dynamic";
import ModalComponent from "./ModalComponent";
import { useDispatch, useSelector } from "react-redux";
import { changeModal, isLoginModalOpen } from "../../../store/slices/authSlice";
import AuthModelsLayout from "../../advance/AuthModelsLayout";
import { modalHeightAdjustAble } from "@/config/constant";

const SignIn = dynamic(() => import("@/components/UI/Auth/signin"), {
  ssr: false,
});
const ForgotPassword = dynamic(
  () => import("@/components/UI/Auth/forgotPassword"),
  {
    ssr: false,
  }
);
const SignUp = dynamic(() => import("@/components/UI/Auth/signup/SignUp"), {
  ssr: false,
});
const ConfirmationEmail = dynamic(
  () => import("@/components/UI/Auth/confirmationEmail/ConfirmationEmail"),
  {
    ssr: false,
  }
);
const SuccessMessage = dynamic(
  () => import("@/components/UI/Auth/successMessage/SuccessMessage"),
  {
    ssr: false,
  }
);

const ModalManager = () => {
  const dispatch = useDispatch();

  const { isLoginModal, currentNumber } = useSelector((state) => state.auth);

  return (
    <div>
      <ModalComponent
        width={"454px"}
        padding={"40px 48px"}
        responsivePadding={"40px 16px"}
        open={isLoginModal}
        hideInMobileView={true}
        onClose={() => {
          dispatch(isLoginModalOpen(false));
          dispatch(changeModal(0));
        }}
        containerStyleOverrides={modalHeightAdjustAble}
      >
        {isLoginModal ? (
          <AuthModelsLayout>
            {currentNumber === 1 ? (
              <SignUp />
            ) : currentNumber === 2 ? (
              <ForgotPassword />
            ) : currentNumber === 3 ? (
              <SuccessMessage />
            ) : currentNumber === 4 ? (
              <ConfirmationEmail />
            ) : (
              <SignIn />
            )}
          </AuthModelsLayout>
        ) : null}
      </ModalComponent>
    </div>
  );
};

export default ModalManager;
