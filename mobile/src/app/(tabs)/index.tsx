import { router } from "expo-router";
import { ChevronRight, Truck, Users, Utensils, type LucideIcon } from "lucide-react-native";
import { Pressable, ScrollView, View } from "react-native";
import { useFoods } from "@/api/menu";
import { FoodCard } from "@/components/food-card";
import { Footer } from "@/components/footer";
import { Button, Card, Photo, Screen, SectionTitle, Text } from "@/components/ui";
import { galleryImages } from "@/data/gallery";
import { images } from "@/data/images";
import { colors } from "@/lib/colors";

const WAYS: { icon: LucideIcon; title: string; text: string; href: string; cta: string }[] = [
  { icon: Utensils, title: "Dine in", text: "Browse the menu and visit us in the dining room.", href: "/menu", cta: "Browse the menu" },
  { icon: Truck, title: "Delivery", text: "Hot food at your door in 35-50 minutes.", href: "/delivery", cta: "Order delivery" },
  { icon: Users, title: "Catering & events", text: "Tell us about your event and we handle the food.", href: "/catering", cta: "Plan an event" },
];

export default function HomeScreen() {
  const { data: foods } = useFoods();
  const popular = foods.slice(0, 4);

  return (
    <Screen>
      {/* Hero */}
      <View className="bg-hero px-4 pb-10 pt-10">
        <Text className="font-display text-[36px] leading-[43px] text-cream">Food worth gathering around.</Text>
        <Text className="mt-5 text-lg leading-7 text-cream/80">
          Fresh seasonal cooking for your table, your doorstep, and your next big event.
        </Text>
        <View className="mt-7 flex-row gap-3">
          <Button href="/menu" variant="gold" size="lg" className="flex-1 px-0">View menu</Button>
          <Button href="/catering" variant="outlineLight" size="lg" className="flex-1 px-0">Book catering</Button>
        </View>
        <View className="mt-9 h-[300px] flex-row gap-3">
          <View className="flex-[1.7] overflow-hidden rounded-[22px]">
            <Photo src={images["pasta-truffle"]} />
          </View>
          <View className="flex-1 gap-3">
            <View className="flex-1 overflow-hidden rounded-[22px]">
              <Photo src={images.burrata} />
            </View>
            <View className="flex-1 overflow-hidden rounded-[22px]">
              <Photo src={images.tiramisu} />
            </View>
          </View>
        </View>
      </View>

      {/* Three ways */}
      <View className="px-4 py-14">
        <SectionTitle center title="Three ways to enjoy us" sub="Pick what suits your day - we take care of the rest." />
        <View className="gap-5">
          {WAYS.map(({ icon: Icon, title, text, href, cta }) => (
            <Card key={title} className="p-7">
              <View className="h-14 w-14 items-center justify-center rounded-full bg-gold-soft">
                <Icon size={26} color={colors.goldText} />
              </View>
              <Text className="font-display mt-5 text-2xl text-cream">{title}</Text>
              <Text className="mt-3 leading-6 text-muted">{text}</Text>
              <Pressable onPress={() => router.push(href as never)} className="mt-6 flex-row items-center gap-1">
                <Text className="font-inter-bold text-cream">{cta}</Text>
                <ChevronRight size={18} color={colors.cream} />
              </Pressable>
            </Card>
          ))}
        </View>
      </View>

      {/* Popular */}
      <View className="pb-14">
        <View className="px-4">
          <SectionTitle title="Popular right now" />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-4 px-4">
          {popular.map((f, i) => (
            <FoodCard key={f.id} food={f} tone={i} className="w-[270px]" />
          ))}
        </ScrollView>
      </View>

      {/* Gallery */}
      <View className="px-4 pb-14">
        <SectionTitle title="Moments from our tables" />
        <View className="flex-row flex-wrap gap-3">
          {galleryImages.slice(0, 4).map((g) => (
            <View key={g.id} className="aspect-[3/4] w-[48%] flex-grow overflow-hidden rounded-[18px]">
              <Photo src={g.image} />
            </View>
          ))}
        </View>
      </View>

      <Footer />
    </Screen>
  );
}
