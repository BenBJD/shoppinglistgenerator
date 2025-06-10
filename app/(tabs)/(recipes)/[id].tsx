import { FloatingActionButton } from "@/components/FloatingActionButton";
import { IngredientListItem } from "@/components/ingredients";
import RecipesContext from "@/context/recipesContext";
import ShoppingListContext from "@/context/shoppingListContext";
import { Ingredient } from "@/types/recipes";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useContext, useState } from "react";
import { FlatList, Modal, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecipePage() {
  const currentTheme = useColorScheme();
  const colorScheme = currentTheme.colorScheme;
  const textColor = colorScheme == "dark" ? "text-gray-200" : "text-black"
  const { id } = useLocalSearchParams();
  const recipesContext = useContext(RecipesContext);
  const shoppingList = useContext(ShoppingListContext);
  const recipe = recipesContext?.recipes.find(
    (recipe) => recipe.id.toString() === id,
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newIngredient, setNewIngredient] = useState<Ingredient>({
    name: "",
    amount: 0,
    units: "",
  });

  if (!recipesContext || !recipe || !shoppingList) return <Text>No recipe found</Text>;

  const handleAddIngredient = () => {
    if (newIngredient.name && newIngredient.amount > 0) {
      recipesContext.addIngredient(recipe.id, newIngredient);

      // Update shopping list if the recipe is in it
      const isRecipeInShoppingList = shoppingList.items.some(item =>
        item.recipes.includes(recipe.name)
      );

      if (isRecipeInShoppingList) {
        // First remove the recipe's ingredients
        shoppingList.removeRecipeIngredients(recipe.name);
        // Then add all ingredients including the new one
        shoppingList.addRecipeIngredients(recipe.name, [...recipe.ingredients, newIngredient]);
      }

      setNewIngredient({ name: "", amount: 0, units: "" });
      setIsModalVisible(false);
    }
  };

  const handleRemoveIngredient = (ingredient: Ingredient) => {
    recipesContext.removeIngredient(recipe.id, ingredient);

    // Update shopping list if the recipe is in it
    const isRecipeInShoppingList = shoppingList.items.some(item =>
      item.recipes.includes(recipe.name)
    );

    if (isRecipeInShoppingList) {
      // First remove the recipe's ingredients
      shoppingList.removeRecipeIngredients(recipe.name);
      // Then add all remaining ingredients
      const remainingIngredients = recipe.ingredients.filter(ing => ing.name !== ingredient.name);
      shoppingList.addRecipeIngredients(recipe.name, remainingIngredients);
    }
  };

  const handleUpdateIngredient = (updatedIngredient: Ingredient) => {
    recipesContext.updateRecipe(recipe.id, {
      ingredients: recipe.ingredients.map(ing =>
        ing.name === updatedIngredient.name ? updatedIngredient : ing
      )
    });
  };

  const renderItem = ({ item }: { item: Ingredient }) => (
    <IngredientListItem
      ingredient={item}
      onRemove={() => handleRemoveIngredient(item)}
      onUpdate={handleUpdateIngredient}
      recipeName={recipe.name}
    />
  );

  return (
    <SafeAreaView className={`h-full ${colorScheme === 'dark' ? 'bg-neutral-900' : 'bg-white'}`}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <View className="flex-row items-center mx-5 my-5">
        <Pressable
          onPress={() => router.back()}
          className="mr-4"
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={colorScheme === 'dark' ? '#E5E7EB' : '#000000'}
          />
        </Pressable>
        <Text className={`text-4xl flex-1 ${textColor}`}>
          {recipe.name}
        </Text>
      </View>
      <Text className={`text-xl mx-5 mb-2 ${textColor}`}>Ingredients</Text>
      {recipe.ingredients.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className={`text-lg ${textColor}`}>No ingredients yet</Text>
        </View>
      ) : (
        <FlatList
          data={recipe.ingredients}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.name}-${item.amount}-${item.units}`}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      <FloatingActionButton
        icon="plus"
        onPress={() => setIsModalVisible(true)}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
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
              <Text className={`text-2xl ${textColor}`}>Add Ingredient</Text>
              <Pressable onPress={() => setIsModalVisible(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={colorScheme === 'dark' ? '#E5E7EB' : '#000000'}
                />
              </Pressable>
            </View>
            <TextInput
              className={`p-4 rounded-xl mb-4 ${colorScheme === 'dark' ? 'bg-neutral-700 text-white' : 'bg-gray-100 text-black'}`}
              value={newIngredient.name}
              onChangeText={(text) => setNewIngredient({ ...newIngredient, name: text })}
              placeholder="Ingredient name"
              placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
            />
            <View className="flex-row gap-4 mb-4">
              <TextInput
                className={`flex-1 p-4 rounded-xl ${colorScheme === 'dark' ? 'bg-neutral-700 text-white' : 'bg-gray-100 text-black'}`}
                value={newIngredient.amount.toString()}
                onChangeText={(text) => setNewIngredient({ ...newIngredient, amount: parseFloat(text) || 0 })}
                keyboardType="numeric"
                placeholder="Amount"
                placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
              />
              <TextInput
                className={`flex-1 p-4 rounded-xl ${colorScheme === 'dark' ? 'bg-neutral-700 text-white' : 'bg-gray-100 text-black'}`}
                value={newIngredient.units}
                onChangeText={(text) => setNewIngredient({ ...newIngredient, units: text })}
                placeholder="Units (optional)"
                placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
              />
            </View>
            <Pressable
              onPress={handleAddIngredient}
              className={`p-4 rounded-xl ${colorScheme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'}`}
            >
              <Text className="text-white text-center text-lg font-medium">Add Ingredient</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
