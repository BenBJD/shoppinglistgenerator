import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { ShoppingListItem as ShoppingListItemType } from "../types/shoppingList";

interface ShoppingListItemProps {
  item: ShoppingListItemType;
  onRemove: () => void;
  onUpdate: (amount: number) => void;
}

export const ShoppingListItem = ({ item, onRemove, onUpdate }: ShoppingListItemProps) => {
  const currentTheme = useColorScheme();
  const colorScheme = currentTheme.colorScheme;
  const [isEditing, setIsEditing] = useState(false);
  const [editedAmount, setEditedAmount] = useState(item.amount.toString());

  const handleSave = () => {
    const amountToRemove = parseFloat(editedAmount);
    if (!isNaN(amountToRemove) && amountToRemove > 0) {
      const remainingAmount = item.amount - amountToRemove;
      if (remainingAmount <= 0) {
        onRemove();
      } else {
        onUpdate(remainingAmount);
      }
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedAmount(item.amount.toString());
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
          <Text className={`text-xl ${colorScheme === 'dark' ? 'text-gray-200' : 'text-black'}`}>{item.name}</Text>
          <Text className={`text-sm ${colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {item.unitGroups ? (
              item.unitGroups.map((group, index) => (
                <Text key={index}>
                  {group.amount} {group.units}
                  {index < item.unitGroups!.length - 1 ? ' + ' : ''}
                </Text>
              ))
            ) : (
              `${item.amount} ${item.units}`
            )}
          </Text>
          {item.recipes.length > 0 && (
            <Text className={`text-xs ${colorScheme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              From: {item.recipes.join(', ')}
            </Text>
          )}
        </View>
        <View className="flex-row gap-2">
          <Pressable
            onPress={() => setIsEditing(true)}
            className={`p-sm rounded-full ${colorScheme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'}`}
            android_ripple={{ color: '#90caf9' }}
          >
            <MaterialCommunityIcons name="check-circle-outline" size={22} color="white" />
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
              <Text className={`text-xl font-medium ${colorScheme === 'dark' ? 'text-gray-200' : 'text-black'}`}>Update Amount</Text>
              <Pressable onPress={handleCancel}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={colorScheme === 'dark' ? '#E5E7EB' : '#000000'}
                />
              </Pressable>
            </View>
            <Text className={`text-base mb-md ${colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              How many {item.units} of {item.name} do you already have?
            </Text>
            <TextInput
              className={`p-md rounded-lg mb-lg ${colorScheme === 'dark' ? 'bg-neutral-700 text-white' : 'bg-gray-100 text-black'}`}
              value={editedAmount}
              onChangeText={(text) => {
                // Allow empty string, numbers, and one decimal point
                if (text === '' || /^\d*\.?\d*$/.test(text)) {
                  setEditedAmount(text);
                }
              }}
              keyboardType="numeric"
              placeholder="Amount"
              placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'}
            />
            <View className="flex-row gap-4">
              <Pressable
                onPress={handleSave}
                className={`flex-1 p-md rounded-lg ${colorScheme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'}`}
              >
                <Text className="text-white text-center text-base font-medium">Update</Text>
              </Pressable>
              <Pressable
                onPress={onRemove}
                className={`flex-1 p-md rounded-lg ${colorScheme === 'dark' ? 'bg-red-600' : 'bg-red-500'}`}
              >
                <Text className="text-white text-center text-base font-medium">Have Enough</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}; 
