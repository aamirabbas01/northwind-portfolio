"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
    const [mounted, setMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [user, setUser] = useState({
        username: "",
        profilePicture: "",
    });

    useEffect(() => {
        setMounted(true);

        setUser({
            username: localStorage.getItem("username") || "",
            profilePicture: localStorage.getItem("profilePicture") || "",
        });
    }, []);

    const profilePicture = useMemo(() => {
        const pic = user.profilePicture;

        if (!pic) return "";

        if (pic.startsWith("data:")) {
            return pic;
        }

        if (pic.length > 100) {
            return pic.substring(0, 20).includes("Qk0")
                ? `data:image/bmp;base64,${pic}`
                : `data:image/jpeg;base64,${pic}`;
        }

        return pic;
    }, [user.profilePicture]);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("profilePicture");

        document.cookie =
            "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

        window.location.href = "/";
    };

    const navLinks = [
        {
            href: "/",
            label: "Home",
        },
        {
            href: "/privacy",
            label: "Privacy",
        },
        ...(user.username
            ? [
                {
                    href: "/Dashboard",
                    label: "Dashboard",
                },
            ]
            : []),
    ];

    if (!mounted) {
        return (
            <header className="h-16 border-b border-slate-200 bg-white" />
        );
    }

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
            <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Left */}
                <div className="flex items-center gap-8">
                    <Link
                        href="/"
                        className="text-xl font-bold text-slate-900 sm:text-2xl"
                    >
                        NorthWind
                    </Link>

                    <div className="hidden md:flex items-center gap-5 text-slate-600">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="transition hover:text-blue-700"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Center Title */}
                <h1 className="absolute left-1/2 hidden -translate-x-1/2 text-lg font-medium text-slate-800 lg:block">
                    Welcome to Our Company Website!
                </h1>

                {/* Right */}
                <div className="flex items-center gap-3">
                    {/* Desktop User Section */}
                    <div className="hidden md:flex items-center">
                        {user.username ? (
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                                    {profilePicture ? (
                                        <img
                                            src={profilePicture}
                                            alt="Profile"
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = "/images/default-avatar.png";
                                            }}
                                        />
                                    ) : (
                                        <span className="text-sm font-bold uppercase text-slate-500">
                                            {user.username.charAt(0)}
                                        </span>
                                    )}
                                </div>

                                <span className="font-medium text-slate-800">
                                    {user.username}
                                </span>

                                <button
                                    onClick={logout}
                                    className="ml-2 border-l border-slate-300 pl-3 text-sm text-slate-500 transition hover:text-red-600"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/Register"
                                    className="text-slate-600 transition hover:text-blue-700"
                                >
                                    Register
                                </Link>

                                <Link
                                    href="/login"
                                    className="text-slate-600 transition hover:text-blue-700"
                                >
                                    Login
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        aria-expanded={isMenuOpen}
                        aria-label="Toggle menu"
                        className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 md:hidden"
                    >
                        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div
                className={`overflow-hidden transition-all duration-300 md:hidden ${isMenuOpen ? "max-h-screen" : "max-h-0"
                    }`}
            >
                <div className="border-t border-slate-200 bg-white px-4 py-5">
                    <h2 className="mb-5 text-center text-lg font-medium text-slate-800">
                        Welcome to Our Company Website!
                    </h2>

                    <div className="flex flex-col gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="rounded-md px-2 py-2 text-slate-700 transition hover:bg-slate-50 hover:text-blue-700"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-5 border-t border-slate-200 pt-5">
                        {user.username ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                                        {profilePicture ? (
                                            <img
                                                src={profilePicture}
                                                alt="Profile"
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.src = "/default-avatar.png";
                                                }}
                                            />
                                        ) : (
                                            <span className="text-sm font-bold uppercase text-slate-500">
                                                {user.username.charAt(0)}
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Signed in as
                                        </p>
                                        <p className="font-semibold text-slate-800">
                                            {user.username}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        logout();
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full rounded-md bg-red-50 py-2.5 text-red-600 transition hover:bg-red-100"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/Register"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="rounded-md border py-2 text-center hover:bg-slate-50"
                                >
                                    Register
                                </Link>

                                <Link
                                    href="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="rounded-md border py-2 text-center hover:bg-slate-50"
                                >
                                    Login
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}