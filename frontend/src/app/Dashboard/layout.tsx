import Sidebar from '../components/sidebarNav';
import '../globals.css';

export const metadata = {
    title: 'Northwind Admin Dashboard',
    description: 'AdminLTE-style Next.js management system framework',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="bg-[#f4f6f9] antialiased">
                <div className="relative min-h-screen">
                    {/* AdminLTE Dark Side Navigation Menu */}
                    <Sidebar />

                    {/* Main Mainframe Stage */}
                    <div className="pl-64">
                        {/* Minimal Global Utility Topbar */}

                        <main>{children}</main>
                    </div>
                </div>
            </body>
        </html>
    );
}
