import { END_POINTS } from "./constant";
import {
  postWithoutToken,
  doGet,
  doPost,
  doUploadFile,
  doPut,
} from "./httpRequests";

const {
  SIGN_UP,
  SING_IN,
  LOGOUT,
  FORGOT_PASSWORD,
  VERIFY_TOKEN,
  RESET_PASSWORD,
  SOCIAL_LOGIN,
  FETCH_PRESIGNED_URL,
  CREATE_CAMPAIGN,
  CONFIRM_EMAIL,
  CHANGE_PASSWORD,
} = END_POINTS;
const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION;
const PAYMENT_API_URL = process.env.NEXT_PUBLIC_PAYMENT_API_URL;
const CAMPAIGN_API_URL = process.env.NEXT_PUBLIC_CAMPAIGN_API_URL;

export const signUp = (data) => {
  return postWithoutToken(`${API_URL}${API_VERSION}${SIGN_UP}`, data);
};
export const emailValidation = (data) => {
  return postWithoutToken(
    `${API_URL}${API_VERSION}campaign/email/validation`,
    data
  );
};
export const signIn = (data) => {
  return postWithoutToken(`${API_URL}${API_VERSION}${SING_IN}`, data);
};
export const logout = () => {
  return doPost(`${API_URL}${API_VERSION}${LOGOUT}`);
};

export const forgotPassword = (data) => {
  return postWithoutToken(`${API_URL}${API_VERSION}${FORGOT_PASSWORD}`, data);
};
export const changePassword = (data) => {
  return doPut(`${API_URL}${API_VERSION}${CHANGE_PASSWORD}`, data);
};
export const verifyToken = (data) => {
  return postWithoutToken(`${API_URL}${API_VERSION}${VERIFY_TOKEN}`, data);
};
export const resetPassword = (data) => {
  return postWithoutToken(`${API_URL}${API_VERSION}${RESET_PASSWORD}`, data);
};
export const socialLogin = (data) => {
  return postWithoutToken(`${API_URL}${API_VERSION}${SOCIAL_LOGIN}`, data);
};

export const getPreSignedUrl = (fileType, fileExtension) => {
  return doGet(
    `${API_URL}${API_VERSION}${FETCH_PRESIGNED_URL}?fileType=${fileType}&mimeType=${fileExtension}`
  );
};

export const uploadFile = (url, data, fileExtension) => {
  return doUploadFile(`${url}`, data, fileExtension);
};

export const createCampaign = (data) => {
  return doPost(`${CAMPAIGN_API_URL}${API_VERSION}${CREATE_CAMPAIGN}`, data);
};

export const postConfirmEmail = (data) => {
  return postWithoutToken(`${API_URL}${API_VERSION}${CONFIRM_EMAIL}`, data);
};

export const guestUserLogin = (data) => {
  return postWithoutToken(
    `${PAYMENT_API_URL}${API_VERSION}campaign-donations/guest-login`,
    data
  );
};
