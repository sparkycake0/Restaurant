import { Check } from "lucide-react-native";
import { createContext, useContext, useState, type ReactNode } from "react";
import { View } from "react-native";
import { colors } from "@/lib/colors";
import { Text } from "@/components/ui";

type ToastFn = (text: string) => void;
const ToastContext = createContext<ToastFn>(() => {});

// Small message at the bottom of the screen. Use:  const toast = useToast();  toast("Saved");
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<{ id: number; text: string }[]>([]);

  const toast: ToastFn = (text) => {
    const id = Date.now() + Math.random();
    setItems((l) => [...l, { id, text }]);
    setTimeout(() => setItems((l) => l.filter((t) => t.id !== id)), 3000);
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <View pointerEvents="none" className="absolute inset-x-0 bottom-28 items-center gap-2 px-4">
        {items.map((t) => (
          <View key={t.id} className="flex-row items-center gap-3 rounded-full border border-ok/40 bg-[#163828] px-5 py-3">
            <Check size={16} color={colors.ok} />
            <Text className="font-inter-medium text-sm text-[#7fd0a0]">{t.text}</Text>
          </View>
        ))}
      </View>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
