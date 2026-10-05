import type { DiningTable } from "@/data/types";
import { api } from "@/lib/api";

export const tableService = {
  getAll: () => api<DiningTable[]>("tables"),

  saveLayout: (tables: DiningTable[]) =>
    api<DiningTable[]>("tables/layout", {
      method: "PUT",
      body: {
        tables: tables.map(({ clientId, ...table }) => ({
          ...table,
          shape: table.shape.toUpperCase(),
        })),
      },
    }),
};
