import { useState } from "react";
import { View } from "react-native";
import { useFoods } from "@/api/menu";
import { useToast } from "@/components/toast";
import { Button, Card, Field, Input, PageHeader, Photo, Screen, Stepper, Text, Textarea } from "@/components/ui";
import { settings } from "@/data/settings";
import { money } from "@/lib/utils";

export default function DeliveryScreen() {
  const toast = useToast();
  const { data } = useFoods();
  const foods = data.filter((f) => f.available);

  // quantity per food id, e.g. { 1: 2, 5: 1 }
  const [qty, setQty] = useState<Record<number, number>>({});
  const [form, setForm] = useState({ name: "", phone: "", address: "", apartment: "", notes: "" });
  const set = (key: keyof typeof form, value: string) => setForm({ ...form, [key]: value });

  const chosen = foods.filter((f) => qty[f.id] > 0);
  const total = chosen.reduce((sum, f) => sum + f.price * qty[f.id], 0);

  return (
    <Screen>
      <PageHeader title="Order delivery" sub={`Usually at your door in ${settings.delivery.eta} minutes.`} />
      <View className="gap-8 px-4 py-8">
        {/* Foods */}
        <View className="gap-3">
          {foods.map((f) => (
            <Card key={f.id} className="flex-row items-center gap-4 p-3">
              <View className="h-20 w-24 overflow-hidden rounded-xl">
                <Photo src={f.image} />
              </View>
              <View className="flex-1">
                <Text numberOfLines={2} className="font-display text-lg text-cream">{f.name}</Text>
                <Text className="mt-0.5 text-sm text-muted">{money(f.price)}</Text>
                <View className="mt-2 self-start">
                  <Stepper value={qty[f.id] ?? 0} onChange={(n) => setQty({ ...qty, [f.id]: n })} />
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Order form */}
        <Card className="gap-4 p-6">
          <Text className="font-display text-2xl text-cream">Your order</Text>
          {chosen.length === 0 && <Text className="text-sm text-muted">Nothing added yet.</Text>}
          {chosen.map((f) => (
            <View key={f.id} className="flex-row justify-between">
              <Text className="flex-1 text-sm">{qty[f.id]} x {f.name}</Text>
              <Text className="text-sm">{money(f.price * qty[f.id])}</Text>
            </View>
          ))}
          <View className="flex-row justify-between border-t border-line pt-4">
            <Text className="font-inter-bold">Total</Text>
            <Text className="font-inter-bold">{money(total)}</Text>
          </View>

          <Field label="Name"><Input value={form.name} onChangeText={(v) => set("name", v)} autoComplete="name" /></Field>
          <Field label="Phone"><Input value={form.phone} onChangeText={(v) => set("phone", v)} keyboardType="phone-pad" autoComplete="tel" /></Field>
          <Field label="Address"><Input value={form.address} onChangeText={(v) => set("address", v)} autoComplete="street-address" /></Field>
          <Field label="Apartment"><Input value={form.apartment} onChangeText={(v) => set("apartment", v)} /></Field>
          <Field label="Notes"><Textarea className="min-h-[80px]" value={form.notes} onChangeText={(v) => set("notes", v)} /></Field>
          {/* TODO(api): send the order to your server here */}
          <Button size="lg" disabled={chosen.length === 0} onPress={() => toast("Order placed (sample only)")}>Place order</Button>
        </Card>
      </View>
    </Screen>
  );
}
