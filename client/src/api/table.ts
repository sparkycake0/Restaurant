import { api } from "@/lib/api";
import type { DiningTable, TableShape } from "@/types";

// The server uses "ROUND" / "RECT", the pages use "round" / "rect".
type ServerTable = Omit<DiningTable, "clientId" | "shape"> & {
  shape: "ROUND" | "RECT";
};

export const tableService = {
  getAll: async () => {
    const tables = await api<ServerTable[]>("tables");
    return tables.map((t) => ({
      ...t,
      shape: t.shape.toLowerCase() as TableShape,
    }));
  },

  // Replaces the whole layout: tables missing from the list are deleted on the server.
  saveLayout: (tables: DiningTable[]) =>
    api("tables/layout", {
      method: "PUT",
      body: {
        tables: tables.map(({ clientId, ...t }) => ({
          ...t,
          shape: t.shape.toUpperCase(),
        })),
      },
    }),
  getActive: async () => {
    const tables = await api<ServerTable[]>("tables/available");
    return tables.map((t) => ({
      ...t,
      shape: t.shape.toLowerCase() as TableShape,
    }));
  },
};
