import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./styles/globals.css";
import AntdProvider from "./components/layout/AntdProvider";
import ReduxProvider from "./components/layout/ReduxProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Interactive Data Viewer",
  description: "Uncountable Frontend Assignment - Interactive Data Visualization Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <AntdProvider>
            {children}
          </AntdProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
