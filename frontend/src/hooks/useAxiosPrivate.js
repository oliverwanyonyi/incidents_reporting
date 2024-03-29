import { useEffect } from "react";
import useRefresh from "./useRefresh";
import { axiosInstance } from "../axios/axios";
import { useAuth } from "../store/AuthProvider/AuthProvider";
const useAxiosPrivate = () => {
  const refresh = useRefresh();
  const { authUser, setAccessToken,accessToken, logout } = useAuth();

  useEffect(() => {

   
    const requestIntercept = axiosInstance.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = "Bearer " + accessToken;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const responseIntercept = axiosInstance.interceptors.response.use(
      (res) => res,
      async (error) => {
        const prevReq = error?.config;
        if (error?.response?.status === 401 && !prevReq?.sent) {
          prevReq.sent = true;
          try {
            const new_access_token = await refresh();
            prevReq.headers.Authorization = "Bearer " + new_access_token;
            setAccessToken(new_access_token);
            return axiosInstance(prevReq);
          } catch (refreshError) {
            console.log(refreshError);
            console.error(
              "Access token refresh failed:",
              refreshError.response?.data.message
            );
            // Handle access token refresh failure (e.g., redirect to login page)
            return logout(); // Log out the user when the refresh token has expired
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(responseIntercept);
      axiosInstance.interceptors.request.eject(requestIntercept);
    };
  }, [accessToken, refresh]);

  return axiosInstance;
};

export default useAxiosPrivate;
