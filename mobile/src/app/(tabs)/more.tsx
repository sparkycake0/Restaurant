import { router } from "expo-router";
import { ChevronRight, Info, Mail, Users, type LucideIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Footer } from "@/components/footer";
import { Card, PageHeader, Screen, Text } from "@/components/ui";
import { colors } from "@/lib/colors";

const ROWS: { icon: LucideIcon; title: string; text: string; href: string }[] = [
  { icon: Users, title: "Catering & events", text: "Tell us about your event", href: "/catering" },
  { icon: Info, title: "About & info", text: "Our story, opening hours, good to know", href: "/info" },
  { icon: Mail, title: "Contact us", text: "Questions, feedback or special requests", href: "/contact" },
];

export default function MoreScreen() {
  return (
    <Screen>
      <PageHeader title="More" sub="Everything else about the restaurant." />
      <View className="gap-4 px-4 py-8">
        {ROWS.map(({ icon: Icon, title, text, href }) => (
          <Pressable key={title} onPress={() => router.push(href as never)}>
            <Card className="flex-row items-center gap-4 p-5">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-gold-soft">
                <Icon size={22} color={colors.goldText} />
              </View>
              <View className="flex-1">
                <Text className="font-display text-lg text-cream">{title}</Text>
                <Text className="mt-0.5 text-sm text-muted">{text}</Text>
              </View>
              <ChevronRight size={20} color={colors.muted} />
            </Card>
          </Pressable>
        ))}
      </View>
      <Footer />
    </Screen>
  );
}
