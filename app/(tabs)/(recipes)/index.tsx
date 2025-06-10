import { FloatingActionButton } from "@/components/FloatingActionButton";
import { RecipeListItem } from "@/components/recipe";
import RecipesContext from "@/context/recipesContext";
import { Recipe } from "@/types/recipes";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useContext, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecipeListPage() {
  const currentTheme = useColorScheme();
  const colorScheme = currentTheme.colorScheme;
  const textColor = colorScheme == "dark" ? "text-gray-200" : "text-black"
  const context = useContext(RecipesContext);
  const [isFabVisible, setIsFabVisible] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;

  if (!context) return <Text>No recipes found</Text>;
  const { recipes } = context;

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

  const renderItem = ({ item }: { item: Recipe }) => (
    <RecipeListItem recipe={item} />
  );

  return (
    <SafeAreaView className={`h-full ${colorScheme === 'dark' ? 'bg-neutral-900' : 'bg-white'}`}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <View className="flex-1">
        <Text className={`text-4xl mx-5 my-5 ${textColor}`}>Recipes</Text>
        {recipes.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text className={`text-lg ${textColor}`}>No recipes yet</Text>
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
          onPress={() => router.push("/(tabs)/(recipes)/create")}
          visible={isFabVisible}
        />
      </View>
    </SafeAreaView>
  );
}
