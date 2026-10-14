/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Same colors as the website (client/src/app/globals.css)
      colors: {
        bg: "#0e1714",
        card: "#15221d",
        raised: "#182720",
        field: "#0e1915",
        line: "#25372f",
        border: "#34493f",
        primary: "#2c6653",
        deep: "#163329",
        hero: "#12302a",
        ink: "#0a110f",
        gold: "#e5ad3c",
        "gold-text": "#f0c46a",
        "gold-soft": "#3a2f15",
        fg: "#eee6d5",
        cream: "#f3ead8",
        muted: "#97a89f",
        danger: "#e2705c",
        ok: "#5fbf8a",
        mint: "#8fc3ab",
      },
      // React Native needs one font family per weight (names come from @expo-google-fonts)
      fontFamily: {
        inter: ["Inter_400Regular"],
        "inter-medium": ["Inter_500Medium"],
        "inter-semibold": ["Inter_600SemiBold"],
        "inter-bold": ["Inter_700Bold"],
        display: ["PlayfairDisplay_700Bold"],
      },
    },
  },
  plugins: [],
};
