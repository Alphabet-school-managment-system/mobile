import "@/i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import "../global.css";

export default function RootLayout() {
  const queryClient = new QueryClient();

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <SafeAreaView
          style={{
            flex: 1,
          }}
        >
          <QueryClientProvider client={queryClient}>
            <Stack screenOptions={{ headerShown: false }} />
          </QueryClientProvider>
          <Toast />
        </SafeAreaView>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
