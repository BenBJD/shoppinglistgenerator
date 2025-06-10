import RecipesContext from "@/context/recipesContext";
import ShoppingListContext from "@/context/shoppingListContext";
import { Recipe } from "@/types/recipes";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useContext, useRef, useState } from "react";
import { Animated, Modal, Pressable, Text, View } from "react-native";

export const RecipeListItem = ({ recipe }: { recipe: Recipe }) => {
  const currentTheme = useColorScheme();
  const colorScheme = currentTheme.colorScheme;
  const textColor = colorScheme == "dark" ? "text-gray-200" : "text-black"
  const context = useContext(ShoppingListContext);
  const recipesContext = useContext(RecipesContext);
  const scale = useRef(new Animated.Value(1)).current;
  const deleteScale = useRef(new Animated.Value(1)).current;
  const [isPortionsModalVisible, setIsPortionsModalVisible] = useState(false);
  const [selectedPortions, setSelectedPortions] = useState(recipe.portions);

  if (!context || !recipesContext) return null;
  const { addRecipeIngredients, removeRecipeIngredients, items } = context;
  const { removeRecipe } = recipesContext;

  // Check if any of this recipe's ingredients are in the shopping list
  const isInShoppingList = items.some(item => item.recipes.includes(recipe.name));

  const handleToggleList = () => {
    if (isInShoppingList) {
      removeRecipeIngredients(recipe.name);
    } else {
      setIsPortionsModalVisible(true);
    }
  };

  const handleAddWithPortions = () => {
    const multiplier = selectedPortions / recipe.portions;
    const scaledIngredients = recipe.ingredients.map(ing => ({
      ...ing,
      amount: ing.amount * multiplier
    }));
    addRecipeIngredients(recipe.name, scaledIngredients);
    setIsPortionsModalVisible(false);
  };

  const handleDecreasePortions = () => {
    const newPortions = Math.max(recipe.portions, selectedPortions - recipe.portions);
    setSelectedPortions(newPortions);
  };

  const handleIncreasePortions = () => {
    setSelectedPortions(selectedPortions + recipe.portions);
  };

  const handleDeleteRecipe = () => {
    removeRecipe(recipe.id);
  };

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleDeletePressIn = () => {
    Animated.spring(deleteScale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handleDeletePressOut = () => {
    Animated.spring(deleteScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      <Animated.View style={{ transform: [{ scale }] }}>
        <View className={`flex-row justify-between items-center p-4 mx-5 mb-5 rounded-xl ${colorScheme === 'dark' ? 'bg-neutral-800' : 'bg-gray-100'}`}>
          <Link href={{ pathname: "/(tabs)/(recipes)/[id]", params: { id: recipe.id } }} asChild>
            <Pressable
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              className="flex-1"
            >
              <Text className={`text-xl ${textColor}`}>{recipe.name}</Text>
              <Text className={`text-sm ${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {recipe.ingredients.length} ingredients • {recipe.portions} portions
              </Text>
            </Pressable>
          </Link>
          <View className="flex-row items-center">
            <Pressable
              onPress={handleToggleList}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              className={`px-4 py-2 rounded-lg mr-2 ${isInShoppingList
                ? (colorScheme === 'dark' ? 'bg-red-600' : 'bg-red-500')
                : (colorScheme === 'dark' ? 'bg-blue-600' : 'bg-blue-500')}`}
            >
              <Text className="text-white">{isInShoppingList ? 'Remove' : 'Add to List'}</Text>
            </Pressable>
            <Animated.View style={{ transform: [{ scale: deleteScale }] }}>
              <Pressable
                onPress={handleDeleteRecipe}
                onPressIn={handleDeletePressIn}
                onPressOut={handleDeletePressOut}
                className="p-2 rounded-full"
                android_ripple={{ color: '#e57373' }}
              >
                <MaterialCommunityIcons name="delete" size={22} color={colorScheme === 'dark' ? '#ef9a9a' : '#e57373'} />
              </Pressable>
            </Animated.View>
          </View>
        </View>
      </Animated.View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isPortionsModalVisible}
        onRequestClose={() => setIsPortionsModalVisible(false)}
      >
        <View className="flex-1 justify-end">
          <View className={`${colorScheme === 'dark' ? 'bg-neutral-800' : 'bg-white'} rounded-t-3xl p-6`}
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
            <View className="flex-row justify-between items-center mb-4">
              <Text className={`text-2xl ${textColor}`}>Select Portions</Text>
              <Pressable onPress={() => setIsPortionsModalVisible(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={colorScheme === 'dark' ? '#E5E7EB' : '#000000'}
                />
              </Pressable>
            </View>
            <View className="flex-row justify-between items-center mb-6">
              <Pressable
                onPress={handleDecreasePortions}
                className={`p-2 rounded-full ${colorScheme === 'dark' ? 'bg-neutral-700' : 'bg-gray-200'}`}
              >
                <MaterialCommunityIcons name="minus" size={24} color={colorScheme === 'dark' ? '#E5E7EB' : '#000000'} />
              </Pressable>
              <View className="items-center">
                <Text className={`text-2xl ${textColor}`}>{selectedPortions} portions</Text>
                <Text className={`text-sm ${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  ({selectedPortions / recipe.portions}x recipe)
                </Text>
              </View>
              <Pressable
                onPress={handleIncreasePortions}
                className={`p-2 rounded-full ${colorScheme === 'dark' ? 'bg-neutral-700' : 'bg-gray-200'}`}
              >
                <MaterialCommunityIcons name="plus" size={24} color={colorScheme === 'dark' ? '#E5E7EB' : '#000000'} />
              </Pressable>
            </View>
            <Pressable
              onPress={handleAddWithPortions}
              className={`p-4 rounded-xl ${colorScheme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'}`}
            >
              <Text className="text-white text-center text-lg">Add to Shopping List</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};
