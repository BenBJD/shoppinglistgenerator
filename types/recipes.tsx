export interface Ingredient {
    name: string;
    amount: number;
    units?: string;
}

export interface Recipe {
    id: number;
    name: string;
    ingredients: Ingredient[];
    portions: number;
}

export const DEFAULT_PORTIONS = 4;
