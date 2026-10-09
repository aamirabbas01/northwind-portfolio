import type { Metadata } from "next";
import Link from "next/link";
import "../globals.css";
import Header from "../components/header";

export const metadata: Metadata = {
    title: "NorthWind",
    description:
        "Northwind is a fictional company often used as a sample database for learning SQL, data modeling, and application development.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body
                className="min-h-screen bg-white text-slate-900"
                style={{ backgroundColor: "#ffffff", color: "#171717" }}
            >
                <Header />

                <main>{children}</main>

                <footer className="mt-12 border-t border-slate-200 bg-slate-50">
                    <div className="container mx-auto px-6 py-4 text-center text-sm text-gray-500">
                        © 2025 - NorthWindMVC - Privacy
                    </div>
                </footer>
            </body>
        </html>
    );
}