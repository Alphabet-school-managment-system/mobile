import { UserContext } from "@/store/providers/UserContext";
import { Redirect } from "expo-router";
import { useContext } from "react";

export default function AppIndex() {
  const { userData } = useContext(UserContext);

  if (userData?.role === "teacher") {
    return <Redirect href="/(app)/(teacher)/dashboard" />;
  }

  if (userData?.role === "student") {
    return <Redirect href="/(app)/(student)" />;
  }

  if (userData?.role === "parent") {
    return <Redirect href="/(app)/(parent)" />;
  }

  return <Redirect href="/(auth)/who-are-you" />;
}
