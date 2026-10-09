"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function EditCustomerPage() {
    const params = useParams();
    const router = useRouter();

    const customerId = params.id as string;

    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        CustomerID: "",
        CompanyName: "",
        ContactName: "",
        ContactTitle: "",
        Address: "",
        City: "",
        Region: "",
        PostalCode: "",
        Country: "",
        Phone: "",
        Fax: ""
    });

    useEffect(() => {
        loadCustomer();
    }, []);

    const loadCustomer = async () => {
        try {
            const response = await fetch(
                `/api/customers/${customerId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const customer = await response.json();

            setFormData({
                CustomerID: customer.CustomerID || "",
                CompanyName: customer.CompanyName || "",
                ContactName: customer.ContactName || "",
                ContactTitle: customer.ContactTitle || "",
                Address: customer.Address || "",
                City: customer.City || "",
                Region: customer.Region || "",
                PostalCode: customer.PostalCode || "",
                Country: customer.Country || "",
                Phone: customer.Phone || "",
                Fax: customer.Fax || ""
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        try {
            const response = await fetch(
                `/api/customers/${customerId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(formData)
                }
            );

            if (!response.ok) {
                throw new Error(
                    await response.text()
                );
            }

            router.push("/Customers");
        } catch (error) {
            console.error(error);
            alert("Failed to save customer.");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">
                Edit Customer
            </h1>

            <hr className="mb-6" />

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                        <label className="block mb-1 font-medium">
                            Customer ID
                        </label>

                        <input
                            type="text"
                            value={formData.CustomerID}
                            disabled
                            className="w-full border rounded px-3 py-2 bg-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            Company Name
                        </label>

                        <input
                            type="text"
                            name="CompanyName"
                            value={formData.CompanyName}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            Contact Name
                        </label>

                        <input
                            type="text"
                            name="ContactName"
                            value={formData.ContactName}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            Contact Title
                        </label>

                        <input
                            type="text"
                            name="ContactTitle"
                            value={formData.ContactTitle}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            Address
                        </label>

                        <input
                            type="text"
                            name="Address"
                            value={formData.Address}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            City
                        </label>

                        <input
                            type="text"
                            name="City"
                            value={formData.City}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            Region
                        </label>

                        <input
                            type="text"
                            name="Region"
                            value={formData.Region}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            Postal Code
                        </label>

                        <input
                            type="text"
                            name="PostalCode"
                            value={formData.PostalCode}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            Country
                        </label>

                        <input
                            type="text"
                            name="Country"
                            value={formData.Country}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            Phone
                        </label>

                        <input
                            type="text"
                            name="Phone"
                            value={formData.Phone}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            Fax
                        </label>

                        <input
                            type="text"
                            name="Fax"
                            value={formData.Fax}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                </div>

                <div className="mt-8 flex gap-3">

                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition shadow-sm"
                    >
                        Save
                    </button>

                    {/* FIXED: Restored valid opening tag styled cleanly to match your layout */}
                    <Link
                        href="/Customers"
                        className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition shadow-sm inline-flex items-center justify-center"
                    >
                        Back To List
                    </Link>

                </div>
            </form>
        </div>
    );
}