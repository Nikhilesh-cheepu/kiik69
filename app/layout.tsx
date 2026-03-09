import type { Metadata } from "next";
import { Bebas_Neue, Syne } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "SkyHy Live Sports Brewery | Live Sports, Bowling, Food & Drinks in Gachibowli",
  description:
    "SkyHy Live Sports Brewery — live sports, bowling, gourmet food, craft drinks, and parties in Gachibowli, Hyderabad. Formerly known as KIIK 69 Sports Bar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bebasNeue.variable} ${syne.variable} antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}
