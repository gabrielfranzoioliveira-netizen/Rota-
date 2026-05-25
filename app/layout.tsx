import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { MobileDeviceShell } from "@/components/mobile-device-shell";

export const metadata: Metadata = {
  title: "Rota+ | Mobilidade acessivel para todos",
  description:
    "Transporte sob demanda desenvolvido para cadeirantes e pessoas com mobilidade reduzida.",
  icons: {
    icon: "/rota-plus-logo.jpeg",
    apple: "/rota-plus-logo.jpeg"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <MobileDeviceShell>
          <Providers>{children}</Providers>
        </MobileDeviceShell>
      </body>
    </html>
  );
}
