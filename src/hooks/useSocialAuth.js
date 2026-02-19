import toast from "react-hot-toast";
import { socialLogin } from "../api";
import { useDispatch, useSelector } from "react-redux";
import {
  addUserDetails,
  isLoginModalOpen,
  login,
} from "../store/slices/authSlice";
import {
  campaignStepperIncrementHandler,
  isCreateCampaignHandler,
} from "../store/slices/campaignSlice";
import axios from "axios";
import { getProfile } from "../api/get-api-services";
import { updateAuthValues } from "../store/slices/mutateAuthSlice";
import { setCookie } from "cookies-next";
// import { useRouter } from "next/router";

const useSocialAuth = () => {
  // const router = useRouter();
  const dispatch = useDispatch();
  const isCreateCampaign = useSelector(
    (state) => state.campaign.isCreateCampaign
  );
  const sendSocialToken = async (socialType, accessToken) => {
    const payload = {
      socialType,
      accessToken: accessToken,
    };
    try {
      const res = await socialLogin(payload);
      const result = res?.data;
      if (result?.success === true) {
        dispatch(isLoginModalOpen(false));
        if (socialType === "google") {
          await getUserNameFromGoogle(
            accessToken,
            result.data.accessToken,
            result.data.refreshToken,
            dispatch
          );
        }

        if (isCreateCampaign) {
          setCookie("token", result.data.accessToken);
          setCookie("madinah_refresh", result.data.refreshToken);
          dispatch(login(result.data.accessToken));

          dispatch(campaignStepperIncrementHandler(1));
          dispatch(isCreateCampaignHandler(false));
        } else {
          setCookie("token", result.data.accessToken);
          dispatch(login(result.data.accessToken));
          setCookie("madinah_refresh", result.data.refreshToken);
          // router.push("/dashboard");
          //   navigate("/dashboard");
        }
        getProfile().then((res) => {
          const profileDetails = res?.data?.data;
          if (profileDetails) {
            const firstName = profileDetails?.firstName;
            const lastName = profileDetails?.lastName;
            const fullName = firstName + " " + lastName;
            setCookie("name", fullName, { sameSite: "strict" });
            dispatch(addUserDetails(profileDetails));
            dispatch(updateAuthValues(profileDetails));
          }
        });
        toast.success("Successfully Logged In!");
      } else {
        toast.error(result?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return sendSocialToken;
};

export default useSocialAuth;

const getUserNameFromGoogle = async (
  token,
  newToken,
  refreshToken,
  dispatch
) => {
  try {
    const res = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );
    setCookie("token", newToken);
    setCookie("madinah_refresh", refreshToken);
    dispatch(login(newToken));
    const firstName = res.data.given_name;
    const lastName = res.data.family_name;
    const fullName = `${firstName} ${lastName}`;
    setCookie("name", fullName);
  } catch (err) {
    console.error(err);
  }
};
