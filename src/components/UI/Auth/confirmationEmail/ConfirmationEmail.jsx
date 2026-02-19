"use client";

import React, { useState } from "react";
import AuthModelSubPageLayout from "@/components/advance/AuthModelSubPageLayout";
import AuthmodelSubHeading from "@/components/advance/AuthModelSubHeading/AuthmodelSubHeading";
import TypographyComp from "@/components/atoms/typography/TypographyComp";
// import { RequiredSign } from "@/signup/SignUp.style";
import { RequiredSign } from "../signup/SignUp.style";
import { useSelector } from "react-redux";
import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import CountdownComponent from "@/components/atoms/CountdownComponent";
import { resendEmailVerification } from "@/api";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";

const ConfirmationEmail = () => {
  const resetEmailAddress = useSelector(
    (state) => state.auth.resetEmailAddress,
  );
  const [timerActive, setTimerActive] = useState(true);

  const turnOffTimer = () => setTimerActive(false);

  const resendEmail = () => {
    setTimerActive(true);
    const payload = { email: resetEmailAddress };
    resendEmailVerification(payload)
      .then((res) => {
        console.log("res", res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <AuthModelSubPageLayout hideButtonInMobile={true} isSkipButton={true}>
      <AuthmodelSubHeading>Confirmation email sent</AuthmodelSubHeading>
      <TypographyComp
        variant="body1"
        sx={{
          mb: 5,
          // mt: 2,
          color: "#606062",
          fontWeight: 500,
          fontSize: "18px",
          textAlign: "left",
        }}
      >
        Please check your mailbox<br></br>
        <RequiredSign defaultColor> {resetEmailAddress},</RequiredSign> to which
        the letter with the verification link was sent.
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
          onClick={resendEmail}
          disabled={timerActive}
        >
          {timerActive ? (
            <>
              <span style={{ marginRight: "5px" }}>Resend code in</span>{" "}
              <CountdownComponent
                onComplete={turnOffTimer}
                timer={{ hours: 0, minutes: 0, seconds: 59 }}
              />
            </>
          ) : (
            <>Resend code</>
          )}
        </ButtonComp>
      </BoxComponent>
    </AuthModelSubPageLayout>
  );
};

export default ConfirmationEmail;
