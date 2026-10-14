import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { Card, Photo, Text } from "@/components/ui";
import { money } from "@/lib/utils";
import type { Food } from "@/types";

export function FoodCard({ food, tone = 0, className }: { food: Food; tone?: number; className?: string }) {
  return (
    <Pressable className={className} onPress={() => router.push(`/menu/${food.id}`)}>
      <Card className="p-3">
        <View className="aspect-[16/10] overflow-hidden rounded-xl">
          <Photo src={food.image} tone={tone} label={food.name} />
          {!food.available && (
            <View className="absolute inset-0 items-center justify-center bg-black/60">
              <Text className="font-inter-bold text-lg text-white">Sold out today</Text>
            </View>
          )}
        </View>
        <View className="px-2.5 pt-4">
          <Text className="font-display text-xl text-cream">{food.name}</Text>
          <Text numberOfLines={2} className="mt-1.5 text-sm leading-[18px] text-muted">{food.description}</Text>
          <Text className="font-inter-bold mt-4 border-t border-line pt-4 text-xl">{money(food.price)}</Text>
        </View>
      </Card>
    </Pressable>
  );
}
