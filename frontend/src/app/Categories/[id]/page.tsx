"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Category {
    CategoryID: number;
    CategoryName: string;
    Description: string;
    PictureBase64?: string;
}

export default function CategoryDetailsPage() {
    const params = useParams();
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
            // Guard against server-side rendering execution crashes
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
                throw new Error(`Server returned status code: ${response.status}`);
            }

            const data = await response.json();
            setCategory(data);
        } catch (error) {
            console.error("Error retrieving individual database category document:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-6 text-center text-gray-500">Loading category specifications...</div>;
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
            {/* Header section */}
            <h1 className="text-3xl font-bold mb-6">
                Category Details
            </h1>

            {/* Information Card Container */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Text Field Layout Columns */}
                    <div className="space-y-6">
                        <div>
                            <label className="text-xs uppercase tracking-wider text-gray-400 font-bold block mb-1">
                                Category Name
                            </label>
                            <div className="text-xl font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded p-3">
                                {category.CategoryName}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs uppercase tracking-wider text-gray-400 font-bold block mb-1">
                                Description
                            </label>
                            <div className="text-base text-gray-700 bg-gray-50 border border-gray-200 rounded p-3 min-h-[100px] whitespace-pre-wrap">
                                {category.Description || <span className="text-gray-400 italic">No description provided</span>}
                            </div>
                        </div>
                    </div>

                    {/* Binary Picture Data Asset Column */}
                    <div className="flex flex-col justify-start">
                        <label className="text-xs uppercase tracking-wider text-gray-400 font-bold block mb-2">
                            Category Picture
                        </label>
                        <div className="border border-gray-200 rounded-lg bg-gray-50 p-4 flex items-center justify-center max-w-sm h-64 overflow-hidden">
                            {category.PictureBase64 ? (
                                <img
                                    src={`data:image/bmp;base64,${category.PictureBase64}`}
                                    alt={category.CategoryName}
                                    className="max-h-full max-w-full object-contain rounded"
                                />
                            ) : (
                                <div className="text-center text-gray-400">
                                    <span className="block text-3xl mb-2">🖼️</span>
                                    <span className="text-sm">No Picture Asset Uploaded</span>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Dashboard Operations Panel Controls */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex gap-3">
                    <Link
                        href={`/Categories/Edit/${category.CategoryID}`}
                        className="px-5 py-2.5 bg-blue-600 text-white font-medium text-sm rounded-md shadow-sm hover:bg-blue-700 transition"
                    >
                        Edit Details
                    </Link>

                    <Link
                        href="/Categories"
                        className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium text-sm rounded-md shadow-sm hover:bg-gray-50 transition"
                    >
                        Back To List
                    </Link>
                </div>
            </div>
        </div>
    );
}
