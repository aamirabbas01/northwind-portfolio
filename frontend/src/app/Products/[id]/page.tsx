"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ProductDetailsPage() {
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

    if (!product) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-6">
                Product Details
            </h1>

            <div className="grid grid-cols-2 gap-4">

                <div>
                    <strong>Product Name</strong>
                </div>
                <div>{product.ProductName}</div>

                <div>
                    <strong>Supplier</strong>
                </div>
                <div>{product.CompanyName}</div>

                <div>
                    <strong>Category</strong>
                </div>
                <div>{product.CategoryName}</div>

                <div>
                    <strong>Quantity Per Unit</strong>
                </div>
                <div>{product.QuantityPerUnit}</div>

                <div>
                    <strong>Unit Price</strong>
                </div>
                <div>{product.UnitPrice}</div>

                <div>
                    <strong>Units In Stock</strong>
                </div>
                <div>{product.UnitsInStock}</div>

                <div>
                    <strong>Units On Order</strong>
                </div>
                <div>{product.UnitsOnOrder}</div>

                <div>
                    <strong>Reorder Level</strong>
                </div>
                <div>{product.ReorderLevel}</div>

                <div>
                    <strong>Discontinued</strong>
                </div>
                <div>
                    {product.Discontinued
                        ? "Yes"
                        : "No"}
                </div>
            </div>

            <div className="mt-6 flex gap-2">
                <button
                    onClick={() =>
                        router.push(`/Products/Edit/${id}`)
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Edit
                </button>

                <button
                    onClick={() =>
                        router.push("/Products")
                    }
                    className="bg-gray-600 text-white px-4 py-2 rounded"
                >
                    Back to List
                </button>
            </div>
        </div>
    );
}