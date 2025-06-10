import { RecipesProvider } from "@/context/recipesContext";
import { ShoppingListProvider } from "@/context/shoppingListContext";
import "@/global.css";
import { Ingredient, Recipe } from "@/types/recipes";
import { Stack } from "expo-router";

const testingRecipes: Recipe[] = [
  {
    id: 1,
    name: "Recipe 1",
    ingredients: [
      {
        name: "Ingredient 1",
        amount: 10,
        units: "g"
      } as Ingredient,
      {
        name: "Ingredient 2",
        amount: 15,
        units: "g"
      } as Ingredient,
      {
        name: "Ingredient 3",
        amount: 15,
        units: "ml"
      } as Ingredient,
    ]
  } as Recipe,
  {
    id: 2,
    name: "Recipe 2",
    ingredients: [
      {
        name: "Ingredient 1",
        amount: 10,
        units: "g"
      } as Ingredient,
      {
        name: "Ingredient 2",
        amount: 15,
        units: "g"
      } as Ingredient,
      {
        name: "Ingredient 3",
        amount: 15,
        units: "ml"
      } as Ingredient,
    ]
  } as Recipe,
  {
    id: 3,
    name: "Recipe 3",
    ingredients: [
      {
        name: "Ingredient 1",
        amount: 10,
        units: "g"
      } as Ingredient,
      {
        name: "Ingredient 2",
        amount: 15,
        units: "g"
      } as Ingredient,
      {
        name: "Ingredient 3",
        amount: 15,
        units: "ml"
      } as Ingredient,
    ]
  } as Recipe,
]

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
