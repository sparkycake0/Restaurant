"use client";
import { TableWrap, Td, Th } from "@/components/admin-shared";
import { customers } from "@/data/customers";
import { timeAgo } from "@/lib/utils";

// SAMPLE DATA: `customers` comes from /data.
// TODO(api): load customers from your server with useQuery.
export default function CustomersPage() {
  return (
    <TableWrap>
      <thead>
        <tr><Th>Name</Th><Th>Phone</Th><Th>Address</Th><Th>Orders</Th><Th>Last order</Th></tr>
      </thead>
      <tbody>
        {customers.map((c) => (
          <tr key={c.id}>
            <Td className="font-semibold">{c.name}</Td>
            <Td>{c.phone}</Td>
            <Td>{c.address}</Td>
            <Td>{c.ordersCount}</Td>
            <Td className="text-muted">{timeAgo(c.lastOrderAt)}</Td>
          </tr>
        ))}
      </tbody>
    </TableWrap>
  );
}
