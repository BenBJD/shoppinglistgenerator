import { Stack } from "expo-router";

export default function recipesLayout() {
  return (
      <Stack
      screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="index"/>
      </Stack>
  );
}
