import token from "@/utils/token/token";
import axios, {
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
import { baseUrl, ENVIRONMENT } from "@/config";

export const apiClient = axios.create({
  baseURL: baseUrl,
});

const logOnDev = (
  message: string,
  log?: AxiosResponse | InternalAxiosRequestConfig | AxiosError
) => {
  if (ENVIRONMENT === "development") {
    console.log(message, log);
  }
};

apiClient.interceptors.request.use((request) => {
  const jwtToken: string | null = token.getToken("token");

  const { method, url } = request;

  if (jwtToken) {
    request.headers["Authorization"] = `Bearer ${jwtToken}`;
    // request.headers["ngrok-skip-browser-warning"] = `Token ${jwtToken}`;
  }

  logOnDev(`🚀 [${method?.toUpperCase()}] ${url} | Request`, request);

  return request;
});

apiClient.interceptors.response.use(
  (response) => {
    const { method, url } = response.config;
    const { status } = response;

    logOnDev(
      `✨ [${method?.toUpperCase()}] ${url} | Response ${status}`,
      response
    );

    if (response.data && response.data.status === false) {
      const error = new Error(response.data.message || "Request failed");
      logOnDev(`🚨 [${method?.toUpperCase()}] ${url} | Error`, response.data);
      return Promise.reject(error);
    }

    return response;
  },
  (error) => {
    const { message } = error;
    const { status, data } = error.response || {};
    const { method, url } = error.config;

    if (status === 429) {
      token.removeToken("ACCESS_TOKEN_KEY");
      window.location.reload();
    }

    logOnDev(
      `🚨 [${method?.toUpperCase()}] ${url} | Error ${status} ${
        data?.message || ""
      } | ${message}`,
      error
    );

    throw error;
  }
);

const { get, post, put, delete: destroy } = apiClient;
export { get, post, put, destroy };
