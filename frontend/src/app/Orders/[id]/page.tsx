"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type OrderItem = {
    ProductID: number;
    ProductName: string;
    UnitPrice: number;
    Quantity: number;
    Discount: number;
    LineTotal: number;
};

type Order = {
    OrderID: number;
    CompanyName: string;
    EmployeeName: string;
    OrderDate: string;
    RequiredDate: string;
    ShippedDate: string;
    Freight: number;
    ShipName: string;
    ShipAddress: string;
    ShipCity: string;
    ShipRegion: string;
    ShipPostalCode: string;
    ShipCountry: string;
    items: OrderItem[];
};

export default function OrderDetailsPage() {
    const router = useRouter();
    const params = useParams();

    const id = params.id;

    const [order, setOrder] =
        useState<Order | null>(null);

    const [loading, setLoading] =
        useState(true);

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

    const grandTotal =
        order.items?.reduce(
            (sum, item) =>
                sum + Number(item.LineTotal),
            0
        ) ?? 0;

    return (
        <div className="max-w-7xl mx-auto p-6">

            <h1 className="text-3xl font-semibold mb-6">
                Order Details
            </h1>

            {/* Order Header */}

            <div className="bg-white border rounded shadow-sm p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                        <strong>Order ID</strong>
                        <div>
                            {order.OrderID}
                        </div>
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

                    <div>
                        <strong>
                            Required Date
                        </strong>
                        <div>
                            {order.RequiredDate
                                ? new Date(
                                    order.RequiredDate
                                ).toLocaleDateString()
                                : ""}
                        </div>
                    </div>

                    <div>
                        <strong>
                            Shipped Date
                        </strong>
                        <div>
                            {order.ShippedDate
                                ? new Date(
                                    order.ShippedDate
                                ).toLocaleDateString()
                                : ""}
                        </div>
                    </div>

                    <div>
                        <strong>
                            Ship Country
                        </strong>
                        <div>
                            {
                                order.ShipCountry
                            }
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <strong>
                            Ship Address
                        </strong>
                        <div>
                            {
                                order.ShipAddress
                            }
                        </div>
                    </div>

                </div>
            </div>

            {/* Order Items */}

            <div className="bg-white border rounded shadow-sm">
                <div className="px-4 py-3 border-b bg-gray-50">
                    <h2 className="font-semibold">
                        Order Items
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="text-left p-3">
                                    Product
                                </th>

                                <th className="text-right p-3">
                                    Unit Price
                                </th>

                                <th className="text-right p-3">
                                    Quantity
                                </th>

                                <th className="text-right p-3">
                                    Discount
                                </th>

                                <th className="text-right p-3">
                                    Total
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {order.items?.map(
                                (item) => (
                                    <tr
                                        key={
                                            item.ProductID
                                        }
                                        className="border-b"
                                    >
                                        <td className="p-3">
                                            {
                                                item.ProductName
                                            }
                                        </td>

                                        <td className="p-3 text-right">
                                            $
                                            {Number(
                                                item.UnitPrice
                                            ).toFixed(
                                                2
                                            )}
                                        </td>

                                        <td className="p-3 text-right">
                                            {
                                                item.Quantity
                                            }
                                        </td>

                                        <td className="p-3 text-right">
                                            {(
                                                Number(
                                                    item.Discount
                                                ) *
                                                100
                                            ).toFixed(
                                                0
                                            )}
                                            %
                                        </td>

                                        <td className="p-3 text-right">
                                            $
                                            {Number(
                                                item.LineTotal
                                            ).toFixed(
                                                2
                                            )}
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>

                        <tfoot>
                            <tr className="font-semibold bg-gray-50">
                                <td
                                    colSpan={
                                        4
                                    }
                                    className="p-3 text-right"
                                >
                                    Grand Total
                                </td>

                                <td className="p-3 text-right">
                                    $
                                    {grandTotal.toFixed(
                                        2
                                    )}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <div className="mt-6 flex gap-2">

                <button
                    onClick={() =>
                        router.push(
                            `/Orders/Edit/${id}`
                        )
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Edit
                </button>

                <button
                    onClick={() =>
                        router.push(
                            "/Orders"
                        )
                    }
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                >
                    Back to List
                </button>

            </div>

        </div>
    );
}