import type { Metadata } from "next";
import { NextAuthProvider } from "./providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "map",
  description: "a multiplayer map",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          <div>{children}</div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
