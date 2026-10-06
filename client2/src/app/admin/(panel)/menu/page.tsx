"use client";

import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { PageBar, TableWrap, Td, Th } from "@/components/admin-shared";
import { Modal } from "@/components/modal";
import {
  Button,
  Chip,
  Field,
  Input,
  Photo,
  Pill,
  Select,
  Textarea,
  Toggle,
} from "@/components/ui";
import type { Food } from "@/data/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryService, foodService } from "@/api/menu";
import { queryKeys } from "@/lib/queryKeys";
import { Category } from "@/types/menu";

export type FoodForm = {
  id?: number;
  name: string;
  price: number;
  categoryId: number;
  description: string;
  image: File | null;
  existingImage: string;
  available: boolean;
};

const emptyFood: FoodForm = {
  name: "",
  price: 0,
  categoryId: 0,
  description: "",
  image: null,
  existingImage: "",
  available: true,
};

export default function MenuAdminPage() {
  const queryClient = useQueryClient();

  const [newFood, setNewFood] = useState<FoodForm>(emptyFood);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [edit, setEdit] = useState<Food | null>(null);

  const [catModal, setCatModal] = useState(false);
  const [newCat, setNewCat] = useState("");

  const {
    data: foods,
    error: foodError,
    isLoading: foodLoading,
  } = useQuery<Food[]>({
    queryFn: () => foodService.getAll(),
    queryKey: queryKeys.foods,
  });

  const {
    data: categories,
    error: catError,
    isLoading: catLoading,
  } = useQuery({
    queryFn: () => categoryService.getAll(),
    queryKey: queryKeys.categories,
  });

  const list = foods?.filter(
    (f) =>
      (cat === "all" || (f.category as Category).name === cat) &&
      (!q || f.name.toLowerCase().includes(q.toLowerCase())),
  );

  const openEdit = (food: Food) => {
    const category = food.category as Category;

    setEdit(food);

    setNewFood({
      id: food.id,
      name: food.name,
      price: food.price,
      categoryId: category.id,
      description: food.description,
      image: null,
      existingImage: food.image,
      available: food.available,
    });
  };

  const openNew = () => {
    if (!categories?.length) return;

    setEdit({
      id: 0,
      name: "",
      description: "",
      price: 0,
      category: categories[0],
      image: "",
      available: true,
      prepTime: "15 minutes",
      serves: "1 person",
      allergens: "-",
      tags: [],
    });

    setNewFood({
      ...emptyFood,
      categoryId: categories[0].id,
    });
  };

  const closeFoodModal = () => {
    setEdit(null);
    setNewFood(emptyFood);
  };

  const categorySave = useMutation({
    mutationFn: (name: string) => categoryService.save(name),
    mutationKey: queryKeys.categories,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories,
      });
      setNewCat("");
    },
  });

  const categoryDelete = useMutation({
    mutationFn: (id: number) => categoryService.delete(id),
    mutationKey: queryKeys.categories,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories,
      });
    },
  });

  const foodSave = useMutation({
    mutationFn: (food: FoodForm) => foodService.save(food),
    mutationKey: queryKeys.foods,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.foods,
      });
      closeFoodModal();
    },
  });

  const foodDelete = useMutation({
    mutationFn: (id: number) => foodService.delete(id),
    mutationKey: queryKeys.foods,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.foods,
      });
    },
  });

  const foodChangeAvailable = useMutation({
    mutationFn: ({ id, available }: { id: number; available: boolean }) =>
      foodService.changeAvailable(id, available),

    mutationKey: queryKeys.foods,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.foods,
      });
    },
  });

  if (catError) console.error(catError);
  if (foodError) console.error(foodError);

  return (
    <div>
      <PageBar>
        <div className="relative w-full sm:w-72">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />

          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search dishes..."
            className="pl-11"
            aria-label="Search dishes"
          />
        </div>

        <div className="no-scrollbar flex flex-1 gap-2 overflow-x-auto">
          <Chip active={cat === "all"} onClick={() => setCat("all")}>
            All
          </Chip>

          {categories?.map((c) => (
            <Chip
              key={c.id}
              active={cat === c.name}
              onClick={() => setCat(c.name)}
            >
              {c.name}
            </Chip>
          ))}
        </div>

        <Button variant="light" onClick={() => setCatModal(true)}>
          Categories
        </Button>

        <Button variant="gold" onClick={openNew}>
          <Plus size={16} />
          Add item
        </Button>
      </PageBar>

      <TableWrap min={720}>
        <thead>
          <tr>
            <Th className="w-21" />
            <Th>Dish</Th>
            <Th>Category</Th>
            <Th>Price</Th>
            <Th>Available</Th>
            <Th />
          </tr>
        </thead>

        <tbody>
          {list?.map((f) => (
            <tr key={f.id} className="hover:bg-white/3">
              <Td>
                <div className="h-12 w-12 overflow-hidden rounded-lg">
                  <Photo src={f.image} alt={f.name} />
                </div>
              </Td>

              <Td>
                <p className="font-bold text-cream">{f.name}</p>
                <p className="max-w-[320px] truncate text-xs text-muted">
                  {f.description}
                </p>
              </Td>

              <Td>
                <Pill kind="gold">{(f.category as Category).name}</Pill>
              </Td>

              <Td className="font-bold">{f.price}$</Td>

              <Td>
                <Toggle
                  on={f.available}
                  onChange={(v) => {
                    foodChangeAvailable.mutate({
                      id: f.id,
                      available: v,
                    });
                  }}
                  label={`${f.name} available`}
                />
              </Td>

              <Td>
                <div className="flex justify-end gap-4 text-muted">
                  <button
                    aria-label={`Edit ${f.name}`}
                    onClick={() => openEdit(f)}
                    className="hover:text-fg"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    aria-label={`Delete ${f.name}`}
                    className="text-danger"
                    onClick={() => foodDelete.mutate(f.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </Td>
            </tr>
          ))}

          {list?.length === 0 && (
            <tr>
              <Td className="py-12 text-center text-muted">No dishes found.</Td>
            </tr>
          )}
        </tbody>
      </TableWrap>

      <p className="mt-4 text-[13px] text-muted">
        {foods?.length ?? 0} dishes -{" "}
        {foods?.filter((f) => !f.available).length ?? 0} currently unavailable
      </p>

      {/* Food modal */}
      <Modal
        open={Boolean(edit)}
        onClose={closeFoodModal}
        title={edit?.id ? "Edit dish" : "Add dish"}
        side
      >
        {edit && (
          <div className="space-y-4">
            <div className="aspect-[16/8] overflow-hidden rounded-[14px]">
              <Photo
                src={
                  newFood.image
                    ? URL.createObjectURL(newFood.image)
                    : newFood.existingImage
                }
                alt={newFood.name}
                label={
                  newFood.existingImage || newFood.image
                    ? undefined
                    : "Dish photo"
                }
              />
            </div>

            <Field label="Image">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;

                  setNewFood((prev) => ({
                    ...prev,
                    image: file,
                  }));
                }}
              />

              {newFood.existingImage && !newFood.image && (
                <p className="mt-2 text-xs text-muted">
                  Current image will be kept.
                </p>
              )}

              {newFood.image && (
                <p className="mt-2 text-xs text-muted">
                  New image: {newFood.image.name}
                </p>
              )}
            </Field>

            <Field label="Name">
              <Input
                value={newFood.name}
                onChange={(e) =>
                  setNewFood((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Category">
                <Select
                  value={newFood.categoryId}
                  onChange={(e) =>
                    setNewFood((prev) => ({
                      ...prev,
                      categoryId: Number(e.target.value),
                    }))
                  }
                >
                  {categories?.map((c) => (
                    <option value={c.id} key={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Price (EUR)">
                <Input
                  type="number"
                  step="0.5"
                  min="0"
                  value={newFood.price}
                  onChange={(e) =>
                    setNewFood((prev) => ({
                      ...prev,
                      price: Number(e.target.value),
                    }))
                  }
                />
              </Field>
            </div>

            <Field label="Description">
              <Textarea
                value={newFood.description}
                onChange={(e) =>
                  setNewFood((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </Field>

            <div className="flex items-center justify-between">
              <span className="font-semibold">Available for ordering</span>

              <Toggle
                on={newFood.available}
                onChange={(v) =>
                  setNewFood((prev) => ({
                    ...prev,
                    available: v,
                  }))
                }
                label="Available"
              />
            </div>

            <Button
              onClick={() => {
                if (!newFood.categoryId || !newFood.name.trim()) return;

                foodSave.mutate(newFood);
              }}
              size="lg"
              className="w-full"
              disabled={foodSave.isPending}
            >
              {foodSave.isPending
                ? "Saving..."
                : edit.id
                  ? "Save changes"
                  : "Add dish"}
            </Button>
          </div>
        )}
      </Modal>

      {/* Categories modal */}
      <Modal
        open={catModal}
        onClose={() => setCatModal(false)}
        title="Categories"
      >
        <ul className="divide-y divide-line">
          {categories?.map((c) => (
            <li key={c.id} className="flex items-center justify-between py-3">
              <span className="font-semibold">{c.name}</span>

              <button
                onClick={() => categoryDelete.mutate(c.id)}
                aria-label={`Delete ${c.name}`}
                className="text-danger"
              >
                <Trash2 size={17} />
              </button>
            </li>
          ))}
        </ul>

        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();

            if (!newCat.trim()) return;

            categorySave.mutate(newCat.trim());
          }}
        >
          <Input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="New category name"
          />

          <Button
            type="submit"
            variant="subtle"
            className="shrink-0"
            disabled={categorySave.isPending}
          >
            <Plus size={15} />
            Add
          </Button>
        </form>
      </Modal>
    </div>
  );
}
