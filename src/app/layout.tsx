import type { Metadata } from "next";

import { RoomProvider } from "@/context/roomContext";
import { Konkhmer_Sleokchher } from "next/font/google";
import NavComponent from "@/components/nav";
import FooterComponent from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { DateProvider } from "../context/dateContext";

const konkhmer_Sleokchher = Konkhmer_Sleokchher({
  weight: "400",
  style: ["normal"],
  subsets: ["latin"],
  display: "block",
});

export const metadata: Metadata = {
  title: "SIT Booking System",
  description: "SIT Booking System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`relative ${konkhmer_Sleokchher.className} antialiased h-screen`}
      >
        <RoomProvider>
          <DateProvider>
            <NavComponent />
            {children}
            <Toaster />
            <FooterComponent />
          </DateProvider>
        </RoomProvider>
      </body>
    </html>
  );
}
