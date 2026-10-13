import { gql } from "@/lib/api";
import type { Category, Food } from "@/types";

export type FoodForm = {
  id?: number;
  name: string;
  price: number;
  categoryId: number;
  description: string;
  image: File | null;
  existingImage: string | null;
  available: boolean;
};

const FOOD_FIELDS = `
  id name description price available image
  category { id name }
`;

const toDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

export const categoryService = {
  getAll: async () =>
    (await gql<{ categories: Category[] }>(`{ categories { id name } }`))
      .categories,

  save: (name: string) =>
    gql(`mutation ($name: String!) { saveCategory(name: $name) { id } }`, {
      name,
    }),

  delete: (id: number) =>
    gql(`mutation ($id: Int!) { deleteCategory(id: $id) }`, { id }),
};

export const foodService = {
  getAll: async () =>
    (await gql<{ foods: Food[] }>(`{ foods { ${FOOD_FIELDS} } }`)).foods,

  getAvailable: async () =>
    (
      await gql<{ availableFoods: Food[] }>(
        `{ availableFoods { ${FOOD_FIELDS} } }`,
      )
    ).availableFoods,

  save: async (food: FoodForm) =>
    gql(`mutation ($input: FoodInput!) { saveFood(input: $input) { id } }`, {
      input: {
        id: food.id,
        name: food.name,
        price: food.price,
        categoryId: food.categoryId,
        description: food.description,
        image: food.image ? await toDataUrl(food.image) : null,
        available: food.available,
      },
    }),

  delete: (id: number) =>
    gql(`mutation ($id: Int!) { deleteFood(id: $id) }`, { id }),

  toggleAvailable: (food: Food) =>
    gql(
      `mutation ($id: Int!, $available: Boolean!) {
        setFoodAvailable(id: $id, available: $available)
      }`,
      { id: food.id, available: !food.available },
    ),
};
