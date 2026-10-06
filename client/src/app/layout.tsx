import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource/playfair-display/700.css";
import "./globals.css";
import { ToastProvider } from "@/lib/toast";
import { Providers } from "@/components/Provider";

export const metadata: Metadata = {
  title: { default: "Your Restaurant", template: "%s | Your Restaurant" },
  description:
    "Seasonal cooking for your table, your doorstep and your biggest celebrations. Dine in, order delivery or plan catering.",
};
export const viewport: Viewport = {
  themeColor: "#0e1714",
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ToastProvider>
            {children}
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
