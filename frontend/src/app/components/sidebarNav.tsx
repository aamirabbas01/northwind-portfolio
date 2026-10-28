"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Users,
    Briefcase,
    BarChart3,
    ChevronDown,
    ChevronRight,
    LayoutDashboard,
    UserCheck,
    Truck,
    Menu,
    X
} from "lucide-react";

const subscribeToStorage = (onStoreChange: () => void) => {
    window.addEventListener("storage", onStoreChange);
    return () => window.removeEventListener("storage", onStoreChange);
};

const getUsernameSnapshot = () =>
    window.localStorage.getItem("token")
        ? window.localStorage.getItem("username") || "Guest Session"
        : "Guest Session";

const getProfilePictureSnapshot = () =>
    window.localStorage.getItem("token")
        ? window.localStorage.getItem("profilePicture") || ""
        : "";

const getServerUsernameSnapshot = () => "Guest Session";
const getServerProfilePictureSnapshot = () => "";

export default function Sidebar() {
    const pathname = usePathname();

    const isActivePath = (href: string) =>
        pathname === href || pathname.startsWith(`${href}/`);

    const isBusinessPath =
        isActivePath("/Products") ||
        isActivePath("/Categories");

    const isOrderPath =
        isActivePath("/Orders") ||
        isActivePath("/Shippers");

    const isReportPath =
        isActivePath("/Report");

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const [collapsed, setCollapsed] =
        useState(false);

    useEffect(() => {
        document.documentElement.style.setProperty(
            "--sidebar-width",
            collapsed ? "5rem" : "16rem"
        );
    }, [collapsed]);

    const [openMenus, setOpenMenus] =
        useState({
            hr: true,
            business: isBusinessPath,
            orders: isOrderPath,
            reports: isReportPath,
        });

    const username = useSyncExternalStore(
        subscribeToStorage,
        getUsernameSnapshot,
        getServerUsernameSnapshot
    );
    const profilePicture = useSyncExternalStore(
        subscribeToStorage,
        getProfilePictureSnapshot,
        getServerProfilePictureSnapshot
    );

    const toggleMenu = (
        menu: keyof typeof openMenus
    ) => {
        setOpenMenus((prev) => ({
            ...prev,
            [menu]: !prev[menu],
        }));
    };

const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("profilePicture");

    document.cookie =
        "token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT;";

    window.location.replace("/login");
};

const getLinkClassName = (
    href: string,
    base: string
) =>
    `${base} ${isActivePath(href)
        ? "bg-blue-600 text-white"
        : "hover:bg-[#494e54] hover:text-white"
    }`;

