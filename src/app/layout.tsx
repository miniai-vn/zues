import { Toaster } from "@/components/ui/toaster";
import TanStackProviders from "@/providers/TanStackProvicers";
import I18nProvider from "@/providers/I18nProvider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "mi9.io",
  description: "AI-powered startup solutions and innovation platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <TanStackProviders>
        <I18nProvider>
          <body className={`antialiased`}>
            {children}
            <Toaster />
          </body>
        </I18nProvider>
      </TanStackProviders>
    </html>
  );
}
