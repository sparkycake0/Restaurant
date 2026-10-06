import { FoodForm } from "@/app/admin/(panel)/menu/page";
import { Food } from "@/data/types";
import { api } from "@/lib/api";
import { Category } from "@/types/menu";

export const categoryService = {
  save: (name: string) => {
    return api<Category>("category", {
      method: "POST",
      body: { name },
    });
  },
  getAll: () => {
    return api<Category[]>("category");
  },
  delete: (id: number) => {
    return api("category", {
      body: { id },
      method: "DELETE",
    });
  },
};
// api/menu.ts

export const foodService = {
  getAll: () => {
    return api<Food[]>("food");
  },

  save: (food: FoodForm) => {
    const form = new FormData();

    if (food.id) {
      form.append("id", String(food.id));
    }

    form.append("name", food.name);
    form.append("price", String(food.price));
    form.append("categoryId", String(food.categoryId));
    form.append("description", food.description);
    form.append("available", String(food.available));

    if (food.image) {
      form.append("image", food.image);
    }

    return api<Food>("food", {
      method: "POST",
      body: form,
    });
  },
  delete: (id: number) => {
    return api<Food>("food", {
      method: "DELETE",
      body: { id },
    });
  },
  changeAvailable: (id: number, available: boolean) => {
    return api("food", {
      method: "PATCH",
      body: { id, available },
    });
  },
};
