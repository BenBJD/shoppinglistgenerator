import RecipesContext from "@/context/recipesContext";
import { DEFAULT_PORTIONS, Ingredient } from "@/types/recipes";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useContext, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateRecipePage() {
  const currentTheme = useColorScheme();
  const colorScheme = currentTheme.colorScheme;
  const textColor = colorScheme == "dark" ? "text-gray-200" : "text-black";
  const recipesContext = useContext(RecipesContext);

  const [recipeName, setRecipeName] = useState("");
  const [portions, setPortions] = useState(DEFAULT_PORTIONS.toString());
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newIngredient, setNewIngredient] = useState<Ingredient>({
    name: "",
    amount: 0,
  });

  if (!recipesContext) return <Text>Error loading recipes</Text>;

  const handleAddIngredient = () => {
    if (newIngredient.name && newIngredient.amount) {
      setIngredients([...ingredients, newIngredient]);
      setNewIngredient({ name: "", amount: 0 });
    }
  };

  const handleRemoveIngredient = (ingredientName: string) => {
    setIngredients(ingredients.filter(ing => ing.name !== ingredientName));
  };

  const handleCreateRecipe = () => {
    if (recipeName && ingredients.length > 0) {
      recipesContext.addRecipe({
        name: recipeName,
        ingredients: ingredients,
        portions: parseInt(portions) || DEFAULT_PORTIONS,
      });
      router.back();
    }
  };

  return (
    <SafeAreaView className={`h-full ${colorScheme === 'dark' ? 'bg-neutral-900' : 'bg-white'}`}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <View className="flex-1">
        <View className="flex-row justify-between items-center mx-5 my-5">
          <Text className={`text-2xl ${textColor}`}>Create New Recipe</Text>
          <Pressable
            onPress={handleCreateRecipe}
            className={`px-4 py-2 rounded-lg ${colorScheme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'}`}
          >
            <Text className="text-white">Save Recipe</Text>
          </Pressable>
        </View>

        <View className="mx-5">
          <Text className={`text-xl mb-2 ${textColor}`}>Recipe Name</Text>
          <TextInput
            className={`p-2 rounded-lg mb-5 ${colorScheme === 'dark' ? 'bg-neutral-800 text-white' : 'bg-gray-100 text-black'}`}
            placeholder="Enter recipe name"
            placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
            value={recipeName}
            onChangeText={setRecipeName}
          />

          <Text className={`text-xl mb-2 ${textColor}`}>Portions</Text>
          <TextInput
            className={`p-2 rounded-lg mb-5 ${colorScheme === 'dark' ? 'bg-neutral-800 text-white' : 'bg-gray-100 text-black'}`}
            placeholder="Number of portions"
            placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
            value={portions}
            onChangeText={setPortions}
            keyboardType="numeric"
          />

          <Text className={`text-xl mb-2 ${textColor}`}>Ingredients</Text>
          {ingredients.map((ingredient) => (
            <View
              key={ingredient.name}
              className={`flex-row justify-between items-center p-5 mb-5 rounded-xl ${colorScheme === 'dark' ? 'bg-neutral-800' : 'bg-gray-100'}`}
            >
              <View>
                <Text className={`text-xl ${textColor}`}>{ingredient.name}</Text>
                <Text className={`text-lg ${textColor}`}>
                  {ingredient.amount}{ingredient.units ? ingredient.units : ''}
                </Text>
              </View>
              <Pressable onPress={() => handleRemoveIngredient(ingredient.name)}>
                <Text className={`text-lg ${textColor}`}>Remove</Text>
              </Pressable>
            </View>
          ))}

          <View className="flex-row items-center mb-5">
            <TextInput
              className={`flex-1 p-2 rounded-lg mr-2 ${colorScheme === 'dark' ? 'bg-neutral-800 text-white' : 'bg-gray-100 text-black'}`}
              placeholder="Ingredient name"
              placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
              value={newIngredient.name}
              onChangeText={(text) => setNewIngredient({ ...newIngredient, name: text })}
            />
            <TextInput
              className={`w-20 p-2 rounded-lg mr-2 ${colorScheme === 'dark' ? 'bg-neutral-800 text-white' : 'bg-gray-100 text-black'}`}
              placeholder="Amount"
              placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
              value={newIngredient.amount ? newIngredient.amount.toString() : ''}
              onChangeText={(text) => setNewIngredient({ ...newIngredient, amount: parseFloat(text) || 0 })}
              keyboardType="numeric"
            />
            <TextInput
              className={`w-20 p-2 rounded-lg mr-2 ${colorScheme === 'dark' ? 'bg-neutral-800 text-white' : 'bg-gray-100 text-black'}`}
              placeholder="Units"
              placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
              value={newIngredient.units}
              onChangeText={(text) => setNewIngredient({ ...newIngredient, units: text })}
            />
            <Pressable
              onPress={handleAddIngredient}
              className={`px-4 py-2 rounded-lg ${colorScheme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'}`}
            >
              <Text className="text-white">Add</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
} 
