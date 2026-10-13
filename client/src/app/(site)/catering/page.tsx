import type { Metadata } from "next";
import { CateringForm } from "@/components/catering-form";
import { Container, PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui";

export const metadata: Metadata = { title: "Catering" };

export default function CateringPage() {
  return (
    <>
      <PageHeader title="Catering & events" sub="Birthdays, weddings, business lunches - tell us about your event." />
      <Container className="py-12 sm:py-16">
        <Card className="p-6 sm:p-8">
          <CateringForm />
        </Card>
      </Container>
    </>
  );
}
