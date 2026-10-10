"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface Category {
    CategoryID: number;
    CategoryName: string;
    Description: string;
    PictureBase64?: string;
}

export default function DeleteCategoryPage() {
    const params = useParams();
    const router = useRouter();

    const id = params?.id;

    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadCategory();
        }
    }, [id]);

    const loadCategory = async () => {
        try {
            // Guard against server-side rendering crashes during build runs
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

            const response = await fetch(
                `/api/categories/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to load targeted resource identity code: ${response.status}`);
            }

            const data = await response.json();
            setCategory(data);
        } catch (error) {
            console.error("Error fetching record data entity blueprint context mapping:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (
            !confirm(
                `Are you sure you want to delete category "${category?.CategoryName}"?`
            )
        ) {
            return;
        }

        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

            const response = await fetch(
                `/api/categories/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.ok) {
                router.push("/Categories");
            } else {
                alert("Failed to delete the chosen category record. Please check your credentials.");
            }
        } catch (error) {
            console.error("Error occurred while deleting structural configuration entry:", error);
        }
    };

    if (loading) {
        return <div className="p-6 text-center text-gray-500">Loading target details...</div>;
    }

    if (!category) {
        return (
            <div className="max-w-xl mx-auto mt-10 p-6 bg-red-50 text-red-700 border border-red-200 rounded text-center">
                <p className="font-semibold mb-4">Category not found.</p>
                <Link href="/Categories" className="text-sm underline hover:text-red-900">
                    Return to Categories List
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-4">
            <h1 className="text-3xl font-bold text-red-600 mb-6">
                Delete Category
            </h1>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <p className="text-gray-600 mb-6 font-medium">
                    ⚠️ Warning: Are you certain you wish to delete this category documentation resource record permanently?
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="font-semibold block text-sm text-gray-500 uppercase tracking-wider mb-1">
                            Category Name
                        </label>
                        <div className="text-lg font-medium text-gray-900 bg-gray-50 p-3 border rounded">
                            {category.CategoryName}
                        </div>
                    </div>

                    <div>
                        <label className="font-semibold block text-sm text-gray-500 uppercase tracking-wider mb-1">
                            Description
                        </label>
                        <div className="text-gray-700 bg-gray-50 p-3 border rounded min-h-[50px]">
                            {category.Description || <span className="text-gray-400 italic">No description given</span>}
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="font-semibold block text-sm text-gray-500 uppercase tracking-wider mb-2">
                            Picture Asset
                        </label>

                        <div className="border bg-gray-50 rounded p-4 inline-block">
                            {category.PictureBase64 ? (
                                <img
                                    src={`data:image/bmp;base64,${category.PictureBase64}`}
                                    alt={category.CategoryName}
                                    className="max-h-40 object-contain rounded"
                                />
                            ) : (
                                <span className="text-gray-400 text-sm italic">No Image Profile Loaded</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-100 flex gap-3 items-center">
                    <Link
                        href="/Categories"
                        className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50 shadow-sm transition"
                    >
                        Back To List
                    </Link>

                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded shadow-sm hover:bg-red-700 transition font-medium"
                    >
                        Confirm Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
