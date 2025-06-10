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
