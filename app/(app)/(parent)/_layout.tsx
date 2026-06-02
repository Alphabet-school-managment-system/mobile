// import { CustomHeaderOption } from "@/app/(auth)/_layout";
// import { CustomHeaderRightIcons } from "@/components/common/SidebarBaseLayout";
// import { Stack } from "expo-router";

// export default function ParentLayout() {
//   const backRoute = "/(app)/(teacher)/assessment";
//   return (
//     <Stack screenOptions={{ headerShown: true, headerBackVisible: false }}>
//       <Stack.Screen
//         name="index"
//         options={CustomHeaderOption({
//           title: "Home",
//           headerShown: true,
//           showBackIcon: false,
//           headerRight: () => <CustomHeaderRightIcons />,
//         })}
//       />
//     </Stack>
//   );
// }

import { Index as SidebarBaseLayout } from "@/components/common/SidebarBaseLayout";
export default function ParentLayout() {
  return <SidebarBaseLayout />;
}
