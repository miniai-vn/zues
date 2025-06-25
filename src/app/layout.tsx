import { Toaster } from "@/components/ui/toaster";
import TanStackProviders from "@/providers/TanStackProvicers";
import I18nProvider from "@/providers/I18nProvider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  icons: {
    icon: "/logowebmi9.png",
  },
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
      <body className={`antialiased`}>
        <TanStackProviders>
          <I18nProvider>
            {children}
            <Toaster />
          </I18nProvider>
        </TanStackProviders>
      </body>
    </html>
  );
}
