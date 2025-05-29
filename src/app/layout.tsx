import { Toaster } from "@/components/ui/toaster";
import TanStackProviders from "@/providers/TanStackProvicers";
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
        <body
          className={`antialiased`}
        >
          {children}
          <Toaster />
        </body>
      </TanStackProviders>
    </html>
  );
}
