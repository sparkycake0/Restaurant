"use client";
import { TableWrap, Td, Th } from "@/components/admin-shared";
import { Pill } from "@/components/ui";
import { staff } from "@/data/staff";
import { timeAgo } from "@/lib/utils";

// SAMPLE DATA: `staff` comes from /data.
// TODO(api): load staff from your server with useQuery.
export default function StaffPage() {
  return (
    <TableWrap>
      <thead>
        <tr><Th>Name</Th><Th>Username</Th><Th>Role</Th><Th>Status</Th><Th>Last login</Th></tr>
      </thead>
      <tbody>
        {staff.map((s) => (
          <tr key={s.id}>
            <Td className="font-semibold">{s.name}</Td>
            <Td>{s.username}</Td>
            <Td><Pill kind={s.role}>{s.role}</Pill></Td>
            <Td><Pill kind={s.active ? "green" : "red"}>{s.active ? "Active" : "Disabled"}</Pill></Td>
            <Td className="text-muted">{timeAgo(s.lastLogin)}</Td>
          </tr>
        ))}
      </tbody>
    </TableWrap>
  );
}
