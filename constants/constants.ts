const normalizeUrl = (value?: string) => value?.replace(/\/+$/, "");

export const API_ENDPOINT =
  normalizeUrl(
    process.env.EXPO_PUBLIC_API_ENDPOINT || process.env.EXPO_PUBLIC_API_URL,
  ) ??
  (process.env.NODE_ENV === "development"
    ? "http://10.0.2.2:4000"
    : "https://alphabetsmsbackend.vercel.app");
