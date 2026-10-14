import { Tabs } from "expo-router";
import { Ellipsis, House, Image as ImageIcon, Truck, UtensilsCrossed } from "lucide-react-native";
import { AppHeader } from "@/components/app-header";
import { colors } from "@/lib/colors";

// Bottom tab bar = the website's main navigation (Catering, Info and Contact live under "More").
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        header: () => <AppHeader />,
        tabBarActiveTintColor: colors.goldText,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.line },
        tabBarLabelStyle: { fontFamily: "Inter_600SemiBold", fontSize: 11 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color }) => <House size={22} color={color} /> }} />
      <Tabs.Screen name="menu" options={{ title: "Menu", tabBarIcon: ({ color }) => <UtensilsCrossed size={22} color={color} /> }} />
      <Tabs.Screen name="delivery" options={{ title: "Delivery", tabBarIcon: ({ color }) => <Truck size={22} color={color} /> }} />
      <Tabs.Screen name="gallery" options={{ title: "Gallery", tabBarIcon: ({ color }) => <ImageIcon size={22} color={color} /> }} />
      <Tabs.Screen name="more" options={{ title: "More", tabBarIcon: ({ color }) => <Ellipsis size={22} color={color} /> }} />
    </Tabs>
  );
}
