import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NORTHWIND | Register",
  description: "Create a new account to continue",
};

export default function RootLayout({ children }: LayoutProps<"/login">) {
  return (

    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >

      <body className="min-h-full flex flex-col">
        <nav
          aria-label="Main navigation"
          className="grid min-h-[88px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-4 max-lg:grid-cols-[1fr_auto] bg-slate-100 dark:bg-slate-900 px-4"
        >
          <div className="flex items-center gap-7">
            <Link href="/" className="whitespace-nowrap text-2xl">
              NorthWind
            </Link>
            <div className="hidden items-center gap-5 text-lg sm:flex">
              <Link href="/" className="hover:text-blue-700">
                Home
              </Link>

            </div>
          </div>

          <h1 className="text-center text-4xl font-medium max-lg:col-span-2 max-lg:col-start-1 max-lg:row-start-2 max-lg:text-2xl">
            Welcome to Our Company Website!
          </h1>

          <div className="flex justify-self-end gap-5 text-lg">
            <Link href="/login" className="hover:text-blue-700">
              Login
            </Link>

          </div>
        </nav>
        {children}</body>
    </html>
  );
}
