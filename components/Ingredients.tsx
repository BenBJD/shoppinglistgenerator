import ShoppingListContext from "@/context/shoppingListContext";
import { Ingredient } from "@/types/recipes";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from "nativewind";
import React, { useContext, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

interface IngredientListItemProps {
  ingredient: Ingredient;
  recipeName: string;
  onRemove: () => void;
  onUpdate: (updatedIngredient: Ingredient) => void;
}

export const IngredientListItem = ({ ingredient, recipeName, onRemove, onUpdate }: IngredientListItemProps) => {
  const currentTheme = useColorScheme();
  const colorScheme = currentTheme.colorScheme;
  const [isEditing, setIsEditing] = useState(false);
  const [editedIngredient, setEditedIngredient] = useState(ingredient);
  const [amountInput, setAmountInput] = useState(ingredient.amount.toString());
  const shoppingList = useContext(ShoppingListContext);

  const handleSave = () => {
    const amount = parseFloat(amountInput);
    if (!isNaN(amount) && amount > 0) {
      onUpdate({ ...editedIngredient, amount });
      setIsEditing(false);

      // Update shopping list if the recipe is in it
      if (shoppingList) {
        shoppingList.removeRecipeIngredients(recipeName);
        shoppingList.addRecipeIngredients(recipeName, [{ ...editedIngredient, amount }]);
      }
    }
  };

  const handleCancel = () => {
    setEditedIngredient(ingredient);
    setAmountInput(ingredient.amount.toString());
    setIsEditing(false);
  };

  return (
    <>
      <View
        className={`flex-row justify-between items-center p-4 mx-5 mb-4 rounded-2xl ${colorScheme === 'dark' ? 'bg-neutral-800' : 'bg-gray-100'}`}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <View className="flex-1">
          <Text className={`text-xl ${colorScheme === 'dark' ? 'text-gray-200' : 'text-black'}`}>{ingredient.name}</Text>
          <Text className={`text-sm ${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {ingredient.amount} {ingredient.units}
          </Text>
        </View>
        <View className="flex-row gap-2">
          <Pressable
            onPress={() => setIsEditing(true)}
            className={`p-sm rounded-full ${colorScheme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'}`}
            android_ripple={{ color: '#90caf9' }}
          >
            <MaterialCommunityIcons name="pencil-outline" size={22} color="white" />
          </Pressable>
          <Pressable
            onPress={onRemove}
            className={`p-sm rounded-full ${colorScheme === 'dark' ? 'bg-red-600' : 'bg-red-500'}`}
            android_ripple={{ color: '#e57373' }}
          >
            <MaterialCommunityIcons name="delete-outline" size={22} color="white" />
          </Pressable>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditing}
        onRequestClose={handleCancel}
      >
        <View className="flex-1 justify-end">
          <View className={`${colorScheme === 'dark' ? 'bg-neutral-800' : 'bg-white'} rounded-t-2xl p-lg`}
            style={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: -2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <View className="flex-row justify-between items-center mb-md">
              <Text className={`text-xl font-medium ${colorScheme === 'dark' ? 'text-gray-200' : 'text-black'}`}>Edit Ingredient</Text>
              <Pressable onPress={handleCancel}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={colorScheme === 'dark' ? '#E5E7EB' : '#000000'}
                />
              </Pressable>
            </View>
            <TextInput
              className={`p-md rounded-lg mb-md ${colorScheme === 'dark' ? 'bg-neutral-700 text-white' : 'bg-gray-100 text-black'}`}
              value={editedIngredient.name}
              onChangeText={(text) => setEditedIngredient({ ...editedIngredient, name: text })}
              placeholder="Ingredient name"
              placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
            />
            <View className="flex-row gap-4 mb-lg">
              <TextInput
                className={`flex-1 p-md rounded-lg ${colorScheme === 'dark' ? 'bg-neutral-700 text-white' : 'bg-gray-100 text-black'}`}
                value={amountInput}
                onChangeText={(text) => {
                  // Allow empty string, numbers, and one decimal point
                  if (text === '' || /^\d*\.?\d*$/.test(text)) {
                    setAmountInput(text);
                    setEditedIngredient({ ...editedIngredient, amount: text === '' ? 0 : parseFloat(text) || 0 });
                  }
                }}
                keyboardType="numeric"
                placeholder="Amount"
                placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
              />
              <TextInput
                className={`flex-1 p-md rounded-lg ${colorScheme === 'dark' ? 'bg-neutral-700 text-white' : 'bg-gray-100 text-black'}`}
                value={editedIngredient.units}
                onChangeText={(text) => setEditedIngredient({ ...editedIngredient, units: text })}
                placeholder="Units (optional)"
                placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
              />
            </View>
            <View className="flex-row gap-4">
              <Pressable
                onPress={handleSave}
                className={`flex-1 p-md rounded-lg ${colorScheme === 'dark' ? 'bg-green-600' : 'bg-green-500'}`}
              >
                <Text className="text-white text-center text-base font-medium">Save Changes</Text>
              </Pressable>
              <Pressable
                onPress={onRemove}
                className={`flex-1 p-md rounded-lg ${colorScheme === 'dark' ? 'bg-red-600' : 'bg-red-500'}`}
              >
                <Text className="text-white text-center text-base font-medium">Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
