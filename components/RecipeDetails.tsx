import ShoppingListContext from "@/context/shoppingListContext";
import { Recipe } from "@/types/recipes";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from "nativewind";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { IngredientListItem } from "./Ingredients";

interface RecipeDetailsProps {
  recipe: Recipe;
  onEdit: () => void;
  onDelete: () => void;
  onAddToShoppingList: () => void;
}

export const RecipeDetails = ({
  recipe,
  onEdit,
  onDelete,
  onAddToShoppingList,
}: RecipeDetailsProps) => {
  const currentTheme = useColorScheme();
  const colorScheme = currentTheme.colorScheme;
  const textColor = colorScheme === "dark" ? "text-gray-200" : "text-gray-900";
  const shoppingList = React.useContext(ShoppingListContext);

  const handleAddToShoppingList = () => {
    if (shoppingList) {
      shoppingList.addRecipeIngredients(recipe.name, recipe.ingredients);
    }
  };

  return (
    <View className="flex-1">
      <View className="p-6">
        <View className="flex-row justify-between items-center mb-6">
          <Text className={`text-2xl font-bold ${textColor}`}>{recipe.name}</Text>
          <View className="flex-row">
            <Pressable
              onPress={onEdit}
              className={`p-3 rounded-full ${colorScheme === 'dark' ? 'bg-neutral-700' : 'bg-gray-100'}`}
              android_ripple={{ color: colorScheme === 'dark' ? '#4B5563' : '#E5E7EB' }}
            >
              <MaterialCommunityIcons
                name="pencil"
                size={24}
                color={colorScheme === 'dark' ? '#60A5FA' : '#3B82F6'}
              />
            </Pressable>
            <Pressable
              onPress={onDelete}
              className={`ml-3 p-3 rounded-full ${colorScheme === 'dark' ? 'bg-neutral-700' : 'bg-gray-100'}`}
              android_ripple={{ color: colorScheme === 'dark' ? '#4B5563' : '#E5E7EB' }}
            >
              <MaterialCommunityIcons
                name="delete"
                size={24}
                color={colorScheme === 'dark' ? '#EF4444' : '#DC2626'}
              />
            </Pressable>
          </View>
        </View>
        <Text className={`text-xl font-semibold mb-4 ${textColor}`}>Ingredients</Text>
        {recipe.ingredients.map((ingredient, index) => (
          <IngredientListItem
            key={index}
            ingredient={ingredient}
            onRemove={() => { }}
            onUpdate={() => { }}
            recipeName={recipe.name}
          />
        ))}
        <Pressable
          onPress={handleAddToShoppingList}
          className={`p-4 rounded-xl mt-6 ${colorScheme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'}`}
          android_ripple={{ color: colorScheme === 'dark' ? '#2563EB' : '#3B82F6' }}
        >
          <Text className="text-white font-medium text-center">
            Add to Shopping List
          </Text>
        </Pressable>
      </View>
    </View>
  );
}; 
