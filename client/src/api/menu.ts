import { api } from "@/lib/api";
import type { Category, Food } from "@/types";

export type FoodForm = {
  id?: number; // missing = new dish
  name: string;
  price: number;
  categoryId: number;
  description: string;
  image: File | null; // new image to upload
  existingImage: string | null; // image the dish already has
  available: boolean;
};

export const categoryService = {
  getAll: () => api<Category[]>("category"),
  save: (name: string) => api("category", { method: "POST", body: { name } }),
  delete: (id: number) => api("category", { method: "DELETE", body: { id } }),
};

export const foodService = {
  getAll: () => api<Food[]>("food"),

  // multipart/form-data, because of the image upload
  save: (food: FoodForm) => {
    const form = new FormData();
    if (food.id) form.append("id", String(food.id));
    form.append("name", food.name);
    form.append("price", String(food.price));
    form.append("categoryId", String(food.categoryId));
    form.append("description", food.description);
    form.append("available", String(food.available));
    if (food.image) form.append("image", food.image);
    return api<Food>("food", { method: "POST", body: form });
  },

  delete: (id: number) => api("food", { method: "DELETE", body: { id } }),

  // The server flips the value it receives, so send the CURRENT value of `available`.
  toggleAvailable: (food: Food) =>
    api("food", {
      method: "PATCH",
      body: { id: food.id, available: food.available },
    }),
  getAvailable: () => api<Food[]>("food/available"),
};
