import RecipesContext from "@/context/recipesContext";
import ShoppingListContext from "@/context/shoppingListContext";
import { Recipe } from "@/types/recipes";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useContext, useRef, useState } from "react";
import { Animated, Modal, Pressable, Text, TextInput, View } from "react-native";

export const RecipeListItem = ({ recipe }: { recipe: Recipe }) => {
  const currentTheme = useColorScheme();
  const colorScheme = currentTheme.colorScheme;
  const [isPortionsModalVisible, setIsPortionsModalVisible] = useState(false);
  const [selectedPortions, setSelectedPortions] = useState(recipe.portions);
  const deleteScale = useRef(new Animated.Value(1)).current;
  const recipesContext = useContext(RecipesContext);
  const shoppingList = useContext(ShoppingListContext);

  // Check if any of this recipe's ingredients are in the shopping list
  const isInShoppingList = shoppingList?.items.some(item => item.recipes.includes(recipe.name)) ?? false;

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

  const handleDeleteRecipe = () => {
    if (recipesContext) {
      recipesContext.removeRecipe(recipe.id);
    }
  };

  const handleToggleShoppingList = () => {
    if (shoppingList) {
      if (isInShoppingList) {
        shoppingList.removeRecipeIngredients(recipe.name);
      } else {
        setIsPortionsModalVisible(true);
      }
    }
  };

  const handleAddWithPortions = () => {
    if (shoppingList) {
      const multiplier = selectedPortions / recipe.portions;
      const scaledIngredients = recipe.ingredients.map(ing => ({
        ...ing,
        amount: ing.amount * multiplier
      }));
      shoppingList.addRecipeIngredients(recipe.name, scaledIngredients);
      setIsPortionsModalVisible(false);
    }
  };

  const handleDecreasePortions = () => {
    const currentMultiplier = selectedPortions / recipe.portions;
    if (currentMultiplier > 0.5) {
      setSelectedPortions(Math.max(recipe.portions * 0.5, selectedPortions - recipe.portions * 0.5));
    }
  };

  const handleIncreasePortions = () => {
    setSelectedPortions(selectedPortions + recipe.portions * 0.5);
  };

  return (
    <>
      <Animated.View
        className={`mx-5 mb-4 p-4 rounded-2xl ${colorScheme === 'dark' ? 'bg-neutral-800' : 'bg-gray-100'}`}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <View className="flex-row justify-between items-center">
          <Link href={{ pathname: "/(tabs)/(recipes)/[id]", params: { id: recipe.id } }} asChild>
            <Pressable className="flex-1">
              <Text className={`text-xl ${colorScheme === 'dark' ? 'text-gray-200' : 'text-black'}`}>{recipe.name}</Text>
              <Text className={`text-sm ${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {recipe.ingredients.length} ingredients • {recipe.portions} portions
              </Text>
            </Pressable>
          </Link>
          <View className="flex-row gap-2">
            <Pressable
              onPress={handleToggleShoppingList}
              className={`p-sm rounded-full ${isInShoppingList
                ? (colorScheme === 'dark' ? 'bg-red-600' : 'bg-red-500')
                : (colorScheme === 'dark' ? 'bg-blue-600' : 'bg-blue-500')}`}
              android_ripple={{ color: isInShoppingList ? '#ef9a9a' : '#90caf9' }}
            >
              <MaterialCommunityIcons
                name={isInShoppingList ? "cart-remove" : "cart-plus"}
                size={22}
                color="white"
              />
            </Pressable>
            <Animated.View style={{ transform: [{ scale: deleteScale }] }}>
              <Pressable
                onPress={handleDeleteRecipe}
                onPressIn={handleDeletePressIn}
                onPressOut={handleDeletePressOut}
                className="p-sm rounded-full"
                android_ripple={{ color: '#e57373' }}
              >
                <MaterialCommunityIcons name="delete-outline" size={22} color={colorScheme === 'dark' ? '#ef9a9a' : '#e57373'} />
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
              <Text className={`text-xl font-medium ${colorScheme === 'dark' ? 'text-gray-200' : 'text-black'}`}>Select Portions</Text>
              <Pressable onPress={() => setIsPortionsModalVisible(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={colorScheme === 'dark' ? '#E5E7EB' : '#000000'}
                />
              </Pressable>
            </View>
            <View className="flex-row justify-between items-center mb-lg">
              <Pressable
                onPress={handleDecreasePortions}
                className={`p-sm rounded-full ${colorScheme === 'dark' ? 'bg-neutral-700' : 'bg-gray-200'}`}
              >
                <MaterialCommunityIcons name="minus" size={24} color={colorScheme === 'dark' ? '#E5E7EB' : '#000000'} />
              </Pressable>
              <View className="items-center">
                <Text className={`text-xl font-medium ${colorScheme === 'dark' ? 'text-gray-200' : 'text-black'}`}>{selectedPortions} portions</Text>
                <Text className={`text-sm mt-xs ${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  ({(selectedPortions / recipe.portions).toFixed(1)}x recipe)
                </Text>
              </View>
              <Pressable
                onPress={handleIncreasePortions}
                className={`p-sm rounded-full ${colorScheme === 'dark' ? 'bg-neutral-700' : 'bg-gray-200'}`}
              >
                <MaterialCommunityIcons name="plus" size={24} color={colorScheme === 'dark' ? '#E5E7EB' : '#000000'} />
              </Pressable>
            </View>
            <Pressable
              onPress={handleAddWithPortions}
              className={`p-md rounded-lg ${colorScheme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'}`}
            >
              <Text className="text-white text-center text-base font-medium">Add to Shopping List</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

export const AddRecipeModal = ({ isVisible, onClose, onAdd }: { isVisible: boolean; onClose: () => void; onAdd: (name: string, portions: number) => void }) => {
  const currentTheme = useColorScheme();
  const colorScheme = currentTheme.colorScheme;
  const [recipeName, setRecipeName] = useState("");
  const [portions, setPortions] = useState("");

  const handleAdd = () => {
    if (recipeName && portions) {
      onAdd(recipeName, parseInt(portions) || 1);
      setRecipeName("");
      setPortions("");
      onClose();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
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
            <Text className={`text-xl font-medium ${colorScheme === 'dark' ? 'text-gray-200' : 'text-black'}`}>Add Recipe</Text>
            <Pressable onPress={onClose}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={colorScheme === 'dark' ? '#E5E7EB' : '#000000'}
              />
            </Pressable>
          </View>
          <TextInput
            className={`p-md rounded-lg mb-md ${colorScheme === 'dark' ? 'bg-neutral-700 text-white' : 'bg-gray-100 text-black'}`}
            value={recipeName}
            onChangeText={setRecipeName}
            placeholder="Recipe name"
            placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
          />
          <TextInput
            className={`p-md rounded-lg mb-lg ${colorScheme === 'dark' ? 'bg-neutral-700 text-white' : 'bg-gray-100 text-black'}`}
            value={portions}
            onChangeText={setPortions}
            keyboardType="numeric"
            placeholder="Number of portions"
            placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
          />
          <Pressable
            onPress={handleAdd}
            className={`p-md rounded-lg ${colorScheme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'}`}
          >
            <Text className="text-white text-center text-base font-medium">Create Recipe</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
