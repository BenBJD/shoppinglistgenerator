import { Ingredient, Recipe } from "@/types/recipes";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from "react";

const STORAGE_KEY = '@recipes';

const testingRecipes: Recipe[] = [
  {
    id: 1,
    name: "Spaghetti Bolognese",
    portions: 4,
    ingredients: [
      { name: "Spaghetti", amount: 500, units: "g" },
      { name: "Ground Beef", amount: 400, units: "g" },
      { name: "Onion", amount: 1, units: "medium" },
      { name: "Garlic", amount: 2, units: "cloves" },
      { name: "Tomato Sauce", amount: 400, units: "g" },
      { name: "Olive Oil", amount: 2, units: "tbsp" },
      { name: "Salt", amount: 1, units: "tsp" },
      { name: "Black Pepper", amount: 0.5, units: "tsp" },
    ],
  },
  {
    id: 2,
    name: "Chicken Stir Fry",
    portions: 4,
    ingredients: [
      { name: "Chicken Breast", amount: 300, units: "g" },
      { name: "Broccoli", amount: 200, units: "g" },
      { name: "Carrot", amount: 1, units: "medium" },
      { name: "Soy Sauce", amount: 3, units: "tbsp" },
      { name: "Ginger", amount: 1, units: "tsp" },
      { name: "Garlic", amount: 2, units: "cloves" },
      { name: "Vegetable Oil", amount: 2, units: "tbsp" },
    ],
  },
  {
    id: 3,
    name: "Vegetable Soup",
    portions: 6,
    ingredients: [
      { name: "Carrot", amount: 2, units: "medium" },
      { name: "Celery", amount: 2, units: "stalks" },
      { name: "Onion", amount: 1, units: "large" },
      { name: "Potato", amount: 2, units: "medium" },
      { name: "Vegetable Broth", amount: 1, units: "L" },
      { name: "Salt", amount: 1, units: "tsp" },
      { name: "Black Pepper", amount: 0.5, units: "tsp" },
    ],
  },
  {
    id: 4,
    name: "Chocolate Cake",
    portions: 8,
    ingredients: [
      { name: "Flour", amount: 200, units: "g" },
      { name: "Sugar", amount: 200, units: "g" },
      { name: "Cocoa Powder", amount: 50, units: "g" },
      { name: "Eggs", amount: 2, units: "" },
      { name: "Milk", amount: 200, units: "ml" },
      { name: "Vegetable Oil", amount: 100, units: "ml" },
      { name: "Baking Powder", amount: 2, units: "tsp" },
    ],
  },
  {
    id: 5,
    name: "Greek Salad",
    portions: 4,
    ingredients: [
      { name: "Cucumber", amount: 1, units: "large" },
      { name: "Tomato", amount: 2, units: "medium" },
      { name: "Red Onion", amount: 0.5, units: "" },
      { name: "Feta Cheese", amount: 100, units: "g" },
      { name: "Olives", amount: 50, units: "g" },
      { name: "Olive Oil", amount: 2, units: "tbsp" },
      { name: "Lemon Juice", amount: 1, units: "tbsp" },
      { name: "Oregano", amount: 1, units: "tsp" },
    ],
  },
  {
    id: 6,
    name: "Beef Tacos",
    portions: 4,
    ingredients: [
      { name: "Ground Beef", amount: 400, units: "g" },
      { name: "Taco Shells", amount: 8, units: "" },
      { name: "Lettuce", amount: 1, units: "head" },
      { name: "Tomato", amount: 2, units: "medium" },
      { name: "Cheese", amount: 100, units: "g" },
      { name: "Sour Cream", amount: 100, units: "g" },
      { name: "Taco Seasoning", amount: 1, units: "packet" },
    ],
  },
  {
    id: 7,
    name: "Pancakes",
    portions: 4,
    ingredients: [
      { name: "Flour", amount: 200, units: "g" },
      { name: "Sugar", amount: 2, units: "tbsp" },
      { name: "Baking Powder", amount: 2, units: "tsp" },
      { name: "Salt", amount: 0.5, units: "tsp" },
      { name: "Egg", amount: 1, units: "" },
      { name: "Milk", amount: 300, units: "ml" },
      { name: "Butter", amount: 2, units: "tbsp" },
    ],
  },
  {
    id: 8,
    name: "Pasta Primavera",
    portions: 4,
    ingredients: [
      { name: "Pasta", amount: 400, units: "g" },
      { name: "Broccoli", amount: 200, units: "g" },
      { name: "Carrot", amount: 1, units: "medium" },
      { name: "Zucchini", amount: 1, units: "medium" },
      { name: "Garlic", amount: 2, units: "cloves" },
      { name: "Olive Oil", amount: 3, units: "tbsp" },
      { name: "Parmesan", amount: 50, units: "g" },
      { name: "Salt", amount: 1, units: "tsp" },
      { name: "Black Pepper", amount: 0.5, units: "tsp" },
    ],
  },
  {
    id: 9,
    name: "Chicken Curry",
    portions: 4,
    ingredients: [
      { name: "Chicken Thighs", amount: 500, units: "g" },
      { name: "Onion", amount: 1, units: "large" },
      { name: "Garlic", amount: 3, units: "cloves" },
      { name: "Ginger", amount: 1, units: "tbsp" },
      { name: "Curry Powder", amount: 2, units: "tbsp" },
      { name: "Coconut Milk", amount: 400, units: "ml" },
      { name: "Tomato", amount: 2, units: "medium" },
      { name: "Salt", amount: 1, units: "tsp" },
    ],
  },
  {
    id: 10,
    name: "Apple Pie",
    portions: 8,
    ingredients: [
      { name: "Apples", amount: 6, units: "medium" },
      { name: "Sugar", amount: 100, units: "g" },
      { name: "Cinnamon", amount: 1, units: "tsp" },
      { name: "Flour", amount: 300, units: "g" },
      { name: "Butter", amount: 150, units: "g" },
      { name: "Egg", amount: 1, units: "" },
      { name: "Water", amount: 2, units: "tbsp" },
    ],
  },
];

