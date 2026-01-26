export const API_ENDPOINT =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://alphabetsmsbackend.vercel.app";
