"use client";

import React, { useEffect, useState } from "react";
import { postConfirmEmail } from "@/api";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

import ButtonComp from "@/components/atoms/buttonComponent/ButtonComp";
import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";

const VerifiedEmail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [verificationStatus, setVerificationStatus] = useState({
    loading: true,
    verified: false,
  });

  useEffect(() => {
    if (!token) {
      setVerificationStatus({ loading: true, verified: false });
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await postConfirmEmail({ token });
        const result = response?.data;

        if (result.success) {
          setVerificationStatus({ loading: false, verified: true });
        } else {
          toast.error(result.message || "Verification failed");
          setVerificationStatus({ loading: false, verified: false });
        }
      } catch (error) {
        toast.error("An error occurred during verification");
        setVerificationStatus({ loading: false, verified: false });
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <BoxComponent
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        minHeight: "100vh", // Ensures the component takes full viewport height
        padding: "20px", // Adds some padding for better spacing on smaller screens
      }}
    >
      <BoxComponent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: { xs: "100%", sm: "50%" },
          background: "#f9f9f9", // Optional: Adds a light background for better contrast
          padding: "40px", // Adds padding inside the box
          borderRadius: "8px", // Rounds the corners
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Adds a subtle shadow
        }}
      >
        {verificationStatus.loading ? (
          <CampaignHeading>Verifying link...</CampaignHeading>
        ) : (
          <>
            {verificationStatus.verified ? (
              <>
                <CampaignHeading>Your email has been verified!</CampaignHeading>
                <BoxComponent sx={{ mt: 3 }}>
                  <ButtonComp
                    fullWidth
                    variant="outlined"
                    onClick={() => router.push("/")}
                  >
                    Go to Home Page
                  </ButtonComp>
                </BoxComponent>
              </>
            ) : (
              <>
                <CampaignHeading>Link is not verified</CampaignHeading>
                <BoxComponent sx={{ mt: 3 }}>
                  <ButtonComp
                    fullWidth
                    variant="outlined"
                    onClick={() => router.push("/")}
                  >
                    Home Page
                  </ButtonComp>
                </BoxComponent>
              </>
            )}
          </>
        )}
      </BoxComponent>
    </BoxComponent>
  );
};

export default VerifiedEmail;
