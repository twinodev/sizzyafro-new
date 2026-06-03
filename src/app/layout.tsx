import React from "react";
import type { Metadata } from "next";
import "../index.css";

export const metadata: Metadata = {
  title: "Dance With Sizzy Afro | Elite Street Dance Foundation",
  description: "Elite Street Dance Foundation in Mbarara, Uganda. Nurturing street dance talent, youth empowerment, events, and cultural fusion.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
