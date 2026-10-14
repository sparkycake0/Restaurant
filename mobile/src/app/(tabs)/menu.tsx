import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useFoods } from "@/api/menu";
import { FoodCard } from "@/components/food-card";
import { Chip, PageHeader, Screen } from "@/components/ui";

export default function MenuScreen() {
  const { data: foods } = useFoods();
  const [category, setCategory] = useState("All");

  const categories = ["All", ...new Set(foods.map((f) => f.category.name))];
  const shown = foods.filter((f) => category === "All" || f.category.name === category);

  return (
    <Screen>
      <PageHeader title="Our menu" sub="Seasonal dishes, cooked fresh every day." />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="grow-0" contentContainerClassName="gap-2 px-4 pt-6">
        {categories.map((c) => (
          <Chip key={c} active={c === category} onPress={() => setCategory(c)}>{c}</Chip>
        ))}
      </ScrollView>
      <View className="gap-5 px-4 py-8">
        {shown.map((f, i) => (
          <FoodCard key={f.id} food={f} tone={i} />
        ))}
      </View>
    </Screen>
  );
}
