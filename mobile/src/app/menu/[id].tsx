import { router, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { useFood } from "@/api/menu";
import { Button, Photo, Pill, Screen, Text } from "@/components/ui";
import { money } from "@/lib/utils";

export default function FoodScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const food = useFood(Number(id));

  if (!food) {
    return (
      <View className="flex-1 items-center justify-center bg-bg px-4">
        <Text className="font-display text-3xl text-cream">Dish not found</Text>
      </View>
    );
  }

  return (
    <Screen inset>
      <View className="px-4 py-8">
        <View className="aspect-[4/3] overflow-hidden rounded-[22px]">
          <Photo src={food.image} label={food.name} />
        </View>
        <View className="mt-8">
          <Pill kind="gold">{food.category.name}</Pill>
          <Text className="font-display mt-4 text-4xl leading-[44px] text-cream">{food.name}</Text>
          <Text className="mt-5 text-[17px] leading-7 text-muted">{food.description}</Text>
          <Text className="font-inter-bold mt-6 text-3xl">{money(food.price)}</Text>
          <View className="mt-8 gap-3">
            {food.available ? (
              <Button size="lg" href="/delivery">Order delivery</Button>
            ) : (
              <Pill kind="cancelled">Sold out today</Pill>
            )}
            <Button size="lg" variant="outline" onPress={() => router.back()}>Back to menu</Button>
          </View>
        </View>
      </View>
    </Screen>
  );
}
