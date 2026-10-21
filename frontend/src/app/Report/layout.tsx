import React from "react";
import SidebarNav from "../components/sidebarNav";
import "../globals.css";
import Link from "next/dist/client/link";
export const metadata = {
    title: 'Northwind Reports',
    description: 'AdminLTE-style Next.js management system framework',
};

export default function ProductLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <div className="relative min-h-screen bg-[#f4f6f9] text-[#212529]">
                    <SidebarNav />
                    <div className="pl-0 transition-[padding] duration-300 md:pl-[var(--sidebar-width)]">
                        <header className="h-14 bg-white border-b border-[#dee2e6] flex items-center justify-between px-6">
                            <div> <Link href="/">Home</Link> </div>

                        </header>

                        <main className="min-h-[calc(100vh-3.5rem)] overflow-y-auto p-6">
                            {children}
                        </main>
                    </div>
                </div>
            </body>
        </html>
    );
}