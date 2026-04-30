import { Redirect } from "expo-router";
import { useContext } from "react";
import { UserContext } from "@/store/userContext";

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

  return <Redirect href="/(auth)/whoAreYou" />;
}
