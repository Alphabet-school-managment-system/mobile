import { Stack } from "expo-router";

export default function TeacherLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="dashboard"
        options={{ title: "", headerShown: false }}
      />
    </Stack>
  );
}
