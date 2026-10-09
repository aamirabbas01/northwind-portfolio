"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';

export default function Header() {
    const [username, setUsername] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        const storedName = localStorage.getItem("username") || "";
        let storedPic = localStorage.getItem("profilePicture") || "";

        // Fix Northwind/OLE DB Base64 bitmap header padding if it exists
        if (storedPic && !storedPic.startsWith("data:") && storedPic.length > 100) {
            // If the base64 string includes an OLE package header, common in Northwind,
            // stripping the first 78 bytes (104 base64 characters) can restore the raw BMP/JPEG.
            // Adjust this substring shift if your API already cleans it up!
            if (storedPic.substring(0, 20).includes("Qk0")) {
                // Already a valid BMP string starting with 'BM' in base64 ("Qk0")
                storedPic = `data:image/bmp;base64,${storedPic}`;
            } else {
                // Try treating it as standard jpeg/png fallback asset injection
                storedPic = `data:image/jpeg;base64,${storedPic}`;
            }
        }

        setUsername(storedName);
        setProfilePicture(storedPic);
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("profilePicture");

        document.cookie =
            "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

        window.location.href = "/";
    };

    // Prevent Next.js hydration flickering from localstorage mismatches
    if (!isMounted) {
        return <header className="border-b border-slate-200 bg-white min-h-[88px]" />;
    }

    return (
        <header className="border-b border-slate-200 bg-white">
            <nav
                aria-label="Main navigation"
                className="grid min-h-[88px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 py-4 max-lg:grid-cols-[1fr_auto]"
            >
                <div className="flex items-center gap-7">
                    <Link href="/" className="whitespace-nowrap text-2xl">
                        NorthWind
                    </Link>
                    <div className="hidden items-center gap-5 text-lg sm:flex">
                        <Link href="/" className="hover:text-blue-700">
                            Home
                        </Link>
                        <Link href="/privacy" className="hover:text-blue-700">
                            Privacy
                        </Link>
                        {username && (
                            <Link href="/Dashboard" className="hover:text-blue-700">
                                Dashboard
                            </Link>
                        )}
                    </div>
                </div>

                <h1 className="text-center text-4xl font-medium max-lg:col-span-2 max-lg:col-start-1 max-lg:row-start-2 max-lg:text-2xl">
                    Welcome to Our Company Website!
                </h1>

                <div className="flex justify-self-end gap-5 text-lg">
                    {/* FIXED: Check for username only, making profilePicture optional */}
                    {username ? (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 relative bg-slate-100 rounded-full overflow-hidden flex items-center justify-center border border-slate-200">
                                {profilePicture ? (
                                    <img
                                        src={profilePicture}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            // Fallback placeholder image if base64 string is corrupted
                                            (e.target as HTMLImageElement).src = "https://unsplash.com";
                                        }}
                                    />
                                ) : (
                                    // Fallback UI text icon if user has no photo set in database
                                    <span className="text-sm font-bold text-slate-500 uppercase">
                                        {username.charAt(0)}
                                    </span>
                                )}
                            </div>
                            <span className="font-medium text-slate-800">{username}</span>
                            <button
                                onClick={logout}
                                className="hover:text-red-600 transition text-sm pl-2 border-l border-slate-300 ml-1"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link href="/Register" className="hover:text-blue-700">
                                Register
                            </Link>
                            <Link href="/login" className="hover:text-blue-700">
                                Login
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );

}
