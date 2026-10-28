"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Customer = {
    CustomerID: string;
    CompanyName: string;
};

type Employee = {
    EmployeeID: number;
    EmployeeName: string;
};

type Product = {
    ProductID: number;
    ProductName: string;
    UnitPrice: number;
};

type OrderItem = {
    ProductID: number;
    ProductName: string;
    UnitPrice: number;
    Quantity: number;
    Discount: number;
};

export default function CreateOrderPage() {
    const router = useRouter();

    const [customers, setCustomers] =
        useState<Customer[]>([]);

    const [employees, setEmployees] =
        useState<Employee[]>([]);

    const [products, setProducts] =
        useState<Product[]>([]);

    const [form, setForm] = useState({
        CustomerID: "",
        EmployeeID: "",
        OrderDate: new Date()
            .toISOString()
            .split("T")[0],
        RequiredDate: "",
        Freight: 0,
    });

    const [items, setItems] = useState<OrderItem[]>([]);

    useEffect(() => {
        loadLookups();
    }, []);

    const loadLookups = async () => {
        const token =
            localStorage.getItem("token");

        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const [
            customerResponse,
            employeeResponse,
            productResponse,
        ] = await Promise.all([
            fetch("/api/orders/customers", {
                headers,
            }),
            fetch("/api/orders/employees", {
                headers,
            }),
            fetch("/api/orders/products", {
                headers,
            }),
        ]);

        setCustomers(
            await customerResponse.json()
        );

        setEmployees(
            await employeeResponse.json()
        );

        setProducts(
            await productResponse.json()
        );
    };

    const addItem = () => {
        setItems([
            ...items,
            {
                ProductID: 0,
                ProductName: "",
                UnitPrice: 0,
                Quantity: 1,
                Discount: 0,
            },
        ]);
    };

    const removeItem = (index: number) => {
        setItems(
            items.filter(
                (_, i) => i !== index
            )
        );
    };

    const updateItem = (
        index: number,
        field: string,
        value: any
    ) => {
        const updated = [...items];

        updated[index] = {
            ...updated[index],
            [field]: value,
        };

        if (field === "ProductID") {
            const product = products.find(
                (p) => p.ProductID === Number(value)
            );

            if (product) {
                updated[index].ProductName = product.ProductName;
                updated[index].UnitPrice = Number(product.UnitPrice);
            }
        }

        setItems(updated);
    };

    const orderTotal = useMemo(() => {
        return items.reduce(
            (sum, item) =>
                sum +
                item.UnitPrice *
                item.Quantity *
                (1 - item.Discount),
            Number(form.Freight)
        );
    }, [items, form.Freight]);

    const submitOrder = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        const response = await fetch("/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
                ...form,
                EmployeeID: Number(form.EmployeeID),
                Freight: Number(form.Freight),
                items
            })
        });

        const result = await response.json();

        if (response.ok) {
            router.push("/Orders");
        } else {
            console.error(result);
            alert(result.message || "Failed to create order");
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-6">
                Create Order
            </h1>

            <form onSubmit={submitOrder}>
                {/* Header Section */}

                <div className="bg-white border rounded p-6 mb-6">

                    <div className="grid md:grid-cols-2 gap-4">

                        <div>
                            <label className="block mb-1">
                                Customer
                            </label>

                            <select
                                className="w-full border rounded px-3 py-2"
                                value={
                                    form.CustomerID
                                }
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        CustomerID:
                                            e.target
                                                .value,
                                    })
                                }
                                required
                            >
                                <option value="">
                                    Select Customer
                                </option>

                                {customers.map(
                                    (
                                        customer
                                    ) => (
                                        <option
                                            key={
                                                customer.CustomerID
                                            }
                                            value={
                                                customer.CustomerID
                                            }
                                        >
                                            {
                                                customer.CompanyName
                                            }
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1">
                                Employee
                            </label>

                            <select
                                className="w-full border rounded px-3 py-2"
                                value={
                                    form.EmployeeID
                                }
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        EmployeeID:
                                            e.target
                                                .value,
                                    })
                                }
                                required
                            >
                                <option value="">
                                    Select Employee
                                </option>

                                {employees.map(
                                    (
                                        employee
                                    ) => (
                                        <option
                                            key={
                                                employee.EmployeeID
                                            }
                                            value={
                                                employee.EmployeeID
                                            }
                                        >
                                            {
                                                employee.EmployeeName
                                            }
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-1">
                                Order Date
                            </label>

                            <input
                                type="date"
                                className="w-full border rounded px-3 py-2"
                                value={
                                    form.OrderDate
                                }
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        OrderDate:
                                            e.target
                                                .value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <label className="block mb-1">
                                Required Date
                            </label>

                            <input
                                type="date"
                                className="w-full border rounded px-3 py-2"
                                value={
                                    form.RequiredDate
                                }
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        RequiredDate:
                                            e.target
                                                .value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <label className="block mb-1">
                                Freight
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                className="w-full border rounded px-3 py-2"
                                value={
                                    form.Freight
                                }
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        Freight:
                                            Number(
                                                e
                                                    .target
                                                    .value
                                            ),
                                    })
                                }
                            />
                        </div>

                    </div>
                </div>

                {/* Items */}

                <div className="bg-white border rounded p-6">

                    <div className="flex justify-between mb-4">
                        <h2 className="font-semibold text-lg">
                            Order Items
                        </h2>

                        <button
                            type="button"
                            onClick={addItem}
                            className="bg-green-600 text-white px-4 py-2 rounded"
                        >
                            Add Product
                        </button>
                    </div>

                    <table className="w-full border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2">
                                    Product
                                </th>
                                <th className="p-2">
                                    Price
                                </th>
                                <th className="p-2">
                                    Qty
                                </th>
                                <th className="p-2">
                                    Discount
                                </th>
                                <th className="p-2">
                                    Total
                                </th>
                                <th className="p-2">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {items.map(
                                (
                                    item,
                                    index
                                ) => (
                                    <tr
                                        key={
                                            index
                                        }
                                    >
                                        <td className="p-2">
                                            <select
                                                className="w-full border rounded px-2 py-1"
                                                value={
                                                    item.ProductID
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    updateItem(
                                                        index,
                                                        "ProductID",
                                                        Number(
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    )
                                                }
                                            >
                                                <option value="0">
                                                    Select
                                                </option>

                                                {products.map(
                                                    (
                                                        product
                                                    ) => (
                                                        <option
                                                            key={
                                                                product.ProductID
                                                            }
                                                            value={
                                                                product.ProductID
                                                            }
                                                        >
                                                            {
                                                                product.ProductName
                                                            }
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </td>

                                        <td className="p-2">
                                            {item.UnitPrice.toFixed(
                                                2
                                            )}
                                        </td>

                                        <td className="p-2">
                                            <input
                                                type="number"
                                                value={
                                                    item.Quantity
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    updateItem(
                                                        index,
                                                        "Quantity",
                                                        Number(
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    )
                                                }
                                            />
                                        </td>

                                        <td className="p-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={
                                                    item.Discount
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    updateItem(
                                                        index,
                                                        "Discount",
                                                        Number(
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    )
                                                }
                                            />
                                        </td>

                                        <td className="p-2">
                                            {(
                                                item.UnitPrice *
                                                item.Quantity *
                                                (1 -
                                                    item.Discount)
                                            ).toFixed(
                                                2
                                            )}
                                        </td>

                                        <td className="p-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeItem(
                                                        index
                                                    )
                                                }
                                                className="text-red-600"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>

                    <div className="text-right mt-4 text-xl font-bold">
                        Total: $
                        {orderTotal.toFixed(
                            2
                        )}
                    </div>
                </div>

                <div className="mt-6 flex gap-2">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Create Order
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/Orders"
                            )
                        }
                        className="bg-gray-600 text-white px-4 py-2 rounded"
                    >
                        Back to List
                    </button>
                </div>
            </form>
        </div>
    );
}