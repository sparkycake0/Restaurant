"use client";

import { Circle, Move, Square, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Panel } from "@/components/admin-shared";
import {
  ROOM_H,
  ROOM_W,
  TableShape,
  Room,
  seatPoints,
  tableRadius,
  tableWidth,
} from "@/components/floor";
import {
  Button,
  Chip,
  Field,
  Input,
  Select,
  Stepper,
  Toggle,
} from "@/components/ui";
import { tableService } from "@/api/table";
import { queryKeys } from "@/lib/queryKeys";
import { useToast } from "@/lib/toast";
import type { DiningTable } from "@/types";

// Dashed gold box around the selected table
function SelectionOutline({ table: t }: { table: DiningTable }) {
  const r = t.shape === "round" ? tableRadius(t) + 30 : 0;
  const w = t.shape === "round" ? r * 2 : tableWidth(t) + 30;
  const h = t.shape === "round" ? r * 2 : 52 + 74;
  const far = Math.max(...seatPoints(t, 11, 8).map((p) => Math.abs(p.y)), 0);

  return (
    <rect
      x={t.x - w / 2}
      y={t.y - Math.max(h / 2, far + 14)}
      width={w}
      height={Math.max(h, (far + 14) * 2)}
      rx="6"
      fill="none"
      stroke="#e5ad3c"
      strokeWidth="1.5"
      strokeDasharray="5 4"
      pointerEvents="none"
    />
  );
}

