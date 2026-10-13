import { gql } from "@/lib/api";
import type { DiningTable, TableShape } from "@/types";

type ServerTable = Omit<DiningTable, "clientId" | "shape"> & {
  shape: "ROUND" | "RECT";
};

const TABLE_FIELDS = `id label shape seats x y w active`;

const fromServer = (t: ServerTable) => ({
  ...t,
  shape: t.shape.toLowerCase() as TableShape,
});
type TimeRange = {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
};
export const tableService = {
  getAll: async () =>
    (
      await gql<{ tables: ServerTable[] }>(`{ tables { ${TABLE_FIELDS} } }`)
    ).tables.map(fromServer),

  getActive: async (range?: TimeRange) =>
    (
      await gql<{ activeTables: ServerTable[] }>(
        `query ($range: TimeRangeInput) { activeTables(range: $range) { ${TABLE_FIELDS} } }`,
        { range },
      )
    ).activeTables.map(fromServer),

  // Replaces the whole layout: tables missing from the list are deleted on the server.
  saveLayout: (tables: DiningTable[]) =>
    gql(
      `mutation ($tables: [TableInput!]!) {
        saveTableLayout(tables: $tables) { id }
      }`,
      {
        tables: tables.map(({ clientId, ...t }) => ({
          ...t,
          w: t.w ?? 0,
          shape: t.shape.toUpperCase(),
        })),
      },
    ),
};
