import "@/i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { en, registerTranslation } from "react-native-paper-dates";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { IdsProvider } from "@/store/idsContext";
import { UserProvider } from "@/store/userContext";
import { useReactQueryDevTools } from "@dev-plugins/react-query";

import { Index as Modal } from "@/components/modal";
import { ConfirmationModalProvider, ModalProvider } from "@/store/modalContext";
import { UtilProvider } from "@/store/utilContext";
import "../global.css";

const queryClient = new QueryClient();
registerTranslation("en", en);

export default function RootLayout() {
  useReactQueryDevTools(queryClient);
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <QueryClientProvider client={queryClient}>
          <UserProvider>
            <IdsProvider>
              <ConfirmationModalProvider>
                <ModalProvider>
                  <UtilProvider>
                    <Stack screenOptions={{ headerShown: false }}>
                      <Stack.Screen name="(auth)" />
                      <Stack.Screen name="(app)" />
                    </Stack>
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
  );
}
