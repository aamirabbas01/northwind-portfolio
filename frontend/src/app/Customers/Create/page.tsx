"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateCustomerPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        setIsSubmitting(true);

        try {
            const response = await fetch(
                "/api/customers",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify(
                        formData
                    )
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
            alert(
                "Failed to save customer."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-2 text-slate-800">
                Create Customer
            </h1>

            <hr className="mb-6 border-slate-200" />

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                        <label className="block mb-1 font-medium text-slate-700">
                            Customer ID
                        </label>

                        <input
                            type="text"
                            name="CustomerID"
                            value={formData.CustomerID}
                            onChange={handleChange}
                            maxLength={5}
                            required
                            placeholder="e.g. ALFKI (5 characters)"
                            className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 uppercase"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-slate-700">
                            Company Name
                        </label>

                        <input
                            type="text"
                            name="CompanyName"
                            value={formData.CompanyName}
                            onChange={handleChange}
                            required
                            className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-slate-700">
                            Contact Name
                        </label>

                        <input
                            type="text"
                            name="ContactName"
                            value={formData.ContactName}
                            onChange={handleChange}
                            className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-slate-700">
                            Contact Title
                        </label>

                        <input
                            type="text"
                            name="ContactTitle"
                            value={formData.ContactTitle}
                            onChange={handleChange}
                            className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-slate-700">
                            Address
                        </label>

                        <input
                            type="text"
                            name="Address"
                            value={formData.Address}
                            onChange={handleChange}
                            className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-slate-700">
                            City
                        </label>

                        <input
                            type="text"
                            name="City"
                            value={formData.City}
                            onChange={handleChange}
                            className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-slate-700">
                            Region
                        </label>

                        <input
                            type="text"
                            name="Region"
                            value={formData.Region}
                            onChange={handleChange}
                            className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-slate-700">
                            Postal Code
                        </label>

                        <input
                            type="text"
                            name="PostalCode"
                            value={formData.PostalCode}
                            onChange={handleChange}
                            className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-slate-700">
                            Country
                        </label>

                        <input
                            type="text"
                            name="Country"
                            value={formData.Country}
                            onChange={handleChange}
                            className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-slate-700">
                            Phone
                        </label>

                        <input
                            type="text"
                            name="Phone"
                            value={formData.Phone}
                            onChange={handleChange}
                            className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-slate-700">
                            Fax
                        </label>

                        <input
                            type="text"
                            name="Fax"
                            value={formData.Fax}
                            onChange={handleChange}
                            className="w-full border border-slate-300 rounded px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                </div>

                <div className="mt-8 flex gap-3">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition shadow-sm disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Saving..." : "Save"}
                    </button>

                    {/* FIXED: Restored valid Next.js Link opening tag */}
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
