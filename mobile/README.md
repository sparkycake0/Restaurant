# Restaurant - mobile app (design only)

React Native (Expo) version of the website in `../client`. Screens are design only, with sample data - no backend yet.

## Run

```bash
npm install
npx expo start
```

Scan the QR code with **Expo Go** on your phone (same Wi-Fi), or press `a` for an Android emulator / `i` for the iOS simulator.

## Structure

```
src/app/            screens (Expo Router - every file is a route)
  (tabs)/           bottom tabs: Home, Menu, Delivery, Gallery, More
  menu/[id].tsx     dish details
  catering.tsx  info.tsx  contact.tsx
src/components/     ui.tsx (Button, Card, Input, ...), food-card, footer, toast, icons
src/api/menu.ts     React Query hooks - swap the sample data for your server here
src/data/           sample data (same as the website)
tailwind.config.js  website colors + fonts
```

## Connecting the backend later

Screens only call `useFoods()` / `useFood()` from `src/api/menu.ts`. Replace `foodService.getAll`
with a request to the Spring Boot GraphQL server and remove `initialData`.
Forms have `TODO(api)` comments where the submit calls go.
On a real phone use your computer's IP instead of `localhost` for the server URL.