export default function TablesPage() {
  const queryClient = useQueryClient();
  const toast = useToast();

  // ---- server data ----
  const { data: serverTables, isLoading } = useQuery({
    queryKey: queryKeys.tables,
    queryFn: tableService.getAll,
  });

  // ---- local editing state (saved only when you press "Save layout") ----
  const [tables, setTables] = useState<DiningTable[]>([]);
  const [sel, setSel] = useState<string | null>(null); // clientId of the selected table
  const [snap, setSnap] = useState(true);

  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef<{ clientId: string; dx: number; dy: number } | null>(
    null,
  );

  // copy the server tables into the editing state
  useEffect(() => {
    if (serverTables)
      setTables(
        serverTables.map((t) => ({ ...t, clientId: crypto.randomUUID() })),
      );
  }, [serverTables]);

  const t = tables.find((table) => table.clientId === sel);

  const patch = (clientId: string, changes: Partial<DiningTable>) =>
    setTables((current) =>
      current.map((table) =>
        table.clientId === clientId ? { ...table, ...changes } : table,
      ),
    );

  // changes of the selected table
  const edit = (changes: Partial<DiningTable>) =>
    t && patch(t.clientId, changes);

  const dirty =
    JSON.stringify(tables.map(({ clientId, ...table }) => table)) !==
    JSON.stringify(serverTables ?? []);

  // mouse position -> position inside the floor plan
  function toSvg(e: React.PointerEvent) {
    const s = svg.current!;
    const pt = s.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    return pt.matrixTransform(s.getScreenCTM()!.inverse());
  }

  const down = (tb: DiningTable) => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    const p = toSvg(e);
    drag.current = { clientId: tb.clientId, dx: tb.x - p.x, dy: tb.y - p.y };
    setSel(tb.clientId);
  };

  const move = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const p = toSvg(e);
    const grid = snap ? 10 : 1;
    const x = Math.round((p.x + drag.current.dx) / grid) * grid;
    const y = Math.round((p.y + drag.current.dy) / grid) * grid;
    patch(drag.current.clientId, {
      x: Math.max(40, Math.min(ROOM_W - 40, x)),
      y: Math.max(40, Math.min(ROOM_H - 40, y)),
    });
  };

  const add = (shape: "round" | "rect") => {
    const newTable: DiningTable = {
      id: null,
      clientId: crypto.randomUUID(),
      label: `T${tables.length + 1}`,
      shape,
      seats: shape === "round" ? 4 : 6,
      x: 380,
      y: 280,
      w: shape === "rect" ? 120 : 0,
      active: true,
    };
    setTables((current) => [...current, newTable]);
    setSel(newTable.clientId);
  };

  const remove = (clientId: string) => {
    setTables((current) =>
      current.filter((table) => table.clientId !== clientId),
    );
    setSel(null);
  };

  const tableSave = useMutation({
    mutationFn: tableService.saveLayout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tables });
      toast("Floor plan saved");
    },
    onError: () => toast("Failed to save floor plan", "error"),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-muted">
        Loading floor plan...
      </div>
    );
  }

  return (
    <div>
      {/* Top bar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Button variant="light" onClick={() => add("round")}>
          <Circle size={15} />
          Add round table
        </Button>
        <Button variant="light" onClick={() => add("rect")}>
          <Square size={15} />
          Add rectangular table
        </Button>

        <label className="flex items-center gap-3 text-sm font-semibold">
          <Toggle on={snap} onChange={setSnap} label="Snap to grid" />
          Snap to grid
        </label>

        <span className="flex-1" />

        <Button
          variant="gold"
          disabled={!dirty || tableSave.isPending}
          onClick={() => tableSave.mutate(tables)}
        >
          {tableSave.isPending ? "Saving..." : "Save layout"}
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        {/* Floor plan */}
        <Panel>
          <div className="overflow-x-auto">
            <div className="min-w-[620px]">
              <svg
                ref={svg}
                viewBox={`0 0 ${ROOM_W} ${ROOM_H}`}
                className="h-auto w-full touch-none select-none"
                onPointerMove={move}
                onPointerUp={() => (drag.current = null)}
                onPointerLeave={() => (drag.current = null)}
                onPointerDown={(e) =>
                  e.target === e.currentTarget && setSel(null)
                }
              >
                <Room grid>
                  {tables.map((tb) => (
                    <g
                      key={tb.clientId}
                      onPointerDown={down(tb)}
                      style={{ cursor: "grab", opacity: tb.active ? 1 : 0.45 }}
                    >
                      <TableShape
                        table={tb}
                        state={tb.clientId === sel ? "sel" : "free"}
                      />
                    </g>
                  ))}
                  {t && <SelectionOutline table={t} />}
                </Room>
              </svg>
            </div>
          </div>

          <p className="mt-3 flex items-center justify-center gap-2 text-center text-[13px] text-muted">
            <Move size={14} />
            Drag tables to move them, then save the layout.
          </p>
        </Panel>

        {/* Table editor */}
        <Panel
          title={t ? `Table ${t.label}` : "Table"}
          sub={t ? "Selected" : "Select a table to edit it"}
        >
          {t ? (
            <div className="space-y-4">
              <Field label="Label">
                <Input
                  value={t.label}
                  onChange={(e) => edit({ label: e.target.value })}
                  maxLength={8}
                />
              </Field>

              <Field label="Shape">
                <Select
                  value={t.shape}
                  onChange={(e) =>
                    edit({ shape: e.target.value as "round" | "rect" })
                  }
                >
                  <option value="round">Round</option>
                  <option value="rect">Rectangular</option>
                </Select>
              </Field>

              <div>
                <p className="mb-1.5 text-[13px] font-semibold">Seats</p>
                <Stepper
                  min={1}
                  value={t.seats}
                  onChange={(n) => edit({ seats: Math.min(12, n) })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Position X">
                  <Input
                    type="number"
                    value={t.x}
                    onChange={(e) => edit({ x: Number(e.target.value) })}
                  />
                </Field>
                <Field label="Position Y">
                  <Input
                    type="number"
                    value={t.y}
                    onChange={(e) => edit({ y: Number(e.target.value) })}
                  />
                </Field>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">
                  Active (can be booked)
                </span>
                <Toggle
                  on={t.active}
                  onChange={(active) => edit({ active })}
                  label="Active"
                />
              </div>

              <Button
                variant="danger"
                className="w-full"
                onClick={() =>
                  confirm(`Delete table ${t.label}?`) && remove(t.clientId)
                }
              >
                <Trash2 size={15} />
                Delete table
              </Button>
            </div>
          ) : (
            <p className="py-6 text-sm text-muted">
              Click a table on the plan.
            </p>
          )}
        </Panel>
      </div>

      {/* All tables */}
      <h3 className="mb-3 mt-8 font-display text-xl text-cream">
        All tables ({tables.length})
      </h3>
      <div className="flex flex-wrap gap-2">
        {tables.map((table) => (
          <Chip
            key={table.clientId}
            active={table.clientId === sel}
            onClick={() => setSel(table.clientId)}
            className="h-9"
          >
            {table.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}
