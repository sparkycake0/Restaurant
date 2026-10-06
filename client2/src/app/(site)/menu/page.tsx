import type { Metadata } from "next";
import { MenuBrowser } from "@/components/menu-browser";
import { Container, PageHeader } from "@/components/page-header";

export const metadata: Metadata = { title: "Menu" };

export default function MenuPage() {
  return (
    <>
      <PageHeader title="Our menu" sub="Cooked fresh every day. Tap any dish to see the details." />
      <Container className="py-10 sm:py-14"><MenuBrowser /></Container>
    </>
  );
}