interface RecipesContextType {
  recipes: Recipe[];
  addIngredient: (recipeId: number, ingredient: Ingredient) => void;
  removeIngredient: (recipeId: number, ingredient: Ingredient) => void;
  addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  removeRecipe: (recipeId: number) => void;
  updateRecipe: (recipeId: number, updates: Partial<Recipe>) => void;
  isLoading: boolean;
}

const RecipesContext = createContext<RecipesContextType | null>(null);

export const RecipesProvider = ({ children }: { children: React.ReactNode }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load recipes from storage on mount
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const storedRecipes = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedRecipes) {
          setRecipes(JSON.parse(storedRecipes));
        } else {
          // If no stored recipes, initialize with test data
          setRecipes(testingRecipes);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(testingRecipes));
        }
      } catch (error) {
        console.error('Error loading recipes:', error);
        // Fallback to test data if there's an error
        setRecipes(testingRecipes);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipes();
  }, []);

  // Save recipes to storage whenever they change
  useEffect(() => {
    const saveRecipes = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
      } catch (error) {
        console.error('Error saving recipes:', error);
      }
    };

    if (!isLoading) {
      saveRecipes();
    }
  }, [recipes, isLoading]);

  const addIngredient = (recipeId: number, ingredient: Ingredient) => {
    setRecipes(prevRecipes =>
      prevRecipes.map(recipe =>
        recipe.id === recipeId
          ? { ...recipe, ingredients: [...recipe.ingredients, ingredient] }
          : recipe
      )
    );
  };

  const removeIngredient = (recipeId: number, ingredient: Ingredient) => {
    setRecipes(prevRecipes =>
      prevRecipes.map(recipe =>
        recipe.id === recipeId
          ? { ...recipe, ingredients: recipe.ingredients.filter(i => i.name !== ingredient.name) }
          : recipe
      )
    );
  };

  const addRecipe = (recipe: Omit<Recipe, 'id'>) => {
    setRecipes(prevRecipes => {
      const newId = Math.max(0, ...prevRecipes.map(r => r.id)) + 1;
      return [...prevRecipes, { ...recipe, id: newId }];
    });
  };

  const removeRecipe = (recipeId: number) => {
    setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== recipeId));
  };

  const updateRecipe = (recipeId: number, updates: Partial<Recipe>) => {
    setRecipes(prevRecipes =>
      prevRecipes.map(recipe =>
        recipe.id === recipeId
          ? { ...recipe, ...updates }
          : recipe
      )
    );
  };

  return (
    <RecipesContext.Provider
      value={{
        recipes,
        addIngredient,
        removeIngredient,
        addRecipe,
        removeRecipe,
        updateRecipe,
        isLoading
      }}
    >
      {children}
    </RecipesContext.Provider>
  );
};

export default RecipesContext;
