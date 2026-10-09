"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CustomerDetailsPage() {
    const params = useParams();

    const customerId = params.id as string;

    const [customer, setCustomer] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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

            const data = await response.json();

            setCustomer(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!customer) {
        return <div>Customer not found.</div>;
    }

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">
                Customer Details
            </h1>

            <hr className="mb-6" />

            <div className="bg-white rounded shadow p-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">

                    <div>
                        <div className="font-semibold">
                            Customer ID
                        </div>
                        <div>{customer.CustomerID}</div>
                    </div>

                    <div>
                        <div className="font-semibold">
                            Company Name
                        </div>
                        <div>{customer.CompanyName}</div>
                    </div>

                    <div>
                        <div className="font-semibold">
                            Contact Name
                        </div>
                        <div>{customer.ContactName}</div>
                    </div>

                    <div>
                        <div className="font-semibold">
                            Contact Title
                        </div>
                        <div>{customer.ContactTitle}</div>
                    </div>

                    <div>
                        <div className="font-semibold">
                            Address
                        </div>
                        <div>{customer.Address}</div>
                    </div>

                    <div>
                        <div className="font-semibold">
                            City
                        </div>
                        <div>{customer.City}</div>
                    </div>

                    <div>
                        <div className="font-semibold">
                            Region
                        </div>
                        <div>{customer.Region}</div>
                    </div>

                    <div>
                        <div className="font-semibold">
                            Postal Code
                        </div>
                        <div>{customer.PostalCode}</div>
                    </div>

                    <div>
                        <div className="font-semibold">
                            Country
                        </div>
                        <div>{customer.Country}</div>
                    </div>

                    <div>
                        <div className="font-semibold">
                            Phone
                        </div>
                        <div>{customer.Phone}</div>
                    </div>

                    <div>
                        <div className="font-semibold">
                            Fax
                        </div>
                        <div>{customer.Fax || "-"}</div>
                    </div>

                </div>

                <div className="mt-8 flex gap-3">

                    {/* FIXED: Restored valid opening tag for the Back To List path */}
                    <Link
                        href="/Customers"
                        className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition shadow-sm inline-flex items-center justify-center"
                    >
                        Back To List
                    </Link>

                    {/* FIXED: Restored valid opening tag for the dynamic Edit path */}
                    <Link
                        href={`/Customers/Edit/${customer.CustomerID}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition shadow-sm inline-flex items-center justify-center"
                    >
                        Edit
                    </Link>

                </div>

            </div>
        </div>
    );
}