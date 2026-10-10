'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Users, Briefcase, ShoppingCart, BarChart3,
    ChevronDown, ChevronRight, LayoutDashboard, UserCheck
} from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
        hr: true, // Opened by default to match your AdminLTE layout
    });

    const [userData, setUserData] = useState<{ username: string; profilePicture: string }>({
        username: 'Guest Session',
        profilePicture: ''
    });

    useEffect(() => {
        // ✅ Read directly from local storage key entries safely in the browser context
        if (typeof window !== 'undefined') {
            const storedName = localStorage.getItem('username');
            const storedPic = localStorage.getItem('profilePicture');
            const token = localStorage.getItem('token');

            if (token && storedName) {
                setUserData({
                    username: storedName,
                    profilePicture: storedPic || ''
                });
            }
        }
    }, []);



    const toggleMenu = (menu: string) => {
        setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
    };

    const isActivePath = (href: string) =>
        pathname === href || pathname.startsWith(`${href}/`);

    const getLinkClassName = (href: string, baseClassName: string) =>
        `${baseClassName} ${isActivePath(href)
            ? 'bg-blue-600 text-white shadow-sm'
            : 'hover:bg-[#494e54] hover:text-white'
        }`;

    const handleLogout = () => {
        // 1. Clear all profile elements from local storage
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('profilePicture');

        // 2. CLEAR THE COOKIE: Set its expiration date to a past date (max-age=0)
        // This tells the browser to destroy the cookie instantly
        document.cookie = "token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;";

        console.log("Session destroyed locally and on server layout headers.");

        // 3. FORCE REDIRECT: Redirect to the login screen
        // This causes the browser to reload, alerting the middleware to lock the page instantly
        window.location.replace('/login');
    };


    return (
        <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col bg-[#343a40] text-[#c2c7d0] shadow-xl">
            {/* Brand Logo */}
            <div className="flex h-14 items-center border-b border-[#4b545c] px-4">
                <Link href="/Dashboard" className="flex items-center gap-2 text-xl font-light text-white hover:opacity-90">
                    <span className="font-semibold">NorthWind</span>
                </Link>
            </div>

            {/* Dynamic User Profile Picture & Name Block */}
            <div className="flex items-center gap-3 border-b border-[#4b545c] px-4 py-3">
                {userData.profilePicture ? (
                    <img
                        src={userData.profilePicture}
                        alt="User Profile"
                        className="h-10 w-10 object-cover rounded-full border border-[#4b545c]"
                        style={{ minWidth: '40px', minHeight: '40px' }}
                    />
                ) : (
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm min-h-10 min-w-10 select-none">
                        {userData.username.substring(0, 2).toUpperCase()}
                    </div>
                )}

                <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-medium text-white truncate">
                        {userData.username}
                    </span>
                    <span className="text-xs text-green-400 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"></span> Online
                    </span>
                </div>
            </div>

            <div className="flex justify-center items-center border-b border-[#4b545c] px-4 py-3">
                <button
                    className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-2 py-3 text-sm">
                <ul className="space-y-1">
                    {/* Dashboard Main Link */}
                    <li>
                        <Link
                            href="/Dashboard"
                            aria-current={pathname === '/Dashboard' ? 'page' : undefined}
                            className={`flex items-center gap-3 rounded px-3 py-2 transition ${pathname === '/Dashboard'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'hover:bg-[#494e54] hover:text-white'
                                }`}
                        >
                            <LayoutDashboard size={18} />
                            <span>Dashboard</span>
                        </Link>
                    </li>

                    {/* HR Dropdown */}
                    <li>
                        <button
                            onClick={() => toggleMenu('hr')}
                            aria-expanded={openMenus.hr}
                            className={`flex w-full items-center justify-between rounded px-3 py-2 transition text-left ${isActivePath('/Employees') || isActivePath('/Customers')
                                    ? 'bg-[#494e54] text-white'
                                    : 'hover:bg-[#494e54] hover:text-white'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Users size={18} />
                                <span>HR</span>
                            </div>
                            {openMenus.hr ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                        {openMenus.hr && (
                            <ul className="mt-1 space-y-1 pl-6">
                                <li>
                                    <Link
                                        href="/Employees"
                                        aria-current={isActivePath('/Employees') ? 'page' : undefined}
                                        className={getLinkClassName('/Employees', 'flex items-center gap-2 rounded px-3 py-1.5 text-xs transition')}
                                    >
                                        <UserCheck size={14} />
                                        <span>Employees</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/Customers"
                                        aria-current={isActivePath('/Customers') ? 'page' : undefined}
                                        className={getLinkClassName('/Customers', 'flex items-center gap-2 rounded px-3 py-1.5 text-xs transition')}
                                    >
                                        <Users size={14} />
                                        <span>Customers</span>
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* Business Dropdown */}
                    <li>
                        <button
                            onClick={() => toggleMenu('business')}
                            aria-expanded={openMenus.business}
                            className={`flex w-full items-center justify-between rounded px-3 py-2 transition text-left ${isActivePath('/Dashboard/business')
                                    ? 'bg-[#494e54] text-white'
                                    : 'hover:bg-[#494e54] hover:text-white'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Briefcase size={18} />
                                <span>Business</span>
                            </div>
                            {openMenus.business ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                        {openMenus.business && (
                            <ul className="mt-1 space-y-1 pl-6">
                                <li><Link href="/Products" aria-current={isActivePath('/Products') ? 'page' : undefined} className={getLinkClassName('/Products', 'block rounded px-3 py-1.5 text-xs transition')}>Products</Link></li>
                                <li><Link href="/Suppliers" aria-current={isActivePath('/Suppliers') ? 'page' : undefined} className={getLinkClassName('/Suppliers', 'block rounded px-3 py-1.5 text-xs transition')}>Suppliers</Link></li>
                                <li><Link href="/Categories" aria-current={isActivePath('/Categories') ? 'page' : undefined} className={getLinkClassName('/Categories', 'block rounded px-3 py-1.5 text-xs transition')}>Categories</Link></li>
                            </ul>
                        )}
                    </li>

                    {/* Orders Dropdown */}
                    <li>
                        <button
                            onClick={() => toggleMenu('orders')}
                            aria-expanded={openMenus.orders}
                            className={`flex w-full items-center justify-between rounded px-3 py-2 transition text-left ${isActivePath('/Dashboard/orders')
                                    ? 'bg-[#494e54] text-white'
                                    : 'hover:bg-[#494e54] hover:text-white'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <ShoppingCart size={18} />
                                <span>Orders</span>
                            </div>
                            {openMenus.orders ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                        {openMenus.orders && (
                            <ul className="mt-1 space-y-1 pl-6">
                                <li><Link href="/Dashboard/orders/all" aria-current={isActivePath('/Dashboard/orders/all') ? 'page' : undefined} className={getLinkClassName('/Dashboard/orders/all', 'block rounded px-3 py-1.5 text-xs transition')}>Manage Orders</Link></li>
                                <li><Link href="/Dashboard/orders/shippers" aria-current={isActivePath('/Dashboard/orders/shippers') ? 'page' : undefined} className={getLinkClassName('/Dashboard/orders/shippers', 'block rounded px-3 py-1.5 text-xs transition')}>Shippers</Link></li>
                            </ul>
                        )}
                    </li>

                    {/* Reports Dropdown */}
                    <li>
                        <button
                            onClick={() => toggleMenu('reports')}
                            aria-expanded={openMenus.reports}
                            className={`flex w-full items-center justify-between rounded px-3 py-2 transition text-left ${isActivePath('/Dashboard/reports')
                                    ? 'bg-[#494e54] text-white'
                                    : 'hover:bg-[#494e54] hover:text-white'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <BarChart3 size={18} />
                                <span>Reports</span>
                            </div>
                            {openMenus.reports ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                    </li>


                </ul>
            </nav>
        </aside >
    );
}
