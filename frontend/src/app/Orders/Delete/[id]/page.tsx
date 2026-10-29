"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Order = {
    OrderID: number;
    CompanyName: string;
    EmployeeName: string;
    OrderDate: string;
    Freight: number;
    ShipCountry: string;
};

export default function DeleteOrderPage() {
    const router = useRouter();
    const params = useParams();

    const id = params.id;

    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        loadOrder();
    }, []);

    const loadOrder = async () => {
        try {
            const response = await fetch(
                `/api/orders/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            const data = await response.json();
            setOrder(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `Are you sure you want to delete Order #${id}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `/api/orders/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            const result = await response.json();

            if (response.ok) {
                alert("Order deleted successfully");
                router.push("/Orders");
            } else {
                alert(
                    result.message ||
                    "Failed to delete order"
                );
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                Loading...
            </div>
        );
    }

    if (!order) {
        return (
            <div className="p-6">
                Order not found
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6">

            <h1 className="text-3xl font-semibold mb-6">
                Delete Order
            </h1>

            <div className="bg-red-50 border border-red-300 p-4 rounded mb-6">
                Are you sure you want to delete
                this order?
            </div>

            <div className="bg-white border rounded p-6">

                <div className="grid md:grid-cols-2 gap-4">

                    <div>
                        <strong>Order ID</strong>
                        <div>{order.OrderID}</div>
                    </div>

                    <div>
                        <strong>Customer</strong>
                        <div>
                            {order.CompanyName}
                        </div>
                    </div>

                    <div>
                        <strong>Employee</strong>
                        <div>
                            {order.EmployeeName}
                        </div>
                    </div>

                    <div>
                        <strong>Freight</strong>
                        <div>
                            $
                            {Number(
                                order.Freight
                            ).toFixed(2)}
                        </div>
                    </div>

                    <div>
                        <strong>Country</strong>
                        <div>
                            {order.ShipCountry}
                        </div>
                    </div>

                    <div>
                        <strong>
                            Order Date
                        </strong>
                        <div>
                            {order.OrderDate
                                ? new Date(
                                    order.OrderDate
                                ).toLocaleDateString()
                                : ""}
                        </div>
                    </div>

                </div>

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
                        router.push("/Orders")
                    }
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                >
                    Back to List
                </button>

            </div>

        </div>
    );
}