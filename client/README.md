# Restaurant client

Next.js 15 + Tailwind + React Query. The backend is the Spring Boot server in `../server`.

```bash
npm install   # or pnpm install
npm run dev   # http://localhost:3000
```

The server address is `http://localhost:8080`. To change it, set `NEXT_PUBLIC_API_URL`.

## Where things are

| What | Where |
|---|---|
| Public pages (home, menu, delivery, catering, gallery, info, contact) | `src/app/(site)/` |
| Staff pages | `src/app/admin/(panel)/` (login: `src/app/admin/login/`) |
| Pages wired to the server (React Query) | admin `menu`, `orders`, `orders/new`, `tables` |
| API calls | `src/api/` (menu, orders, table) and the fetch helper `src/lib/api.ts` |
| Query keys | `src/lib/queryKeys.ts` |
| All types | `src/types.ts` |
| Sample data for pages not wired yet | `src/data/` |
| Buttons, inputs, cards | `src/components/ui.tsx` |
| Floor plan drawing | `src/components/floor.tsx` |

## Wiring a page to the server

Pages that still use sample data have a `// TODO(api)` comment. Replace the sample array with
`useQuery({ queryKey: queryKeys.xxx, queryFn: xxxService.getAll })` and add the call to the matching file in `src/api/`.
