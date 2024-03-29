
import { axiosInstance } from "../axios/axios";
import { useAuth } from "../store/AuthProvider/AuthProvider";
const useRefresh = () => {
  const { setAccessToken } = useAuth();
  const refresh = async () => {
    const { data } = await axiosInstance.get("/auth/token/refresh", {
      withCredentials: true,
    });
    setAccessToken(data.access_token);
    localStorage.setItem("auth_token", data.access_token);

    return data.access_token;
  };
  return refresh;
};

export default useRefresh;