return (
    <>
        {/* Mobile Hamburger */}
        <button
            className="fixed top-4 left-4 z-50 md:hidden bg-[#343a40] text-white p-2 rounded"
            onClick={() =>
                setSidebarOpen(true)
            }
        >
            <Menu size={22} />
        </button>

        {/* Mobile Overlay */}
        {sidebarOpen && (
            <div
                className="fixed inset-0 bg-black/50 z-30 md:hidden"
                onClick={() =>
                    setSidebarOpen(false)
                }
            />
        )}

        <aside
            className={`
                fixed inset-y-0 left-0 z-40
                bg-[#343a40]
                text-[#c2c7d0]
                flex flex-col
                shadow-xl
                transition-all duration-300

                ${collapsed
                    ? "w-20"
                    : "w-64"
                }

                ${sidebarOpen
                    ? "translate-x-0"
                    : "-translate-x-full md:translate-x-0"
                }
            `}
        >
            {/* Header */}
            <div className="flex h-14 items-center justify-between border-b border-[#4b545c] px-4">
                <Link
                    href="/Dashboard"
                    className="text-white"
                >
                    {!collapsed && (
                        <span className="font-semibold text-lg">
                            NorthWind
                        </span>
                    )}
                </Link>

                <div className="flex gap-2">
                    <button
                        className="hidden md:block text-white"
                        onClick={() =>
                            setCollapsed(
                                !collapsed
                            )
                        }
                    >
                        <Menu size={18} />
                    </button>

                    <button
                        className="md:hidden text-white"
                        onClick={() =>
                            setSidebarOpen(
                                false
                            )
                        }
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* User */}
            <div className="flex items-center gap-3 border-b border-[#4b545c] p-4">
                {profilePicture ? (
                    <img
                        src={profilePicture}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                ) : (
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        {username
                            .substring(0, 2)
                            .toUpperCase()}
                    </div>
                )}

                {!collapsed && (
                    <div>
                        <div className="text-white text-sm font-medium">
                            {
                                username
                            }
                        </div>

                        <div className="text-xs text-green-400">
                            ● Online
                        </div>
                    </div>
                )}
            </div>

            {/* Logout */}
            {!collapsed && (
                <div className="p-4 border-b border-[#4b545c]">
                    <button
                        onClick={
                            handleLogout
                        }
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
                    >
                        Logout
                    </button>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-2">
                <ul className="space-y-1">

                    {/* Dashboard */}
                    <li>
                        <Link
                            href="/Dashboard"
                            className={getLinkClassName(
                                "/Dashboard",
                                "flex items-center gap-3 rounded px-3 py-2"
                            )}
                        >
                            <LayoutDashboard size={18} />

                            {!collapsed && (
                                <span>
                                    Dashboard
                                </span>
                            )}
                        </Link>
                    </li>

                    {/* HR */}
                    <li>
                        <button
                            className="flex w-full items-center justify-between rounded px-3 py-2 hover:bg-[#494e54]"
                            onClick={() =>
                                toggleMenu(
                                    "hr"
                                )
                            }
                        >
                            <div className="flex items-center gap-3">
                                <Users size={18} />
                                {!collapsed &&
                                    "HR"}
                            </div>

                            {!collapsed &&
                                (openMenus.hr ? (
                                    <ChevronDown size={14} />
                                ) : (
                                    <ChevronRight size={14} />
                                ))}
                        </button>

                        {!collapsed &&
                            openMenus.hr && (
                                <ul className="pl-6 mt-1 space-y-1">
                                    <li>
                                        <Link
                                            href="/Employees"
                                            className={getLinkClassName(
                                                "/Employees",
                                                "flex items-center gap-2 rounded px-3 py-1.5"
                                            )}
                                        >
                                            <UserCheck size={14} />
                                            Employees
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            href="/Customers"
                                            className={getLinkClassName(
                                                "/Customers",
                                                "flex items-center gap-2 rounded px-3 py-1.5"
                                            )}
                                        >
                                            <Users size={14} />
                                            Customers
                                        </Link>
                                    </li>
                                </ul>
                            )}
                    </li>

                    {/* Business */}
                    <li>
                        <button
                            className="flex w-full items-center justify-between rounded px-3 py-2 hover:bg-[#494e54]"
                            onClick={() =>
                                toggleMenu(
                                    "business"
                                )
                            }
                        >
                            <div className="flex items-center gap-3">
                                <Briefcase size={18} />
                                {!collapsed &&
                                    "Business"}
                            </div>

                            {!collapsed &&
                                (openMenus.business ? (
                                    <ChevronDown size={14} />
                                ) : (
                                    <ChevronRight size={14} />
                                ))}
                        </button>

                        {!collapsed &&
                            openMenus.business && (
                                <ul className="pl-6 mt-1 space-y-1">
                                    <li>
                                        <Link
                                            href="/Products"
                                            className={getLinkClassName(
                                                "/Products",
                                                "block rounded px-3 py-1.5"
                                            )}
                                        >
                                            Products
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            href="/Categories"
                                            className={getLinkClassName(
                                                "/Categories",
                                                "block rounded px-3 py-1.5"
                                            )}
                                        >
                                            Categories
                                        </Link>
                                    </li>
                                </ul>
                            )}
                    </li>

                    {/* Orders */}
                    <li>
                        <button
                            className="flex w-full items-center justify-between rounded px-3 py-2 hover:bg-[#494e54]"
                            onClick={() =>
                                toggleMenu(
                                    "orders"
                                )
                            }
                        >
                            <div className="flex items-center gap-3">
                                <Truck size={18} />
                                {!collapsed &&
                                    "Orders"}
                            </div>

                            {!collapsed &&
                                (openMenus.orders ? (
                                    <ChevronDown size={14} />
                                ) : (
                                    <ChevronRight size={14} />
                                ))}
                        </button>

                        {!collapsed &&
                            openMenus.orders && (
                                <ul className="pl-6 mt-1 space-y-1">
                                    <li>
                                        <Link
                                            href="/Orders"
                                            className={getLinkClassName(
                                                "/Orders",
                                                "block rounded px-3 py-1.5"
                                            )}
                                        >
                                            Manage Orders
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            href="/Shippers"
                                            className={getLinkClassName(
                                                "/Shippers",
                                                "block rounded px-3 py-1.5"
                                            )}
                                        >
                                            Shippers
                                        </Link>
                                    </li>
                                </ul>
                            )}
                    </li>

                    {/* Reports */}
                    <li>
                        <button
                            className="flex w-full items-center justify-between rounded px-3 py-2 hover:bg-[#494e54]"
                            onClick={() =>
                                toggleMenu(
                                    "reports"
                                )
                            }
                        >
                            <div className="flex items-center gap-3">
                                <BarChart3 size={18} />

                                {!collapsed &&
                                    "Reports"}
                            </div>

                            {!collapsed &&
                                (openMenus.reports ? (
                                    <ChevronDown size={14} />
                                ) : (
                                    <ChevronRight size={14} />
                                ))}
                        </button>

                        {!collapsed &&
                            openMenus.reports && (
                                <ul className="pl-6 mt-1 space-y-1">
                                    <li>
                                        <Link
                                            href="/Report/ReportSalesByCategory"
                                            className={getLinkClassName(
                                                "/Report/ReportSalesByCategory",
                                                "block rounded px-3 py-1.5"
                                            )}
                                        >
                                            Sales By
                                            Category
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            href="/Report/ReportSupplierProduct"
                                            className={getLinkClassName(
                                                "/Report/ReportSupplierProduct",
                                                "block rounded px-3 py-1.5"
                                            )}
                                        >
                                            Products By
                                            Supplier
                                        </Link>
                                    </li>
                                </ul>
                            )}
                    </li>
                </ul>
            </nav>
        </aside>
    </>
);
}
