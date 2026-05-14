import { Index as Loading } from "@/components/common/loading";
import { useApiQuery } from "@/hooks/useApi";
import { AcademicYear } from "@/models";
import { IdsContext } from "@/store/providers/IdContext";
import { UserContext, UserDataType } from "@/store/providers/UserContext";
import { UtilContext } from "@/store/providers/UtilContext";
import { queryClient } from "@/store/query/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Redirect, Stack } from "expo-router";
import { useContext, useEffect, useState } from "react";

function AppLayoutContent() {
  const { userData, setUserData, isHydrated } = useContext(UserContext);
  const { setIds } = useContext(IdsContext);
  const [idsReady, setIdsReady] = useState(false);
  const { Util, setUtil } = useContext(UtilContext);

  const apiEndpoint =
    userData?.role && userData?.better_auth_userId
      ? `${userData.role}/getIds/${userData.better_auth_userId}`
      : "";

  const {
    data: ids,
    isLoading: isGettingIds,
    isError: hasIdsError,
  } = useApiQuery<any>([apiEndpoint], apiEndpoint, Boolean(apiEndpoint));

  const { data: serverDate } = useApiQuery<string>(
    ["server-date"],
    "util/server-date",
    true,
  );

  const { data: academic_year } = useApiQuery<AcademicYear>(
    ["academic-year"],
    ids?.branch?.id ? `academic-year/${ids.branch?.id}` : "",
    Boolean(ids?.branch?.id),
  );

  useEffect(() => {
    const nextUtil = {
      ...Util,
      ...(serverDate ? { serverDate } : {}),
      ...(academic_year ? { acadamic_year: academic_year } : {}),
    };

    const utilChanged =
      nextUtil.serverDate !== Util.serverDate ||
      nextUtil.acadamic_year?.id !== Util.acadamic_year?.id;

    if (utilChanged) {
      setUtil(nextUtil);
    }
  }, [Util, academic_year, serverDate, setUtil]);

  useEffect(() => {
    if (!apiEndpoint) {
      setIdsReady(false);
      return;
    }

    if (ids) {
      setIds({
        branchId: ids?.branch?.id,
        branchName: ids?.branch?.name,
        schoolId: ids?.branch?.school_id,
        academicYearId: ids?.academic_year?.id,
      });
      setUserData((prev: UserDataType) => ({
        ...prev,
        id: ids?.user?.id,
        token: ids?.token,
        subject_specialization: ids?.user?.subject_specialization,
      }));
    }

    if (ids || hasIdsError || !isGettingIds) {
      setIdsReady(true);
    }
  }, [apiEndpoint, ids, hasIdsError, isGettingIds, setIds]);

  if (!isHydrated) {
    return <Loading showLoadingSpin loadingText="Restoring session..." />;
  }

  if (!userData?.skipOnboarding) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  if (!userData?.role) {
    return <Redirect href="/(auth)/who-are-you" />;
  }

  if (!userData?.better_auth_token) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!idsReady) {
    return <Loading showLoadingSpin loadingText="Loading account data..." />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(teacher)" />
      <Stack.Screen name="(student)" />
      <Stack.Screen name="(parent)" />
    </Stack>
  );
}

export default function AppLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppLayoutContent />
    </QueryClientProvider>
  );
}
