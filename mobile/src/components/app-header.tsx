import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Logo, Text } from "@/components/ui";
import { settings } from "@/data/settings";

// Top bar of the tab screens: logo + name on the left, "Order now" on the right (like the website navbar).
export function AppHeader() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top }} className="border-b border-line bg-card">
      <View className="h-16 flex-row items-center justify-between px-4">
        <View className="flex-row items-center gap-3">
          <Logo size={40} />
          <Text className="font-display text-xl text-cream">{settings.name}</Text>
        </View>
        <Button size="sm" href="/delivery">Order now</Button>
      </View>
    </View>
  );
}
