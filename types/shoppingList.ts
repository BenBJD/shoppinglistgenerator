export interface ShoppingListItem {
  name: string;
  amount: number;
  units?: string;
  unitGroups?: { amount: number; units: string }[];
  recipes: string[];
} 
