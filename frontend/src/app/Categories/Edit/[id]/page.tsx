"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function EditCategoryPage() {
    const params = useParams();
    const router = useRouter();

    // Safely cast dynamic parameter IDs depending on the dynamic route layout structure [...id] vs [id]
    const id = params?.id;

    const [categoryName, setCategoryName] = useState("");
    const [description, setDescription] = useState("");

    const [picturePreview, setPicturePreview] = useState("");
    const [pictureBase64, setPictureBase64] = useState("");

    useEffect(() => {
        if (id) {
            loadCategory();
        }
    }, [id]);

    const loadCategory = async () => {
        try {
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
                throw new Error(`Failed to fetch category definitions: ${response.status}`);
            }

            const category = await response.json();

            setCategoryName(category.CategoryName || "");
            setDescription(category.Description || "");

            if (category.PictureBase64) {
                setPictureBase64(category.PictureBase64);
                setPicturePreview(`data:image/bmp;base64,${category.PictureBase64}`);
            }
        } catch (error) {
            console.error("Error updating structure configuration data setup state mapping:", error);
        }
    };

    const handlePictureChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result as string;
            setPicturePreview(result);

            const base64 = result.split(",")[1];
            setPictureBase64(base64);
        };

        reader.readAsDataURL(file);
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

        const response = await fetch(
            `/api/categories/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    CategoryName: categoryName,
                    Description: description,
                    Picture: pictureBase64
                })
            }
        );

        if (response.ok) {
            router.push("/Categories");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">
                Edit Category
            </h1>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                        <label className="block mb-1 font-medium">
                            Category Name
                        </label>

                        <input
                            type="text"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            Description
                        </label>

                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block mb-2 font-medium">
                            Picture
                        </label>

                        {picturePreview && (
                            <div className="mb-3">
                                <img
                                    src={picturePreview}
                                    alt="Preview"
                                    className="h-32 w-32 object-cover rounded border"
                                />
                            </div>
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePictureChange}
                            className="block w-full text-sm text-gray-700
                            file:mr-4 file:px-4 file:py-2
                            file:bg-gray-300 file:text-gray-800
                            file:border file:border-gray-400
                            file:rounded file:cursor-pointer"
                        />
                    </div>
                </div>

                <div className="mt-8 flex gap-3 items-center">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Save
                    </button>

                    <Link
                        href="/Categories"
                        className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50 transition"
                    >
                        Back To List
                    </Link>
                </div>
            </form>
        </div>
    );
}
