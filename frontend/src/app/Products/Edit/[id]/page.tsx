"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Category {
    CategoryID: number;
    CategoryName: string;
}

interface Supplier {
    SupplierID: number;
    CompanyName: string;
}

interface ProductForm {
    ProductName: string;
    SupplierID: number | "";
    CategoryID: number | "";
    QuantityPerUnit: string;
    UnitPrice: number | "";
    UnitsInStock: number | "";
    UnitsOnOrder: number | "";
    ReorderLevel: number | "";
    Discontinued: boolean;
}

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();

    const productId = params.id as string;

    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<Category[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);

    const [form, setForm] = useState<ProductForm>({
        ProductName: "",
        SupplierID: "",
        CategoryID: "",
        QuantityPerUnit: "",
        UnitPrice: "",
        UnitsInStock: "",
        UnitsOnOrder: "",
        ReorderLevel: "",
        Discontinued: false,
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const token = localStorage.getItem("token");

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const [
                categoriesResponse,
                suppliersResponse,
                productResponse,
            ] = await Promise.all([
                fetch("/api/products/categories", { headers }),
                fetch("/api/products/suppliers", { headers }),
                fetch(`/api/products/${productId}`, { headers }),
            ]);

            const categoriesData = await categoriesResponse.json();
            const suppliersData = await suppliersResponse.json();
            const productData = await productResponse.json();

            setCategories(categoriesData);
            setSuppliers(suppliersData);

            setForm({
                ProductName: productData.ProductName ?? "",
                SupplierID: productData.SupplierID ?? "",
                CategoryID: productData.CategoryID ?? "",
                QuantityPerUnit: productData.QuantityPerUnit ?? "",
                UnitPrice: productData.UnitPrice ?? "",
                UnitsInStock: productData.UnitsInStock ?? "",
                UnitsOnOrder: productData.UnitsOnOrder ?? "",
                ReorderLevel: productData.ReorderLevel ?? "",
                Discontinued: productData.Discontinued ?? false,
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox"
                ? (e.target as HTMLInputElement).checked
                : value,
        }));
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                router.push("/Products");
            } else {
                alert("Failed to update product");
            }
        } catch (error) {
            console.error(error);
        }
    };

if (loading) {
    return <div className="p-6">Loading...</div>;
}

return (
    <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-semibold mb-6">
            Edit Product
        </h1>

        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                    <label className="block mb-1">
                        Product Name
                    </label>
                    <input
                        type="text"
                        name="ProductName"
                        value={form.ProductName}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1">
                        Supplier
                    </label>

                    <select
                        name="SupplierID"
                        value={form.SupplierID}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    >
                        <option value="">
                            Select Supplier
                        </option>

                        {suppliers.map((supplier) => (
                            <option
                                key={supplier.SupplierID}
                                value={supplier.SupplierID}
                            >
                                {supplier.CompanyName}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1">
                        Category
                    </label>

                    <select
                        name="CategoryID"
                        value={form.CategoryID}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    >
                        <option value="">
                            Select Category
                        </option>

                        {categories.map((category) => (
                            <option
                                key={category.CategoryID}
                                value={category.CategoryID}
                            >
                                {category.CategoryName}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1">
                        Quantity Per Unit
                    </label>
                    <input
                        type="text"
                        name="QuantityPerUnit"
                        value={form.QuantityPerUnit}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1">
                        Unit Price
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        name="UnitPrice"
                        value={form.UnitPrice}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1">
                        Units In Stock
                    </label>
                    <input
                        type="number"
                        name="UnitsInStock"
                        value={form.UnitsInStock}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1">
                        Units On Order
                    </label>
                    <input
                        type="number"
                        name="UnitsOnOrder"
                        value={form.UnitsOnOrder}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1">
                        Reorder Level
                    </label>
                    <input
                        type="number"
                        name="ReorderLevel"
                        value={form.ReorderLevel}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
            </div>

            <div className="mt-4">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="Discontinued"
                        checked={form.Discontinued}
                        onChange={handleChange}
                    />
                    Discontinued
                </label>
            </div>

            <div className="mt-6 flex gap-2">
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Update
                </button>

                <button
                    type="button"
                    onClick={() => router.push("/Products")}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                >
                    Back to List
                </button>
            </div>
        </form>
    </div>
);
}
``