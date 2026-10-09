"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function DeleteCustomerPage() {
    const params = useParams();
    const router = useRouter();

    const customerId = params.id as string;

    const [customer, setCustomer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (customerId) {
            loadCustomer();
        }
    }, [customerId]);

    const loadCustomer = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `/api/customers/${customerId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load customer profile.");
            }

            const data = await response.json();
            setCustomer(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!customer) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete customer '${customer.CompanyName}'?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setIsDeleting(true);
            const response = await fetch(
                `/api/customers/${customerId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
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
            alert("Failed to delete customer.");
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px] text-lg font-medium text-slate-500">
                <span>⏳ Loading customer details...</span>
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="max-w-6xl mx-auto p-4 text-center py-12">
                <div className="text-xl font-semibold text-slate-700">Customer not found.</div>
                <Link href="/Customers" className="mt-4 inline-block text-blue-600 hover:underline">
                    Return to Customers List
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-3xl font-bold text-red-600 mb-2">
                Delete Customer
            </h1>

            <p className="text-red-500 mb-6">
                Are you sure you want to delete this customer? This action cannot be undone.
            </p>

            <hr className="mb-6 border-slate-200" />

            <div className="bg-white rounded shadow border border-slate-200 p-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm text-slate-800">

                    <div>
                        <div className="font-semibold text-slate-600">
                            Customer ID
                        </div>
                        <div className="mt-0.5 font-mono bg-slate-50 px-2 py-1 rounded inline-block">
                            {customer.CustomerID}
                        </div>
                    </div>

                    <div>
                        <div className="font-semibold text-slate-600">
                            Company Name
                        </div>
                        <div className="mt-0.5">{customer.CompanyName || "—"}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-slate-600">
                            Contact Name
                        </div>
                        <div className="mt-0.5">{customer.ContactName || "—"}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-slate-600">
                            Contact Title
                        </div>
                        <div className="mt-0.5">{customer.ContactTitle || "—"}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-slate-600">
                            Address
                        </div>
                        <div className="mt-0.5">{customer.Address || "—"}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-slate-600">
                            City
                        </div>
                        <div className="mt-0.5">{customer.City || "—"}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-slate-600">
                            Region
                        </div>
                        <div className="mt-0.5">{customer.Region || "—"}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-slate-600">
                            Postal Code
                        </div>
                        <div className="mt-0.5">{customer.PostalCode || "—"}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-slate-600">
                            Country
                        </div>
                        <div className="mt-0.5">{customer.Country || "—"}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-slate-600">
                            Phone
                        </div>
                        <div className="mt-0.5">{customer.Phone || "—"}</div>
                    </div>

                    <div>
                        <div className="font-semibold text-slate-600">
                            Fax
                        </div>
                        <div className="mt-0.5">{customer.Fax || "—"}</div>
                    </div>

                </div>

                <div className="mt-8 flex gap-3">
                    {/* FIXED: Restored valid Next.js Link opening tag */}
                    <Link
                        href="/Customers"
                        className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition shadow-sm inline-flex items-center justify-center text-sm font-medium"
                    >
                        Back To List
                    </Link>

                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition shadow-sm text-sm font-medium disabled:bg-red-400 disabled:cursor-not-allowed"
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>

            </div>
        </div>
    );
}
