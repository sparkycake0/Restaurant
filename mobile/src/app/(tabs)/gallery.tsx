import { View } from "react-native";
import { PageHeader, Photo, Screen, Text } from "@/components/ui";
import { galleryImages } from "@/data/gallery";

export default function GalleryScreen() {
  return (
    <Screen>
      <PageHeader title="Gallery" sub="A look at our food, our rooms and our events." />
      <View className="flex-row flex-wrap justify-between gap-y-5 px-4 py-8">
        {galleryImages.map((g) => (
          <View key={g.id} className="w-[48%]">
            <View className="aspect-square overflow-hidden rounded-2xl">
              <Photo src={g.image} />
            </View>
            <Text className="mt-2 text-sm text-muted">{g.caption}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}
