import { UserContext } from "@/store/userContext";
import axios, { AxiosRequestConfig } from "axios";
import { useContext } from "react";

const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_ENDPOINT ||
  "https://wild-joan-bring-days.trycloudflare.com"
).replace(/\/+$/, "");

export const apiEndpoint: string = `${API_BASE_URL}/api/v1`;

export const useApi = () => {
  const { userData } = useContext(UserContext);

  const apiRequest = async <T>(
    url: string,
    options?: AxiosRequestConfig,
  ): Promise<T> => {
    const normalizedUrl = url.replace(/^\/+/, "");

    const response = await axios({
      url: `${apiEndpoint}/${normalizedUrl}`,
      headers: {
        "Content-Type": "application/json",
        ...(userData?.token
          ? { Authorization: `Bearer ${userData.token}` }
          : {}),
        ...options?.headers,
      },
      ...options,
    });

    return response.data as T;
  };

  const getData = <T>(url: string, signal?: AbortSignal) =>
    apiRequest<T>(url, { signal });

  const postData = <T>(
    url: string,
    body: unknown,
    method = "POST",
    signal?: AbortSignal,
  ) =>
    apiRequest<T>(url, {
      method,
      data: JSON.stringify(body, (_, v) => (v === undefined ? null : v)),
      signal,
    });

  return { getData, postData, apiRequest };
};
