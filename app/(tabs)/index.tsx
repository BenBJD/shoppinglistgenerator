import { ShoppingListItem } from "@/components/shoppingList";
import ShoppingListContext from "@/context/shoppingListContext";
import { Ingredient } from "@/types/recipes";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useContext } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ShoppingListPage() {
  const currentTheme = useColorScheme();
  const colorScheme = currentTheme.colorScheme;
  const textColor = colorScheme == "dark" ? "text-gray-200" : "text-black"
  const context = useContext(ShoppingListContext);
  if (!context) return <Text>Error loading shopping list</Text>;
  const { items, removeIngredient, clearList, updateIngredientAmount } = context;

  const handleUpdateAmount = (item: Ingredient & { recipes: string[] }, newAmount: number) => {
    updateIngredientAmount(item.name, newAmount);
  };

  const renderItem = ({ item }: { item: Ingredient & { recipes: string[] } }) => (
    <ShoppingListItem
      item={item}
      onRemove={() => removeIngredient(item.name)}
      onUpdate={(newAmount) => handleUpdateAmount(item, newAmount)}
    />
  );

  return (
    <SafeAreaView className={`h-full ${colorScheme === 'dark' ? 'bg-neutral-900' : 'bg-white'}`}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <View className="flex-row justify-between items-center mx-5 my-5">
        <Text className={`text-4xl ${textColor}`}>
          Shopping List
        </Text>
        {items.length > 0 && (
          <Pressable
            onPress={clearList}
            className={`px-4 py-2 rounded-lg ${colorScheme === 'dark' ? 'bg-red-600' : 'bg-red-500'}`}
          >
            <Text className="text-white">Clear List</Text>
          </Pressable>
        )}
      </View>
      {items.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className={`text-lg ${textColor}`}>Shopping list is empty.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.name}-${item.amount}-${item.units}`}
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
}
