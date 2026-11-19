import "@/styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MedExpert – Home Medicine Manager",
  description: "A caring home medicine manager for India. Hindi & English.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
