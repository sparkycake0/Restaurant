"use client";
import { Plus } from "lucide-react";
import { useState } from "react";
import { PageBar, TableWrap, Td, Th } from "@/components/admin-shared";
import { Modal } from "@/components/modal";
import { Button, Field, Input, Pill, Select, Toggle } from "@/components/ui";
import { staff as sampleStaff } from "@/data/staff";
import type { Staff } from "@/data/types";
import { useToast } from "@/lib/toast";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { initials, timeAgo, uid } from "@/lib/utils";

const randomPassword = () => Array.from({ length: 3 }, () => Math.random().toString(36).slice(2, 5)).join("-");

export default function StaffPage() {
  const toast = useToast();
  const [staff, setStaff] = useLocalStorage<Staff[]>("staff", sampleStaff);
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", username: "", password: "", role: "staff" as Staff["role"], mustChange: true });

  // TODO: send the new account to your backend (it should hash the password).
  function create() {
    setStaff((all) => [...all, { id: uid(), name: f.name, username: f.username, role: f.role, active: true, lastLogin: 0 }]);
    toast(`Account created. Temporary password: ${f.password}`);
    setOpen(false);
  }
  const setActive = (id: string, active: boolean) => setStaff((all) => all.map((s) => (s.id === id ? { ...s, active } : s)));

  return (
    <div>
      <PageBar><span className="flex-1" /><Button variant="gold" onClick={() => { setF({ name: "", username: "", password: randomPassword(), role: "staff", mustChange: true }); setOpen(true); }}><Plus size={16} />Add staff</Button></PageBar>
      <TableWrap min={680}>
        <thead><tr><Th>Staff member</Th><Th>Role</Th><Th>Active</Th><Th>Last login</Th></tr></thead>
        <tbody>
          {staff.map((s) => (
            <tr key={s.id} className="hover:bg-white/[0.03]">
              <Td><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-gold text-sm font-bold text-ink">{initials(s.name)}</span><div><p className="font-bold text-cream">{s.name}</p><p className="text-xs text-muted">@{s.username}</p></div></div></Td>
              <Td><Pill kind={s.role}>{s.role === "admin" ? "Admin" : "Staff"}</Pill></Td>
              <Td><Toggle on={s.active} label={`${s.name} active`} onChange={(v) => setActive(s.id, v)} /></Td>
              <Td className="text-muted">{s.lastLogin ? timeAgo(s.lastLogin) : "Never"}</Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
      <p className="mt-4 text-[13px] text-muted">Inactive staff cannot sign in, but their past orders stay on record.</p>

      <Modal open={open} onClose={() => setOpen(false)} title="Add staff member" side>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); create(); }}>
          <p className="-mt-3 text-sm text-muted">Only admins can create accounts.</p>
          <Field label="Full name"><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required /></Field>
          <Field label="Username"><Input value={f.username} onChange={(e) => setF({ ...f, username: e.target.value.toLowerCase().replace(/\s/g, "") })} required autoCapitalize="none" /></Field>
          <div className="flex items-end gap-2"><Field label="Temporary password" className="flex-1"><Input value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} required minLength={6} /></Field><Button type="button" variant="subtle" onClick={() => setF({ ...f, password: randomPassword() })}>Generate</Button></div>
          <Field label="Role"><Select value={f.role} onChange={(e) => setF({ ...f, role: e.target.value as Staff["role"] })}><option value="staff">Staff</option><option value="admin">Admin</option></Select></Field>
          <label className="flex items-center gap-3 text-sm font-medium"><input type="checkbox" checked={f.mustChange} onChange={(e) => setF({ ...f, mustChange: e.target.checked })} className="h-5 w-5 accent-[#2c6653]" />Must change password at first login</label>
          <Button type="submit" size="lg" className="w-full">Create account</Button>
          <Button type="button" variant="light" className="w-full" onClick={() => setOpen(false)}>Cancel</Button>
        </form>
      </Modal>
    </div>
  );
}
