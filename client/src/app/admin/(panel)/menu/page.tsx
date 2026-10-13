"use client";

import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { categoryService, foodService, type FoodForm } from "@/api/menu";
import { queryKeys } from "@/lib/queryKeys";
import { useToast } from "@/lib/toast";
import { refresh } from "@/lib/api";

const emptyFood: FoodForm = {
  name: "",
  price: 0,
  categoryId: 0,
  description: "",
  image: null,
  existingImage: null,
  available: true,
};

export default function MenuAdminPage() {
  const toast = useToast();

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");

  const [foodModal, setFoodModal] = useState(false);
  const [form, setForm] = useState<FoodForm>(emptyFood);
  const [catModal, setCatModal] = useState(false);
  const [newCat, setNewCat] = useState("");

  // ---- server data ----
  const {
    data: foods,
    error: foodError,
    isLoading: foodLoading,
  } = useQuery({
    queryKey: queryKeys.foods,
    queryFn: foodService.getAll,
  });
  const { data: categories, error: catError } = useQuery({
    queryKey: queryKeys.categories,
    queryFn: categoryService.getAll,
  });

  const list = foods?.filter(
    (f) =>
      (cat === "all" || f.category.name === cat) &&
      (!q || f.name.toLowerCase().includes(q.toLowerCase())),
  );

  // ---- server actions ----
  const categorySave = useMutation({
    mutationFn: categoryService.save,
    onSuccess: () => {
      refresh(queryKeys.categories);
      setNewCat("");
    },
  });
  const categoryDelete = useMutation({
    mutationFn: categoryService.delete,
    onSuccess: () => refresh(queryKeys.categories),
  });
  const foodSave = useMutation({
    mutationFn: foodService.save,
    onSuccess: () => {
      refresh(queryKeys.foods);
      closeFoodModal();
    },
  });
  const foodDelete = useMutation({
    mutationFn: foodService.delete,
    onSuccess: () => refresh(queryKeys.foods),
  });
  const foodToggle = useMutation({
    mutationFn: foodService.toggleAvailable,
    onSuccess: () => refresh(queryKeys.foods),
  });

  // ---- food modal ----
  const set = (changes: Partial<FoodForm>) =>
    setForm((prev) => ({ ...prev, ...changes }));

  function openNew() {
    if (!categories?.length) return;
    setForm({ ...emptyFood, categoryId: categories[0].id });
    setFoodModal(true);
  }

  function openEdit(food: NonNullable<typeof foods>[number]) {
    setForm({
      id: food.id,
      name: food.name,
      price: food.price,
      categoryId: food.category.id,
      description: food.description,
      image: null,
      existingImage: food.image,
      available: food.available,
    });
    setFoodModal(true);
  }

  function closeFoodModal() {
    setFoodModal(false);
    setForm(emptyFood);
  }

  function saveFood() {
    if (!form.categoryId || !form.name.trim()) return;
    // the server needs an image for a new dish
    if (!form.id && !form.image)
      return toast("Please choose an image", "error");
    foodSave.mutate(form);
  }

  return (
    <div>
      {(foodError || catError) && (
        <p className="mb-4 text-sm text-danger">
          Could not load the menu. Is the server running?
        </p>
      )}

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
                <Pill kind="gold">{f.category.name}</Pill>
              </Td>
              <Td className="font-bold">{f.price}$</Td>
              <Td>
                <Toggle
                  disabled={foodToggle.isPending}
                  on={f.available}
                  onChange={() => foodToggle.mutate(f)}
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
                    className={`text-danger ${foodDelete.isPending && "text-muted"}`}
                    disabled={foodDelete.isPending}
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
        open={foodModal}
        onClose={closeFoodModal}
        title={form.id ? "Edit dish" : "Add dish"}
        side
      >
        <div className="space-y-4">
          <div className="aspect-[16/8] overflow-hidden rounded-[14px]">
            <Photo
              src={
                form.image
                  ? URL.createObjectURL(form.image)
                  : form.existingImage
              }
              alt={form.name}
              label={
                form.existingImage || form.image ? undefined : "Dish photo"
              }
            />
          </div>

          <Field label="Image">
            {form.existingImage && (
              <span className="text-muted text-sm">
                If your intention isnt editing current image please don't add
                again same image.
              </span>
            )}
            <label className="flex h-10 cursor-pointer mt-5 items-center overflow-hidden rounded-md border border-border bg-field transition-colors hover:border-primary">
              <span className="flex h-full items-center border-r border-border bg-raised px-3 text-sm font-medium text-fg">
                Choose image
              </span>

              <span className="truncate px-3 text-sm text-muted">
                {form.image?.name ??
                  (form.existingImage
                    ? "Image is already selected"
                    : "No image selected")}
              </span>

              <Input
                type="file"
                accept="image/*"
                onChange={(e) => set({ image: e.target.files?.[0] ?? null })}
                className="hidden"
              />
            </label>
          </Field>

          <Field label="Name">
            <Input
              value={form.name}
              onChange={(e) => set({ name: e.target.value })}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <Select
                value={form.categoryId}
                onChange={(e) => set({ categoryId: Number(e.target.value) })}
              >
                {categories?.map((c) => (
                  <option value={c.id} key={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Price (whole number)">
              <Input
                type="number"
                step="1"
                min="0"
                value={form.price}
                onChange={(e) => set({ price: Number(e.target.value) })}
              />
            </Field>
          </div>

          <Field label="Description">
            <Textarea
              value={form.description}
              onChange={(e) => set({ description: e.target.value })}
            />
          </Field>

          <div className="flex items-center justify-between">
            <span className="font-semibold">Available for ordering</span>
            <Toggle
              on={form.available}
              onChange={(available) => set({ available })}
              label="Available"
            />
          </div>

          <Button
            onClick={saveFood}
            size="lg"
            className="w-full"
            disabled={foodSave.isPending}
          >
            {foodSave.isPending
              ? "Saving..."
              : form.id
                ? "Save changes"
                : "Add dish"}
          </Button>
        </div>
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
            if (newCat.trim()) categorySave.mutate(newCat.trim());
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
