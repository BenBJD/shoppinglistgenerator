import { RecipesProvider } from "@/context/recipesContext";
import { ShoppingListProvider } from "@/context/shoppingListContext";
import "@/global.css";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <RecipesProvider>
      <ShoppingListProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </ShoppingListProvider>
    </RecipesProvider>
  );
}
