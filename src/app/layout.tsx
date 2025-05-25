import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Feed Pet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={"antialiased"} suppressHydrationWarning>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
