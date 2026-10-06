# Restaurant website - frontend only

Next.js 15 + Tailwind CSS. This is **only the design**: there is no server code, no API layer and no real login.
Everything you see comes from plain arrays in `src/data/`.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

## Where things are

| What | Where |
|---|---|
| Public pages (home, menu, catering, delivery, gallery, info, contact) | `src/app/(site)/` |
| Staff panel pages | `src/app/admin/(panel)/` (login page: `src/app/admin/login/`) |
| **Placeholder data** (menu, tables, orders, reservations, customers, staff, settings, gallery) | `src/data/` - plain arrays of objects |
| Shape of every object (`Food`, `Order`, ...) | `src/data/types.ts` |
| Placeholder images | `public/images/` |
| Colours / fonts | `src/app/globals.css` (`@theme`) |
| Buttons, inputs, cards ... | `src/components/ui.tsx` |
| Floor plan (tables + chairs) | `src/components/floor.tsx` |

## Login (placeholder)

`/admin/login` accepts **any** username and password and saves them in `localStorage` under the key `user`.
The staff pages check that key; if it is missing you are sent back to the login page. Log out = the key is removed.
Replace it with your real login later (`src/app/admin/login/page.tsx`, `src/lib/useUser.ts`,
`src/app/admin/(panel)/layout.tsx`).

## How the data works right now

* Public pages just import the arrays from `src/data/`.
* Staff pages copy those arrays into `localStorage` with one small hook, `useLocalStorage(key, startingArray)` in
  `src/lib/useLocalStorage.ts`. So changes you make in the staff panel (change order status, add a dish, ...) stay after a refresh.
* When a customer places a delivery order or a catering reservation on the public site, it is saved to `localStorage` too,
  so you can see it in the staff panel (`/admin/orders`, `/admin/reservations`).
* The public menu/gallery/info do **not** read those saved edits - they read `src/data/` directly.

To clear all the saved data: browser dev tools -> Application -> Local Storage -> clear.

## Connecting your backend

Search the project for **`TODO`** - every place that needs a backend call is marked (about 15 places).
Typical change: replace `useLocalStorage("orders", sampleOrders)` with data you fetch, and replace the
`setOrders(...)` line with a request to your API. `src/data/types.ts` shows the fields each object needs.

## Packages

`@tanstack/react-query` and `firebase` are in `package.json` for when you connect the backend, but **nothing uses them yet**.
Redis is not part of this project - it belongs on the Spring Boot side (caching).
