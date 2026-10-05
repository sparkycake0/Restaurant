"use client";
import { Pencil, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { PageBar, TableWrap, Td, Th } from "@/components/admin-shared";
import { Modal } from "@/components/modal";
import { Button, Field, Input } from "@/components/ui";
import { customers as sampleCustomers } from "@/data/customers";
import type { Customer } from "@/data/types";
import { useToast } from "@/lib/toast";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { fmtDate, initials, isoDate } from "@/lib/utils";

export default function CustomersPage() {
  const toast = useToast();
  const [customers, setCustomers] = useLocalStorage<Customer[]>("customers", sampleCustomers);
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState<Customer | null>(null);
  const list = customers.filter((c) => !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.phone.replace(/\s/g, "").includes(q.replace(/\s/g, "")));

  // TODO: send the changes to your backend.
  function save() {
    if (!edit) return;
    setCustomers((all) => all.map((c) => (c.id === edit.id ? edit : c)));
    toast("Customer saved");
    setEdit(null);
  }
  const remove = (c: Customer) => { if (confirm(`Delete ${c.name}?`)) { setCustomers((all) => all.filter((x) => x.id !== c.id)); toast("Customer deleted"); } };

  function exportCsv() {
    const rows = [["Name", "Phone", "Address", "Orders"], ...list.map((c) => [c.name, c.phone, c.address, String(c.ordersCount)])];
    const blob = new Blob([rows.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `customers-${isoDate()}.csv`;
    a.click();
  }

  return (
    <div>
      <PageBar>
        <div className="relative w-full sm:w-80"><Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or phone..." className="pl-11" aria-label="Search customers" /></div>
        <span className="flex-1" /><Button variant="light" onClick={exportCsv} disabled={!list.length}>Export CSV</Button>
      </PageBar>
      <TableWrap min={820}>
        <thead><tr><Th>Name</Th><Th>Phone</Th><Th>Address</Th><Th>Orders</Th><Th>Last order</Th><Th /></tr></thead>
        <tbody>
          {list.map((c) => (
            <tr key={c.id} className="hover:bg-white/[0.03]">
              <Td><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-gold text-[13px] font-bold text-ink">{initials(c.name)}</span><span className="font-bold text-cream">{c.name}</span></div></Td>
              <Td>{c.phone}</Td><Td className="text-muted">{c.address}</Td><Td className="font-bold">{c.ordersCount}</Td><Td className="text-muted">{fmtDate(isoDate(new Date(c.lastOrderAt)))}</Td>
              <Td><div className="flex justify-end gap-4 text-muted"><button aria-label={`Edit ${c.name}`} onClick={() => setEdit(c)} className="hover:text-fg"><Pencil size={18} /></button><button aria-label={`Delete ${c.name}`} onClick={() => remove(c)} className="text-danger"><Trash2 size={18} /></button></div></Td>
            </tr>
          ))}
          {list.length === 0 && <tr><Td className="py-12 text-center text-muted">No customers found.</Td></tr>}
        </tbody>
      </TableWrap>
      <p className="mt-4 text-[13px] text-muted">Customers are saved automatically when someone orders or reserves. Staff can edit details here.</p>

      <Modal open={Boolean(edit)} onClose={() => setEdit(null)} title="Edit customer">
        {edit && (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); save(); }}>
            <Field label="Name"><Input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} required /></Field>
            <Field label="Phone"><Input value={edit.phone} onChange={(e) => setEdit({ ...edit, phone: e.target.value })} required /></Field>
            <Field label="Address"><Input value={edit.address} onChange={(e) => setEdit({ ...edit, address: e.target.value })} /></Field>
            <Field label="Email"><Input type="email" value={edit.email ?? ""} onChange={(e) => setEdit({ ...edit, email: e.target.value })} /></Field>
            <Button type="submit" size="lg" className="w-full">Save customer</Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
