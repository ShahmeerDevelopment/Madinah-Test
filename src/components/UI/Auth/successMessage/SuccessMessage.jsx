"use client";

import React, { useState } from "react";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
import { useSelector } from "react-redux";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import { RequiredSign } from "../signup/SignUp.style";
import AuthModelSubPageLayout from "@/components/advance/AuthModelSubPageLayout";
import AuthmodelSubHeading from "@/components/advance/AuthModelSubHeading/AuthmodelSubHeading";
import CountdownComponent from "@/components/atoms/CountdownComponent";
import passwordEncryption from "@/utils/encryptionData";
import { forgotPassword } from "@/api";
import toast from "react-hot-toast";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";

const SuccessMessage = () => {
  const resetEmailAddress = useSelector(
    (state) => state.auth.resetEmailAddress,
  );
  const [timerActive, setTimerActive] = useState(true);
  const turnOffTimer = () => setTimerActive(false);
  const forgotPasswordHandler = () => {
    const payload = { email: resetEmailAddress };

    const encryption = {
      data: passwordEncryption(JSON.stringify(payload)),
    };
    forgotPassword(encryption)
      .then((res) => {
        const result = res?.data;
        if (result?.success === true) {
          setTimerActive(true);
        } else {
          toast.error(result.message);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong");
      });
  };
  return (
    <>
      <AuthModelSubPageLayout hideButtonInMobile={true} isSkipButton={false}>
        <AuthmodelSubHeading>Change Password</AuthmodelSubHeading>
        <TypographyComp
          component={"div"}
          variant="body1"
          sx={{
            mb: 5,
            // mt: 2,
            color: "#606062",
            fontWeight: 500,
            fontSize: "18px",
            lineHeight: "22px",
            textAlign: "left",
          }}
        >
          A link to reset your password was sent to
          <RequiredSign defaultColor> {resetEmailAddress}</RequiredSign> Please
          go there and follow the instructions.
        </TypographyComp>
        <BoxComponent
          sx={{
            width: "100%",
            overflow: "hidden",
            padding: "0px 2px",
          }}
        >
          <ButtonComp
            fullWidth
            size="normal"
            onClick={forgotPasswordHandler}
            sx={{ color: "#ffffff" }}
            disabled={timerActive}
          >
            {timerActive ? (
              <>
                <span style={{ marginRight: "5px" }}>Resend message in </span>{" "}
                <CountdownComponent
                  onComplete={turnOffTimer}
                  timer={{ hours: 0, minutes: 0, seconds: 59 }}
                />
              </>
            ) : (
              <>Resend message</>
            )}
          </ButtonComp>
        </BoxComponent>
      </AuthModelSubPageLayout>
    </>
  );
};

export default SuccessMessage;
