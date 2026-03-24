import "@/i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import type { ComponentType } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { en, registerTranslation } from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { Index as BottomSheet } from "@/components/bottomSheet";
import { Index as Modal } from "@/components/modal";
import { BottomSheetProvider } from "@/store/bottomSheetContext";
import { IdsProvider } from "@/store/idsContext";
import { ConfirmationModalProvider, ModalProvider } from "@/store/modalContext";
import { UserProvider } from "@/store/userContext";
import { UtilProvider } from "@/store/utilContext";
import { useReactQueryDevTools } from "@dev-plugins/react-query";
import "../global.css";

const queryClient = new QueryClient();
registerTranslation("en", en);

function RootLayout() {
  useReactQueryDevTools(queryClient);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider>
          <QueryClientProvider client={queryClient}>
            <UserProvider>
              <IdsProvider>
                <ConfirmationModalProvider>
                  <ModalProvider>
                    <UtilProvider>
                      <BottomSheetProvider>
                        <Stack screenOptions={{ headerShown: false }}>
                          <Stack.Screen name="(auth)" />
                          <Stack.Screen name="(app)" />
                        </Stack>
                        <BottomSheet />
                      </BottomSheetProvider>
                    </UtilProvider>
                    <Modal />
                  </ModalProvider>
                </ConfirmationModalProvider>
              </IdsProvider>
            </UserProvider>
          </QueryClientProvider>
          <Toast />
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

let AppRoot: ComponentType = RootLayout;
const sentryDsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

if (sentryDsn) {
  try {
    const Sentry =
      require("@sentry/react-native") as typeof import("@sentry/react-native");
    Sentry.init({
      dsn: sentryDsn,
      enabled: true,
      enableNative: true,
      debug: false,
      environment: __DEV__ ? "development" : "production",
      tracesSampleRate: 1.0,
    });
    AppRoot = Sentry.wrap(RootLayout);
  } catch (error) {
    console.warn(
      "Sentry initialization failed, continuing without Sentry.",
      error,
    );
  }
}

export default AppRoot;
