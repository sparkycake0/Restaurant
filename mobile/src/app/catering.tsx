import { Calendar } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { useToast } from "@/components/toast";
import { Button, Card, Field, Input, PageHeader, Screen, Textarea } from "@/components/ui";
import { colors } from "@/lib/colors";

export default function CateringScreen() {
  const toast = useToast();
  const [form, setForm] = useState({ name: "", phone: "", email: "", date: "", guests: "", notes: "" });
  const set = (key: keyof typeof form, value: string) => setForm({ ...form, [key]: value });

  return (
    <Screen inset>
      <PageHeader title="Catering & events" sub="Birthdays, weddings, business lunches - tell us about your event." />
      <View className="px-4 py-8">
        <Card className="gap-4 p-6">
          <Field label="Name"><Input value={form.name} onChangeText={(v) => set("name", v)} autoComplete="name" /></Field>
          <Field label="Phone"><Input value={form.phone} onChangeText={(v) => set("phone", v)} keyboardType="phone-pad" autoComplete="tel" /></Field>
          <Field label="Email"><Input value={form.email} onChangeText={(v) => set("email", v)} keyboardType="email-address" autoCapitalize="none" autoComplete="email" /></Field>
          <Field label="Number of guests"><Input value={form.guests} onChangeText={(v) => set("guests", v)} keyboardType="number-pad" /></Field>
          <Field label="Date">
            {/* TODO: swap for a date picker (@react-native-community/datetimepicker) */}
            <View className="justify-center">
              <Input value={form.date} onChangeText={(v) => set("date", v)} placeholder="YYYY-MM-DD" className="pr-11" />
              <View pointerEvents="none" className="absolute right-4">
                <Calendar size={18} color={colors.muted} />
              </View>
            </View>
          </Field>
          <Field label="Notes"><Textarea value={form.notes} onChangeText={(v) => set("notes", v)} /></Field>
          {/* TODO(api): send `form` to your server here */}
          <Button size="lg" onPress={() => toast("Request sent (sample only)")}>Send request</Button>
        </Card>
      </View>
    </Screen>
  );
}
