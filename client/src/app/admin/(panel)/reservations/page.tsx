"use client";
import { ResStatusPill, TableWrap, Td, Th, PageBar } from "@/components/admin-shared";
import { ButtonLink } from "@/components/ui";
import { reservations } from "@/data/reservations";
import { fmtDate } from "@/lib/utils";

// SAMPLE DATA: `reservations` comes from /data.
// TODO(api): load reservations from your server with useQuery.
export default function ReservationsPage() {
  return (
    <>
      <PageBar>
        <ButtonLink href="/admin/reservations/new" variant="gold" size="sm">+ New reservation</ButtonLink>
      </PageBar>
      <TableWrap>
        <thead>
          <tr><Th>Date</Th><Th>Time</Th><Th>Name</Th><Th>Event</Th><Th>Guests</Th><Th>Phone</Th><Th>Status</Th></tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.id}>
              <Td>{fmtDate(r.date)}</Td>
              <Td>{r.time}</Td>
              <Td className="font-semibold">{r.customerName}</Td>
              <Td>{r.eventType}</Td>
              <Td>{r.guests}</Td>
              <Td>{r.phone}</Td>
              <Td><ResStatusPill status={r.status} /></Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
    </>
  );
}
