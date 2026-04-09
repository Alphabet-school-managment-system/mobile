import { useApi } from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import Toast from "react-native-toast-message";

export const useApiQuery = <T>(
  key: string[],
  url: string,
  enabled: boolean = true,
) => {
  const { getData } = useApi();

  return useQuery<T>({
    queryKey: key,
    queryFn: ({ signal }) => getData<T>(url, signal),
    enabled,
    meta: {
      onError: (error: unknown) => {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error instanceof Error ? error.message : "An error occurred",
        });
      },
    },
  });
};

export const useApiMutation = <T>(
  keyToInvalidate: string[],
  url: string,
  method: "POST" | "PUT" | "DELETE" | "PATCH" = "POST",
) => {
  const { postData } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: keyToInvalidate,
    mutationFn: ({
      body,
      signal,
    }: {
      body: unknown | any;
      signal?: AbortSignal;
    }) => postData<T>(url, body, method, signal),
    onSuccess: (result: any) => {
      queryClient.invalidateQueries({ queryKey: keyToInvalidate });
      Toast.show({
        type: "success",
        text1: "Success",
        text2:
          result?.message ??
          (method === "DELETE"
            ? "Data deleted successfully."
            : "Data saved successfully."),
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error instanceof Error
            ? error.message
            : isAxiosError(error)
              ? error.response?.data
              : "An error occurred",
      });
    },
  });
};
