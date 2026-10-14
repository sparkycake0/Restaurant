import { Check, Clock, Mail, MapPin, Phone, type LucideIcon } from "lucide-react-native";
import { useState } from "react";
import { Linking, Pressable, ScrollView, View } from "react-native";
import { Button, Card, Chip, Field, Input, PageHeader, Photo, Screen, Text, Textarea } from "@/components/ui";
import { settings as s } from "@/data/settings";
import { colors } from "@/lib/colors";

const SUBJECTS = ["General question", "Reservation", "Catering", "Delivery issue", "Feedback"];

export default function ContactScreen() {
  const [f, setF] = useState({ name: "", email: "", phone: "", subject: SUBJECTS[0], message: "" });
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof f, v: string) => setF((old) => ({ ...old, [k]: v }));

  const rows: { icon: LucideIcon; label: string; value: string; href?: string }[] = [
    { icon: MapPin, label: "Address", value: s.address },
    { icon: Phone, label: "Phone", value: s.phone, href: `tel:${s.phone.replace(/\s/g, "")}` },
    { icon: Mail, label: "Email", value: s.email, href: `mailto:${s.email}` },
    { icon: Clock, label: "Open", value: `Daily ${s.hours[0]?.from} - ${s.hours[0]?.to}` },
  ];

  return (
    <Screen inset>
      <PageHeader title="Contact us" sub="Questions, feedback or special requests - we would love to hear from you." />
      <View className="gap-6 px-4 py-8">
        <Card className="p-6">
          <Text className="font-display mb-6 text-2xl text-cream">Send us a message</Text>
          {sent ? (
            <View className="items-center py-8">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-[#163828]">
                <Check size={32} color={colors.ok} />
              </View>
              <Text className="font-display mt-5 text-2xl text-cream">Message sent</Text>
              <Text className="mt-2 text-center text-muted">Thank you! We will get back to you as soon as we can.</Text>
            </View>
          ) : (
            <View className="gap-4">
              <Field label="Your name"><Input value={f.name} onChangeText={(v) => set("name", v)} autoComplete="name" /></Field>
              <Field label="Email"><Input value={f.email} onChangeText={(v) => set("email", v)} keyboardType="email-address" autoCapitalize="none" autoComplete="email" /></Field>
              <Field label="Phone (optional)"><Input value={f.phone} onChangeText={(v) => set("phone", v)} keyboardType="phone-pad" autoComplete="tel" /></Field>
              <Field label="Subject">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2">
                  {SUBJECTS.map((x) => (
                    <Chip key={x} active={f.subject === x} onPress={() => set("subject", x)}>{x}</Chip>
                  ))}
                </ScrollView>
              </Field>
              <Field label="Message">
                <Textarea value={f.message} onChangeText={(v) => set("message", v)} placeholder="Write your message here..." className="min-h-[150px]" />
              </Field>
              {/* TODO(api): send `f` to your server here */}
              <Button size="lg" onPress={() => setSent(true)}>Send message</Button>
            </View>
          )}
        </Card>

        <Card className="p-6">
          <Text className="font-display mb-6 text-2xl text-cream">Reach us directly</Text>
          <View className="gap-5">
            {rows.map(({ icon: Icon, label, value, href }) => (
              <View key={label} className="flex-row items-center gap-4">
                <View className="h-11 w-11 items-center justify-center rounded-full bg-gold-soft">
                  <Icon size={20} color={colors.goldText} />
                </View>
                <View className="flex-1">
                  <Text className="text-[12.5px] text-muted">{label}</Text>
                  {href ? (
                    <Pressable onPress={() => Linking.openURL(href)}>
                      <Text className="font-inter-semibold">{value}</Text>
                    </Pressable>
                  ) : (
                    <Text className="font-inter-semibold">{value}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </Card>

        <View className="aspect-[16/8] overflow-hidden rounded-[18px]">
          <Photo tone={3} label="Map" />
          <View className="absolute inset-0 items-center justify-center">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-[#1f3d36]">
              <MapPin size={20} color={colors.cream} />
            </View>
          </View>
        </View>
      </View>
    </Screen>
  );
}
