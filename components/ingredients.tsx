import ShoppingListContext from "@/context/shoppingListContext";
import { Ingredient } from "@/types/recipes";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from "nativewind";
import React, { useContext, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

interface IngredientListItemProps {
  ingredient: Ingredient;
  onRemove: () => void;
  onUpdate: (updatedIngredient: Ingredient) => void;
  recipeName: string;
}

export const IngredientListItem = ({
  ingredient,
  onRemove,
  onUpdate,
  recipeName,
}: IngredientListItemProps) => {
  const currentTheme = useColorScheme();
  const colorScheme = currentTheme.colorScheme;
  const textColor = colorScheme == "dark" ? "text-gray-200" : "text-black";
  const cardBg = colorScheme === 'dark' ? 'bg-neutral-800' : 'bg-gray-100';
  const [isEditing, setIsEditing] = useState(false);
  const [editedAmount, setEditedAmount] = useState(ingredient.amount.toString());
  const [editedUnits, setEditedUnits] = useState(ingredient.units || '');
  const shoppingList = useContext(ShoppingListContext);

  const handleSave = () => {
    const newAmount = parseFloat(editedAmount);
    if (!isNaN(newAmount) && newAmount > 0) {
      const updatedIngredient = {
        ...ingredient,
        amount: newAmount,
        units: editedUnits || undefined,
      };
      onUpdate(updatedIngredient);

      // Update shopping list if the recipe is in it
      if (shoppingList) {
        shoppingList.removeRecipeIngredients(recipeName);
        shoppingList.addRecipeIngredients(recipeName, [updatedIngredient]);
      }

      setIsEditing(false);
    }
  };

  return (
    <View
      className={`flex-row items-center justify-between p-4 mx-5 mb-4 rounded-2xl ${cardBg}`}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View className="flex-1">
        <Text className={`text-lg font-medium mb-1 ${textColor}`}>{ingredient.name}</Text>
        {isEditing ? (
          <View className="flex-row mt-1 gap-2">
            <TextInput
              className={`flex-1 p-2 rounded-lg ${colorScheme === 'dark' ? 'bg-neutral-700 text-white' : 'bg-white text-black'}`}
              value={editedAmount}
              onChangeText={setEditedAmount}
              keyboardType="numeric"
              placeholder="Amount"
              placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
            />
            <TextInput
              className={`flex-1 p-2 rounded-lg ${colorScheme === 'dark' ? 'bg-neutral-700 text-white' : 'bg-white text-black'}`}
              value={editedUnits}
              onChangeText={setEditedUnits}
              placeholder="Units (optional)"
              placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
            />
          </View>
        ) : (
          <Text className={`text-sm ${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {ingredient.amount} {ingredient.units ? ingredient.units : ''}
          </Text>
        )}
      </View>
      <View className="flex-row items-center ml-2">
        {isEditing ? (
          <>
            <Pressable onPress={handleSave} className="mr-2 p-2 rounded-full" android_ripple={{ color: '#1976D2' }}>
              <MaterialCommunityIcons name="content-save" size={22} color={colorScheme === 'dark' ? '#90caf9' : '#1976D2'} />
            </Pressable>
            <Pressable onPress={() => setIsEditing(false)} className="p-2 rounded-full" android_ripple={{ color: '#e57373' }}>
              <MaterialCommunityIcons name="close" size={22} color={colorScheme === 'dark' ? '#ef9a9a' : '#e57373'} />
            </Pressable>
          </>
        ) : (
          <>
            <Pressable onPress={() => setIsEditing(true)} className="mr-2 p-2 rounded-full" android_ripple={{ color: '#1976D2' }}>
              <MaterialCommunityIcons name="pencil" size={22} color={colorScheme === 'dark' ? '#90caf9' : '#1976D2'} />
            </Pressable>
            <Pressable onPress={onRemove} className="p-2 rounded-full" android_ripple={{ color: '#e57373' }}>
              <MaterialCommunityIcons name="delete" size={22} color={colorScheme === 'dark' ? '#ef9a9a' : '#e57373'} />
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
};
