import axios from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import toast from "react-hot-toast";
import { END_POINTS } from "./constant";

// Create axios instance
const axiosInstance = axios.create({
  timeout: 30000, // 30 seconds timeout
});

// Store for requests that failed due to 401 and are waiting for token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Function to get a new access token using the refresh token
const refreshAccessToken = async () => {
  const refreshToken = getCookie("madinah_refresh");
  if (!refreshToken) {
    return Promise.reject("No refresh token available");
  }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_API_VERSION}${END_POINTS.TOKEN}`,
      { refreshToken },
      { headers: getHeaderWithoutToken() }
    );

    if (response?.data?.success) {
      const { accessToken, refreshToken: newRefreshToken } = response.data.data;
      setCookie("token", accessToken);
      setCookie("madinah_refresh", newRefreshToken);
      return accessToken;
    } else {
      throw new Error(response?.data?.message || "Failed to refresh token");
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

// Request interceptor - Add auth headers
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token to requests if it exists
    const token = getCookie("token");
    if (token && config.headers) {
      config.headers.Authorization = ` ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, wait for the new token
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = ` ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);
        originalRequest.headers.Authorization = ` ${newToken}`;
        isRefreshing = false;
        return axiosInstance(originalRequest);
      } catch (error) {
        processQueue(error, null);
        isRefreshing = false; // Clear user session
        deleteCookie("token");
        deleteCookie("madinah_refresh");
        deleteCookie("name");

        // Only redirect if in browser context
        if (typeof window !== "undefined") {
          toast.error(
            "For your security, your session has timed out due to inactivity. Please log in again to continue.",
            {
              duration: 10000,
            }
          );

          // Set a flag to show login modal after redirect
          localStorage.setItem("showLoginModalAfterRedirect", "true");

          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
        }

        return Promise.reject(error);
      }
    }

    // Handle 403 errors
    if (error.response?.status === 403) {
      toast.error("Not Authorized");
    }

    return Promise.reject(error);
  }
);

const getHeaderWithoutToken = () => {
  const clientApiKey = process.env.NEXT_PUBLIC_CLIENT_API_KEY;
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "md-cli-app#J5keP": `${clientApiKey}`,
    "md-cli-id": "web-usr",
    "Access-Control-Allow-Origin": "*",
    Origin: "https://www.madinah.com",
  };
  return headers;
};

export const postWithoutToken = async (endPoint, body) => {
  try {
    const result = await axios.post(endPoint, body, {
      headers: getHeaderWithoutToken(),
    });

    return result;
  } catch (e) {
    return e.response;
  }
};

// Helper function to get headers with token
export const getHeader = (serverSideToken, clientIp) => {
  const clientApiKey = process.env.NEXT_PUBLIC_CLIENT_API_KEY;
  const userData = getCookie("token") || serverSideToken;

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "md-cli-app#J5keP": `${clientApiKey}`,
    "md-cli-id": "web-usr",
    Authorization: userData ? ` ${userData}` : null,
    "Access-Control-Allow-Origin": "*",
    Origin: "https://www.madinah.com",
    "X-Forwarded-For": clientIp,
  };
  return headers;
};

const multiPartForm = (fileExtension) => {
  const headers = {
    "Cache-control": "no-cache",
    "Content-Type": `image/${fileExtension}`,
    Accept: "*/*",
  };
  return headers;
};

// Update request methods to use the axiosInstance with interceptors
export const doPost = async (endPoint, body) => {
  try {
    const clientApiKey = process.env.NEXT_PUBLIC_CLIENT_API_KEY;
    const result = await axiosInstance.post(endPoint, body, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "md-cli-app#J5keP": `${clientApiKey}`,
        "md-cli-id": "web-usr",
        "Access-Control-Allow-Origin": "*",
        Origin: "https://www.madinah.com",
      },
    });

    return result;
  } catch (e) {
    if (e.response) {
      return e.response;
    }
    return {
      status: 500,
      data: { success: false, message: e.message || "An error occurred" },
    };
  }
};

export const doGet = async (endPoint, serverSideToken = null) => {
  try {
    const clientApiKey = process.env.NEXT_PUBLIC_CLIENT_API_KEY;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "md-cli-app#J5keP": `${clientApiKey}`,
        "md-cli-id": "web-usr",
        "Access-Control-Allow-Origin": "*",
        Origin: "https://www.madinah.com",
      },
    };

    // If server-side token is provided, use it instead of interceptor
    if (serverSideToken) {
      config.headers.Authorization = ` ${serverSideToken}`;
    }

    const result = await axiosInstance.get(endPoint, config);
    return result;
  } catch (e) {
    if (e.response) {
      return e.response;
    }
    return {
      status: 500,
      data: { success: false, message: e.message || "An error occurred" },
    };
  }
};

export const doGetIp = async (endPoint, serverSideToken = null, ip) => {
  try {
    const clientApiKey = process.env.NEXT_PUBLIC_CLIENT_API_KEY;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "md-cli-app#J5keP": `${clientApiKey}`,
        "md-cli-id": "web-usr",
        "Access-Control-Allow-Origin": "*",
        Origin: "https://www.madinah.com",
        "X-Forwarded-For": ip,
      },
    };

    // If server-side token is provided, use it instead of interceptor
    if (serverSideToken) {
      config.headers.Authorization = ` ${serverSideToken}`;
    }

    const result = await axiosInstance.get(endPoint, config);
    return result;
  } catch (e) {
    if (e.response) {
      return e.response;
    }
    return {
      status: 500,
      data: { success: false, message: e.message || "An error occurred" },
    };
  }
};

export const doPut = async (endPoint, body) => {
  try {
    const clientApiKey = process.env.NEXT_PUBLIC_CLIENT_API_KEY;
    const result = await axiosInstance.put(endPoint, body, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "md-cli-app#J5keP": `${clientApiKey}`,
        "md-cli-id": "web-usr",
        "Access-Control-Allow-Origin": "*",
        Origin: "https://www.madinah.com",
      },
    });
    return result;
  } catch (e) {
    if (e.response) {
      return e.response;
    }
    return {
      status: 500,
      data: { success: false, message: e.message || "An error occurred" },
    };
  }
};

export const doPatch = async (endPoint, body) => {
  try {
    const clientApiKey = process.env.NEXT_PUBLIC_CLIENT_API_KEY;
    const result = await axiosInstance.patch(endPoint, body, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "md-cli-app#J5keP": `${clientApiKey}`,
        "md-cli-id": "web-usr",
        "Access-Control-Allow-Origin": "*",
        Origin: "https://www.madinah.com",
      },
    });

    return result;
  } catch (e) {
    if (e.response) {
      return e.response;
    }
    return {
      status: 500,
      data: { success: false, message: e.message || "An error occurred" },
    };
  }
};

export const doUploadFile = async (endPoint, body, fileExtension) => {
  try {
    const result = await axios.put(endPoint, body, {
      headers: multiPartForm(fileExtension),
    });

    return result;
  } catch (e) {
    if (e.response) {
      const status = e.response.status;
      if (status === 401) {
        deleteCookie("token");
        deleteCookie("madinah_refresh");
        deleteCookie("name");
      }
      if (status === 403) {
        toast.error("Not Authorized");
      }
      return e.response;
    }
    return {
      status: 500,
      data: { success: false, message: e.message || "An error occurred" },
    };
  }
};

export const doDelete = async (endPoint, body) => {
  try {
    const clientApiKey = process.env.NEXT_PUBLIC_CLIENT_API_KEY;
    const result = await axiosInstance.delete(endPoint, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "md-cli-app#J5keP": `${clientApiKey}`,
        "md-cli-id": "web-usr",
        "Access-Control-Allow-Origin": "*",
        Origin: "https://www.madinah.com",
      },
      data: body,
    });

    return result;
  } catch (e) {
    if (e.response) {
      return e.response;
    }
    return {
      status: 500,
      data: { success: false, message: e.message || "An error occurred" },
    };
  }
};
