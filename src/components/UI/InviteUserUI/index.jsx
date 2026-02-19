"use client";

import React, { useState } from "react";
import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import { verifyMember } from "@/api";

import { useEffect } from "react";
import { theme } from "@/config/customTheme";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { invitedUser, isLoginModalOpen } from "@/store/slices/authSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { getCookie } from "cookies-next";
// import { useNavigate } from 'react-router-dom';

const InviteUserUI = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const userToken = getCookie("token");
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const title = searchParams.get("title");
  const id = searchParams.get("id");
  const [isShowMessage, setIsShowMessage] = useState(false);
  const [loading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (token) {
      verifyTeamMemberFromBackend();
    }
  }, [token]);

  const verifyTeamMemberFromBackend = async () => {
    try {
      const payload = {
        token: token,
      };
      const res = await verifyMember(payload);
      if (res.data.success === true) {
        setIsLoading(false);
        setIsShowMessage(true);
        dispatch(invitedUser(true));
        toast.success(`The invitation to campaign
						${title}
						has been successfully accepted.`);
        if (userToken) {
          router.push(`/campaign/edit?id=${id}`);
        } else {
          dispatch(isLoginModalOpen(true));
          router.push("/");
        }
        // if (res.data.data.isNewUser === false) {
        // 	navigate('/dashboard');
        // }
      } else {
        setIsShowMessage(false);
        setIsLoading(false);
        setErrorMessage(res.data.message);
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("error", error);
      toast.error(error);
      setIsShowMessage(false);
      setIsLoading(false);
      setErrorMessage(error);
    }
  };

  return (
    <BoxComponent sx={{ p: 4 }}>
      {!loading ? (
        isShowMessage ? (
          <CampaignHeading align={"center"}>
            The invitation to campaign{" "}
            <span style={{ color: theme.palette.primary.main }}>{title}</span>{" "}
            has been successfully accepted.
          </CampaignHeading>
        ) : (
          <CampaignHeading align={"center"} sx={{ color: "red" }}>
            {errorMessage}
          </CampaignHeading>
        )
      ) : (
        <CampaignHeading>Verifying...</CampaignHeading>
      )}
    </BoxComponent>
  );
};

export default InviteUserUI;
