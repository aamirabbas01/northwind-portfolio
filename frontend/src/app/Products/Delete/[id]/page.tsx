"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function DeleteProductPage() {
    const router = useRouter();
    const params = useParams();

    const id = params.id;

    const [product, setProduct] = useState<any>(null);

    useEffect(() => {
        loadProduct();
    }, []);

    const loadProduct = async () => {
        try {
            const response = await fetch(
                `/api/products/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            const data = await response.json();
            setProduct(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `/api/products/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.ok) {
                alert("Product deleted successfully");
                router.push("/Products");
            } else {
                alert("Failed to delete product");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        }
    };

    if (!product) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-6">
                Delete Product
            </h1>

            <div className="bg-red-50 border border-red-300 p-4 rounded mb-6">
                Are you sure you want to delete this
                product?
            </div>

            <div className="grid grid-cols-2 gap-4">

                <div>
                    <strong>Product Name</strong>
                </div>
                <div>{product.ProductName}</div>

                <div>
                    <strong>Category</strong>
                </div>
                <div>{product.CategoryName}</div>

                <div>
                    <strong>Supplier</strong>
                </div>
                <div>{product.CompanyName}</div>

                <div>
                    <strong>Unit Price</strong>
                </div>
                <div>{product.UnitPrice}</div>
            </div>

            <div className="mt-6 flex gap-2">

                <button
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                    Delete
                </button>

                <button
                    onClick={() =>
                        router.push("/Products")
                    }
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                >
                    Back to List
                </button>

            </div>
        </div>
    );
}