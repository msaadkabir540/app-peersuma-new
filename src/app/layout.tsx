import React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { LayoutProvider } from "../components/layout-provider/layout-provider";

import { ContextCollection } from "../(context)/context-collection";

import "./globals.css";
import "react-datepicker/dist/react-datepicker.css";

export const metadata: Metadata = {
  title: "Peersuma",
  description: "Peersuma",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: {
      url: "/favicon.ico",
      type: "image/ico",
    },
    shortcut: { url: "/favicon.ico", type: "image/ico" },
  },
};

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{ background: "#F2F2F2" }}
        className={poppins.className}
        suppressHydrationWarning={true}
      >
        <ContextCollection>
          <LayoutProvider>{children}</LayoutProvider>
        </ContextCollection>
      </body>
    </html>
  );
}
