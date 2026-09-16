import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IeraTrip",
  description:
    "Tourism site για την Ιεράπετρα με προορισμούς, εμπειρίες, χάρτη και στοιχεία επικοινωνίας.",
  icons: {
    icon: "/images/ieratrip-icon.svg",
  },
  openGraph: {
    title: "IeraTrip",
    description:
      "Ανακαλύψτε την Ιεράπετρα μέσα από ένα travel website.",
    locale: "el_GR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el">
      <body>{children}</body>
    </html>
  );
}
