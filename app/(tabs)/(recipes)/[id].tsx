import { FloatingActionButton } from "@/components/FloatingActionButton";
import { IngredientListItem } from "@/components/Ingredients";
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
  const [amountInput, setAmountInput] = useState("");

  if (!recipesContext || !recipe || !shoppingList) return <Text>No recipe found</Text>;

  const handleAddIngredient = () => {
    if (newIngredient.name && amountInput) {
      const amount = parseFloat(amountInput);
      if (!isNaN(amount) && amount > 0) {
        recipesContext.addIngredient(recipe.id, { ...newIngredient, amount });
        setNewIngredient({ name: "", amount: 0, units: "" });
        setAmountInput("");
        setIsModalVisible(false);
      }
    }
  };

  const renderItem = ({ item }: { item: Ingredient }) => (
    <IngredientListItem
      ingredient={item}
      recipeName={recipe.name}
      onRemove={() => recipesContext.removeIngredient(recipe.id, item)}
      onUpdate={(updatedIngredient) =>
        recipesContext.updateRecipe(recipe.id, {
          ...recipe,
          ingredients: recipe.ingredients.map(ing =>
            ing.name === updatedIngredient.name ? updatedIngredient : ing
          )
        })
      }
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
        <Text className={`text-3xl flex-1 ${colorScheme === 'dark' ? 'text-gray-200' : 'text-black'}`}>
          {recipe.name}
        </Text>
      </View>
      <View className="flex-row items-center mx-5 mb-4">
        <Text className={`text-lg ${colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {recipe.portions} portions
        </Text>
      </View>
      <Text className={`text-xl mx-5 mb-2 ${colorScheme === 'dark' ? 'text-gray-200' : 'text-black'}`}>Ingredients</Text>
      {recipe.ingredients.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className={`text-lg ${colorScheme === 'dark' ? 'text-gray-200' : 'text-black'}`}>No ingredients yet</Text>
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
              <Text className={`text-xl ${colorScheme === 'dark' ? 'text-gray-200' : 'text-black'}`}>Add Ingredient</Text>
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
                value={amountInput}
                onChangeText={(text) => {
                  if (text === '' || /^\d*\.?\d*$/.test(text)) {
                    setAmountInput(text);
                    setNewIngredient({ ...newIngredient, amount: text === '' ? 0 : parseFloat(text) || 0 });
                  }
                }}
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
