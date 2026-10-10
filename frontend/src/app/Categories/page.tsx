"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Category {
    CategoryID: number;
    CategoryName: string;
    Description: string;
    PictureBase64?: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            // Safe check for localStorage during Next.js SSR
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

            const response = await fetch("/api/categories", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to load categories (${response.status})`);
            }

            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error(error);
            setLoadError(
                error instanceof Error ? error.message : "Failed to load categories."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold">Categories</h1>
                <Link
                    href="/Categories/Create"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Create New
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left p-3">Category Name</th>
                                <th className="text-left p-3">Description</th>
                                <th className="text-left p-3">Picture</th>
                                <th className="text-left p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="text-center p-6">
                                        Loading...
                                    </td>
                                </tr>
                            ) : loadError ? (
                                <tr>
                                    <td colSpan={4} className="text-center p-6 text-red-600">
                                        {loadError}
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category) => (
                                    <tr
                                        key={category.CategoryID}
                                        className="border-b hover:bg-gray-50"
                                    >
                                        <td className="p-3 font-medium">{category.CategoryName}</td>
                                        <td className="p-3 text-gray-600">{category.Description}</td>
                                        <td className="p-3">
                                            {category.PictureBase64 ? (
                                                <img
                                                    src={`data:image/bmp;base64,${category.PictureBase64}`}
                                                    alt={category.CategoryName}
                                                    className="h-10 w-10 object-cover rounded border"
                                                />
                                            ) : (
                                                <span className="text-gray-400">No Picture</span>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            <div className="flex gap-4 text-blue-600">
                                                <Link href={`/Categories/Edit/${category.CategoryID}`} title="Edit">
                                                    ✏️
                                                </Link>
                                                <Link href={`/Categories/${category.CategoryID}`} title="View">
                                                    👁️
                                                </Link>
                                                <Link href={`/Categories/Delete/${category.CategoryID}`} title="Delete">
                                                    🗑️
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                            {!loading && !loadError && categories.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center p-6 text-gray-500">
                                        No categories found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
