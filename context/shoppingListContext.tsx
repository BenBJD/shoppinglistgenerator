import { Ingredient } from "@/types/recipes";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from "react";

const STORAGE_KEY = '@shoppingList';

interface ShoppingListItem extends Ingredient {
  recipes: string[]; // Names of recipes this ingredient comes from
  unitGroups?: { amount: number; units: string }[]; // Store different unit groups separately
}

interface ShoppingListContextType {
  items: ShoppingListItem[];
  addRecipeIngredients: (recipeName: string, ingredients: Ingredient[]) => void;
  removeRecipeIngredients: (recipeName: string) => void;
  removeIngredient: (ingredientName: string) => void;
  updateIngredientAmount: (ingredientName: string, newAmount: number) => void;
  clearList: () => void;
  isLoading: boolean;
}

const ShoppingListContext = createContext<ShoppingListContextType | null>(null);

export const ShoppingListProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load shopping list from storage on mount
  useEffect(() => {
    const loadShoppingList = async () => {
      try {
        const storedList = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedList) {
          setItems(JSON.parse(storedList));
        }
      } catch (error) {
        console.error('Error loading shopping list:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadShoppingList();
  }, []);

  // Save shopping list to storage whenever it changes
  useEffect(() => {
    const saveShoppingList = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error('Error saving shopping list:', error);
      }
    };

    if (!isLoading) {
      saveShoppingList();
    }
  }, [items, isLoading]);

  const addRecipeIngredients = (recipeName: string, ingredients: Ingredient[]) => {
    setItems(prevItems => {
      const newItems = [...prevItems];

      ingredients.forEach(ingredient => {
        // Normalize ingredient name and units
        const normalizedIngredient = {
          ...ingredient,
          name: ingredient.name.toLowerCase(),
          units: ingredient.units?.toLowerCase() || ''
        };

        // Find if we already have this ingredient (case insensitive)
        const existingItemIndex = newItems.findIndex(
          item => item.name.toLowerCase() === normalizedIngredient.name
        );

        if (existingItemIndex >= 0) {
          // Update existing item
          const existingItem = newItems[existingItemIndex];

          // If the units are different, combine them
          if (existingItem.units !== normalizedIngredient.units) {
            // Create or update unit groups
            const unitGroups = existingItem.unitGroups || [{ amount: existingItem.amount, units: existingItem.units || '' }];
            const existingGroupIndex = unitGroups.findIndex(group => group.units === normalizedIngredient.units);

            if (existingGroupIndex >= 0) {
              // Add to existing group
              unitGroups[existingGroupIndex].amount += normalizedIngredient.amount;
            } else {
              // Add new group
              unitGroups.push({ amount: normalizedIngredient.amount, units: normalizedIngredient.units || '' });
            }

            newItems[existingItemIndex] = {
              ...existingItem,
              unitGroups,
              amount: unitGroups.reduce((sum, group) => sum + group.amount, 0),
              recipes: [...existingItem.recipes, recipeName.toLowerCase()]
            };
          } else {
            // Same units, just add the amounts
            newItems[existingItemIndex] = {
              ...existingItem,
              amount: existingItem.amount + normalizedIngredient.amount,
              recipes: [...existingItem.recipes, recipeName.toLowerCase()]
            };
          }
        } else {
          // Add new item
          newItems.push({
            ...normalizedIngredient,
            recipes: [recipeName.toLowerCase()]
          });
        }
      });

      // Sort items alphabetically by name
      return newItems.sort((a, b) => a.name.localeCompare(b.name));
    });
  };

  const removeRecipeIngredients = (recipeName: string) => {
    setItems(prevItems => {
      const normalizedRecipeName = recipeName.toLowerCase();
      const newItems = prevItems
        .map(item => {
          // Remove the recipe from the recipes list (case insensitive)
          const updatedRecipes = item.recipes.filter(name => name.toLowerCase() !== normalizedRecipeName);

          // If this was the only recipe for this ingredient, remove the ingredient
          if (updatedRecipes.length === 0) {
            return null;
          }

          // Calculate the new amount based on remaining recipes
          const newAmount = item.amount * (updatedRecipes.length / item.recipes.length);

          return {
            ...item,
            amount: newAmount,
            recipes: updatedRecipes
          };
        })
        .filter((item): item is ShoppingListItem => item !== null);

      // Sort items alphabetically by name
      return newItems.sort((a, b) => a.name.localeCompare(b.name));
    });
  };

  const removeIngredient = (ingredientName: string) => {
    setItems(prevItems => {
      const normalizedName = ingredientName.toLowerCase();
      const newItems = prevItems.filter(item => item.name.toLowerCase() !== normalizedName);
      // Sort items alphabetically by name
      return newItems.sort((a, b) => a.name.localeCompare(b.name));
    });
  };

  const updateIngredientAmount = (ingredientName: string, newAmount: number) => {
    setItems(prevItems => {
      const normalizedName = ingredientName.toLowerCase();
      const newItems = prevItems.map(item => {
        if (item.name.toLowerCase() === normalizedName) {
          return {
            ...item,
            amount: newAmount
          };
        }
        return item;
      });
      // Sort items alphabetically by name
      return newItems.sort((a, b) => a.name.localeCompare(b.name));
    });
  };

  const clearList = () => {
    setItems([]);
  };

  return (
    <ShoppingListContext.Provider
      value={{
        items,
        addRecipeIngredients,
        removeRecipeIngredients,
        removeIngredient,
        updateIngredientAmount,
        clearList,
        isLoading
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
};

export default ShoppingListContext; 
