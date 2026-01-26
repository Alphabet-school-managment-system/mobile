export const apiEndpoint: string = "http://localhost:4000/api/v1";
import axios, { AxiosRequestConfig } from "axios";
const token = process.env.NEXT_PUBLIC_API_TOKEN || null;

export const apiRequest = async <T>(
  url: string,
  options?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await axios({
      url: `${apiEndpoint}/${url}`,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
      ...options,
    });

    return response.data as T;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        error.response.data?.message ||
          error.response.data?.error ||
          "Backend error occurred"
      );
    } else {
      throw new Error(error.message);
    }
  }
};

export const getData = <T>(url: string, signal?: AbortSignal) =>
  apiRequest<T>(url, { signal });

export const postData = <T>(
  url: string,
  body: unknown,
  method = "POST",
  signal?: AbortSignal
) => apiRequest<T>(url, {
    method,
    data: JSON.stringify(body, (_, v) => (v === undefined ? null : v)),
    signal,
  });