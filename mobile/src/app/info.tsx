import { Accessibility, Baby, Car, CreditCard, Mail, MapPin, Phone, type LucideIcon } from "lucide-react-native";
import type { ReactNode } from "react";
import { View } from "react-native";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/icons";
import { Card, PageHeader, Photo, Screen, Text } from "@/components/ui";
import { images } from "@/data/images";
import { settings as s } from "@/data/settings";
import { colors } from "@/lib/colors";

const GOOD: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Car, title: "Free parking", text: "Behind the building" },
  { icon: Accessibility, title: "Accessible", text: "Step-free entrance" },
  { icon: CreditCard, title: "Cards & cash", text: "All major cards" },
  { icon: Baby, title: "Kid friendly", text: "Highchairs available" },
];

function ContactRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <View className="flex-row items-center gap-4">
      <View className="h-11 w-11 items-center justify-center rounded-full bg-gold-soft">{icon}</View>
      <View className="flex-1">
        <Text className="text-[12.5px] text-muted">{label}</Text>
        <Text className="font-inter-semibold">{value}</Text>
      </View>
    </View>
  );
}

export default function InfoScreen() {
  const icon = { size: 20, color: colors.goldText };
  return (
    <Screen inset>
      <PageHeader title="About the restaurant" sub="Who we are, where to find us, and when we are open." />
      <View className="px-4 py-8">
        {/* Story */}
        <Text className="font-display text-3xl text-cream">Our story</Text>
        <Text className="mt-5 text-[17px] leading-[28px] text-muted">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </Text>
        <Text className="mt-4 text-[17px] leading-[28px] text-muted">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
        </Text>
        <Text className="font-inter-semibold mt-6 text-gold-text">- The founders, placeholder text</Text>
        <View className="mt-8 aspect-[7/5] overflow-hidden rounded-[22px]">
          <Photo src={images["dining-room"]} />
        </View>

        <View className="mt-12 gap-6">
          {/* Find us */}
          <Card className="p-4">
            <View className="aspect-[16/9] overflow-hidden rounded-xl">
              <Photo tone={3} label="Map" />
              <View className="absolute inset-0 items-center justify-center">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-[#1f3d36]">
                  <MapPin size={20} color={colors.cream} />
                </View>
              </View>
            </View>
            <View className="p-4">
              <Text className="font-display text-2xl text-cream">Find us</Text>
              <View className="mt-5 gap-4">
                {[
                  { I: MapPin, t: s.address },
                  { I: Car, t: "Free parking behind the building" },
                  { I: Accessibility, t: "Wheelchair accessible entrance" },
                ].map(({ I, t }) => (
                  <View key={t} className="flex-row gap-3">
                    <I size={20} color={colors.goldText} />
                    <Text className="flex-1 text-[15px]">{t}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Card>

          {/* Hours */}
          <Card className="p-7">
            <Text className="font-display text-2xl text-cream">Opening hours</Text>
            <View className="mt-5">
              {s.hours.map((h, i) => (
                <View key={h.day} className={`flex-row justify-between py-3 ${i < s.hours.length - 1 ? "border-b border-line" : ""}`}>
                  <Text className="text-[15px]">{h.day}</Text>
                  <Text className={h.open ? "font-inter-semibold text-[15px] text-cream" : "text-[15px] text-muted"}>
                    {h.open ? `${h.from} - ${h.to}` : "Closed"}
                  </Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Get in touch */}
          <Card className="p-7">
            <Text className="font-display text-2xl text-cream">Get in touch</Text>
            <View className="mt-5 gap-5">
              <ContactRow icon={<Phone {...icon} />} label="Phone" value={s.phone} />
              <ContactRow icon={<Mail {...icon} />} label="Email" value={s.email} />
              <ContactRow icon={<InstagramIcon {...icon} />} label="Instagram" value={s.socials.instagram} />
              <ContactRow icon={<FacebookIcon {...icon} />} label="Facebook" value={s.socials.facebook} />
              <ContactRow icon={<TikTokIcon {...icon} />} label="TikTok" value={s.socials.tiktok} />
            </View>
          </Card>
        </View>

        {/* Good to know */}
        <Text className="font-display mb-6 mt-12 text-3xl text-cream">Good to know</Text>
        <View className="gap-4">
          {GOOD.map(({ icon: I, title, text }) => (
            <Card key={title} className="flex-row items-center gap-4 p-6">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-raised">
                <I size={24} color={colors.mint} />
              </View>
              <View>
                <Text className="font-inter-bold text-cream">{title}</Text>
                <Text className="text-sm text-muted">{text}</Text>
              </View>
            </Card>
          ))}
        </View>
      </View>
    </Screen>
  );
}
