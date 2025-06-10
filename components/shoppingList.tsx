import { Ingredient } from "@/types/recipes";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

interface ShoppingListItemProps {
  item: Ingredient & { recipes: string[] };
  onRemove: () => void;
  onUpdate: (newAmount: number) => void;
}

export const ShoppingListItem = ({ item, onRemove, onUpdate }: ShoppingListItemProps) => {
  const currentTheme = useColorScheme();
  const colorScheme = currentTheme.colorScheme;
  const textColor = colorScheme == "dark" ? "text-gray-200" : "text-black";
  const [isExpanded, setIsExpanded] = useState(false);
  const [amountBought, setAmountBought] = useState("");

  const handleUpdate = () => {
    const amount = parseFloat(amountBought);
    if (!isNaN(amount) && amount >= 0) {
      const remainingAmount = item.amount - amount;
      if (remainingAmount <= 0) {
        onRemove();
      } else {
        onUpdate(remainingAmount);
      }
      setIsExpanded(false);
      setAmountBought("");
    }
  };

  return (
    <View>
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
          <Text className={`text-xl ${textColor}`}>{item.name}</Text>
          <Text className={`text-sm ${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {item.amount} {item.units}
          </Text>
          <Text className={`text-xs ${colorScheme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
            From: {item.recipes.join(', ')}
          </Text>
        </View>
        <Pressable
          onPress={() => setIsExpanded(!isExpanded)}
          className={`px-4 py-2 rounded-lg ${colorScheme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'}`}
        >
          <Text className="text-white">{isExpanded ? 'Cancel' : 'Update'}</Text>
        </Pressable>
      </View>
      {isExpanded && (
        <View className={`mx-5 mb-4 p-4 rounded-2xl ${colorScheme === 'dark' ? 'bg-neutral-800' : 'bg-gray-100'}`}
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.10,
            shadowRadius: 2,
            elevation: 1,
          }}
        >
          <Text className={`text-lg mb-2 ${textColor}`}>How much do you have?</Text>
          <View className="flex-row gap-2 mb-2">
            <TextInput
              className={`flex-1 p-2 rounded-lg ${colorScheme === 'dark' ? 'bg-neutral-700 text-white' : 'bg-white text-black'}`}
              value={amountBought}
              onChangeText={setAmountBought}
              keyboardType="numeric"
              placeholder="Amount"
              placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
            />
            <Text className={`self-center ${textColor}`}>{item.units}</Text>
          </View>
          <View className="flex-row gap-2">
            <Pressable
              onPress={handleUpdate}
              className={`flex-1 p-2 rounded-lg ${colorScheme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'}`}
            >
              <Text className="text-white text-center">Update Amount</Text>
            </Pressable>
            <Pressable
              onPress={onRemove}
              className={`flex-1 p-2 rounded-lg ${colorScheme === 'dark' ? 'bg-green-600' : 'bg-green-500'}`}
            >
              <Text className="text-white text-center">Have Enough</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}; 
