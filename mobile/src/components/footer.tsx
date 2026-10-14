import { router, type Href } from "expo-router";
import { Pressable, View } from "react-native";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/icons";
import { Logo, Text } from "@/components/ui";
import { settings } from "@/data/settings";
import { colors } from "@/lib/colors";

const LINKS = [
  ["/menu", "Menu"],
  ["/catering", "Catering"],
  ["/delivery", "Delivery"],
  ["/gallery", "Gallery"],
  ["/info", "Info & hours"],
];

export function Footer() {
  const today = settings.hours[0];
  return (
    <View className="bg-ink px-4 pb-8 pt-12">
      <View className="flex-row items-center gap-3">
        <Logo size={44} />
        <Text className="font-display text-[22px] text-cream">{settings.name}</Text>
      </View>
      <Text className="mt-5 text-[15px] leading-6 text-cream/70">
        Seasonal cooking for your table, your doorstep and your biggest celebrations.
      </Text>

      <View className="mt-10 flex-row gap-10">
        <View>
          <Text className="font-display mb-4 text-base text-gold">Explore</Text>
          {LINKS.map(([href, label]) => (
            <Pressable key={href} onPress={() => router.push(href as Href)} className="py-1.5">
              <Text className="text-[14.5px] text-cream/75">{label}</Text>
            </Pressable>
          ))}
        </View>
        <View className="flex-1">
          <Text className="font-display mb-4 text-base text-gold">Visit us</Text>
          <Text className="text-[14.5px] leading-[22px] text-cream/75">{settings.address}</Text>
          <Text className="mt-2.5 text-[14.5px] leading-[22px] text-cream/75">Open daily {today?.from} - {today?.to}</Text>
          <Text className="mt-2.5 text-[14.5px] text-cream/75">{settings.phone}</Text>
        </View>
      </View>

      <Text className="font-display mb-4 mt-10 text-base text-gold">Follow us</Text>
      <View className="flex-row gap-3">
        {[InstagramIcon, FacebookIcon, TikTokIcon].map((Icon, i) => (
          <View key={i} className="h-10 w-10 items-center justify-center rounded-full border border-cream/30">
            <Icon size={18} color={colors.cream} />
          </View>
        ))}
      </View>

      <View className="mt-10 border-t border-cream/15 pt-6">
        <Text className="text-[13px] text-cream/55">&copy; {new Date().getFullYear()} {settings.name}. All rights reserved.</Text>
        <Text className="mt-1 text-[13px] text-cream/55">Privacy - Terms</Text>
      </View>
    </View>
  );
}
