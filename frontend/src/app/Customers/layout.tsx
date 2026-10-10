import React from "react";
import SidebarNav from "../components/sidebarNav";
import "../globals.css";
import Link from "next/dist/client/link";

export const metadata = {
    title: 'Northwind Customers',
    description: 'AdminLTE-style Next.js management system framework',
};

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <div className="flex min-h-screen bg-[#f4f6f9] text-[#212529]">
                    <aside className="w-64 bg-[#343a40] text-[#c2c7d0] flex-shrink-0 hidden md:block">
                        <div className="p-4 border-b border-gray-700">
                            <span className="text-xl font-bold text-white">
                                Northwind Employees
                            </span>
                        </div>

                        <div className="py-2">
                            <SidebarNav />
                        </div>
                    </aside>

                    <div className="flex-1 flex flex-col">
                        <header className="h-14 bg-white border-b border-[#dee2e6] flex items-center justify-between px-6">
                            <div> <Link href="/">Home</Link> </div>

                        </header>

                        <main className="flex-1 overflow-y-auto p-6">
                            {children}
                        </main>
                    </div>
                </div>
            </body>
        </html>
    );
}