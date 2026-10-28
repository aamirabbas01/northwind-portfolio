"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { AgGridReact } from "ag-grid-react";
import type {
    ColDef,
    ICellRendererParams
} from "ag-grid-community";

import {
    ModuleRegistry,
    AllCommunityModule,
} from "ag-grid-community";


ModuleRegistry.registerModules([
    AllCommunityModule
]);

type OrderRow = {
    OrderID: number;
    CompanyName: string;
    EmployeeName: string;
    OrderDate: string;
    Freight: number;
    ShipCountry: string;
};

export default function OrdersPage() {
    const router = useRouter();

    const [rowData, setRowData] =
        useState<OrderRow[]>([]);

    const [searchText, setSearchText] =
        useState("");
    const [aiInsights, setAiInsights] = useState("");
    const [loading, setLoading] = useState(false);
    const [insightsError, setInsightsError] = useState("");
    const loadOrders = useCallback(async () => {
        try {
            const response = await fetch(
                "/api/orders",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to load orders"
                );
            }

            const data: OrderRow[] = await response.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        let isActive = true;
        const load = async () => {
            const orders = await loadOrders();
            if (isActive && orders) {
                setRowData(orders);
            }
        };

        void load();
        return () => {
            isActive = false;
        };
    }, [loadOrders]);


    const filteredData = useMemo(() => {
        if (!searchText.trim())
            return rowData;

        return rowData.filter((row) =>
            Object.values(row)
                .join(" ")
                .toLowerCase()
                .includes(
                    searchText.toLowerCase()
                )
        );
    }, [rowData, searchText]);

    const columnDefs = useMemo<
        ColDef<OrderRow>[]
    >(
        () => [
            {
                headerName: "Order ID",
                field: "OrderID",
                width: 120,
            },
            {
                headerName: "Customer",
                field: "CompanyName",
                flex: 2,
            },
            {
                headerName: "Employee",
                field: "EmployeeName",
                flex: 2,
            },
            {
                headerName: "Order Date",
                field: "OrderDate",
                flex: 1.5,
                valueFormatter: (
                    params
                ) =>
                    params.value
                        ? new Date(
                            params.value
                        ).toLocaleDateString()
                        : "",
            },
            {
                headerName: "Freight",
                field: "Freight",
                flex: 1,
                valueFormatter: (
                    params
                ) =>
                    `$${Number(
                        params.value
                    ).toFixed(2)}`,
            },
            {
                headerName: "Country",
                field: "ShipCountry",
                flex: 1,
            },
            {
                headerName: "Actions",
                flex: 1,
                sortable: false,
                filter: false,
                cellRenderer: (params: ICellRendererParams<OrderRow>) => {
                    const id = params.data?.OrderID;

                    if (!id) return null;

                    return (
                        <div className="flex items-center gap-3 h-full">
                            <Link
                                href={`/Orders/Edit/${id}`}
                                className="hover:scale-110 transition"
                                title="Edit"
                            >
                                ✏️
                            </Link>

                            <Link
                                href={`/Orders/${id}`}
                                className="hover:scale-110 transition"
                                title="Details"
                            >
                                👁️
                            </Link>

                            <Link
                                href={`/Orders/Delete/${id}`}
                                className="hover:scale-110 transition"
                                title="Delete"
                            >
                                🗑️
                            </Link>
                        </div>
                    );
                }
            },
        ],
        []
    );

    const defaultColDef = useMemo(
        () => ({
            sortable: true,
            filter: true,
            resizable: true,
        }),
        []
    );
    const handleGenerateOrderInsights = async () => {
        setInsightsError("");
        setAiInsights("");
        setLoading(true);
        try {
            const response = await fetch(
                "/ai-api/order-insights",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        orders: rowData,
                    }),
                }
            );

            const data: {
                insights?: unknown;
                error?: unknown;
            } = await response.json();

            if (!response.ok) {
                throw new Error(
                    typeof data.error === "string"
                        ? data.error
                        : `Order insights request failed (${response.status}).`
                );
            }

            if (
                typeof data.insights !== "string" ||
                !data.insights.trim()
            ) {
                throw new Error("The order insights API returned no insights.");
            }

            setAiInsights(data.insights);
        }
        catch (error) {
            console.error("Failed to generate AI insights:", error);
            setInsightsError(
                error instanceof Error
                    ? error.message
                    : "Failed to generate AI insights."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                <h1 className="text-3xl font-semibold">
                    Orders
                </h1>

                <button
                    onClick={() =>
                        router.push(
                            "/Orders/Create"
                        )
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Add New Order
                </button>
            </div>

            {/* Search */}

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchText}
                    onChange={(e) =>
                        setSearchText(
                            e.target.value
                        )
                    }
                    className="w-full md:w-96 border rounded px-3 py-2"
                />
            </div>

            {/* Grid */}

            <div
                className="ag-theme-quartz"
                style={{
                    height: "650px",
                    width: "100%",
                }}
            >
                <AgGridReact
                    rowData={filteredData}
                    columnDefs={columnDefs}
                    defaultColDef={
                        defaultColDef
                    }
                    pagination
                    paginationPageSize={15}
                    paginationPageSizeSelector={[
                        15,
                        30,
                        50,
                    ]}
                    animateRows
                />
            </div>
            <br />
            <button
                type="button"
                onClick={handleGenerateOrderInsights}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-semibold shadow-md"
                disabled={loading}>
                {loading ? "Generating..." : "Generate AI Insights"}
            </button>
            <br />
            {loading && (
                <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <div className="flex items-center gap-2 text-blue-700">
                        <span className="animate-pulse text-lg">🤖</span>
                        <span className="font-medium">
                            Generating order insights...
                        </span>
                    </div>
                </div>
            )}

            {insightsError && (
                <div
                    role="alert"
                    className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
                >
                    ⚠️ {insightsError}
                </div>
            )}

            {aiInsights && (
                <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                    {/* Header */}
                    <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xl">
                            🤖
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-white">
                                AI Order Insights
                            </h3>

                            <p className="text-sm text-blue-100">
                                Smart analysis of Northwind orders
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <pre
                            className="
                    m-0
                    whitespace-pre-wrap
                    break-words
                    font-sans
                    text-sm
                    leading-7
                    text-slate-700
                "
                        >
                            {aiInsights}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}