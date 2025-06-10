import { FloatingActionButton } from "@/components/FloatingActionButton";
import { AddRecipeModal, RecipeListItem } from "@/components/Recipe";
import RecipesContext from "@/context/recipesContext";
import { Recipe } from "@/types/recipes";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useContext, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecipeListPage() {
  const currentTheme = useColorScheme();
  const colorScheme = currentTheme.colorScheme;
  const context = useContext(RecipesContext);
  const [isFabVisible, setIsFabVisible] = useState(true);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  if (!context) return <Text>No recipes found</Text>;
  const { recipes, addRecipe } = context;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsFabVisible(offsetY <= 0);
      },
    }
  );

  const handleAddRecipe = (name: string, portions: number) => {
    addRecipe({
      name,
      portions,
      ingredients: [],
    });
  };

  const renderItem = ({ item }: { item: Recipe }) => (
    <RecipeListItem recipe={item} />
  );

  return (
    <SafeAreaView className={`h-full ${colorScheme === 'dark' ? 'bg-neutral-900' : 'bg-white'}`}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <View className="flex-1">
        <Text className={`text-3xl mx-5 my-5 ${colorScheme === 'dark' ? 'text-gray-200' : 'text-black'}`}>Recipes</Text>
        {recipes.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className={`text-lg ${colorScheme === 'dark' ? 'text-gray-200' : 'text-black'}`}>No recipes yet</Text>
          </View>
        ) : (
          <Animated.FlatList
            data={recipes}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 20 }}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />
        )}
        <FloatingActionButton
          icon="plus"
          onPress={() => setIsAddModalVisible(true)}
          visible={isFabVisible}
        />
        <AddRecipeModal
          isVisible={isAddModalVisible}
          onClose={() => setIsAddModalVisible(false)}
          onAdd={handleAddRecipe}
        />
      </View>
    </SafeAreaView>
  );
}
