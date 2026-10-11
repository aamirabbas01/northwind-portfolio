"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AgGridReact } from "ag-grid-react";
import type { ICellRendererParams } from "ag-grid-community";
import {
    ModuleRegistry,
    AllCommunityModule
} from "ag-grid-community";

ModuleRegistry.registerModules([
    AllCommunityModule
]);
import {
    ColDef,
    themeQuartz
} from "ag-grid-community";
// Updated theme imports for modern AG Grid (v31+)

export default function ProductsPage() {
    const router = useRouter();
    const [rowData, setRowData] = useState([]);
    const [searchText, setSearchText] = useState("");


    // 1. Wrap columnDefs in useMemo to prevent unnecessary AG Grid re-renders
    const columnDefs = useMemo<ColDef[]>(() => [
        { headerName: "Product Name", field: "ProductName", flex: 2 },
        { headerName: "Quantity Per Unit", field: "QuantityPerUnit", flex: 1 },
        { headerName: "Unit Price", field: "UnitPrice", flex: 1 },
        {
            headerName: "Discontinued",
            field: "Discontinued",
            flex: 1,
            cellRenderer: (params: ICellRendererParams) => (
                <input type="checkbox" checked={!!params.value} readOnly />
            )
        },
        { headerName: "Category", field: "CategoryName", flex: 1 },
        { headerName: "Supplier", field: "CompanyName", flex: 1 },
        {
            headerName: "Actions",
            flex: 1,
            sortable: false,
            filter: false,
            cellRenderer: (params: any) => {
                const id = params.data?.ProductID;
                if (!id) return null;

                if (!id) return null;

                return (
                    <div className="flex items-center gap-3 h-full">
                        {/* FIXED: Restored opening tags for layout routing */}
                        <Link href={`/Products/Edit/${id}`} className="hover:scale-110 transition">
                            ✏️
                        </Link>
                        <Link href={`/Products/${id}`} className="hover:scale-110 transition">
                            👁️
                        </Link>
                        <Link href={`/Products/Delete/${id}`} className="hover:scale-110 transition">
                            🗑️
                        </Link>
                    </div>
                );
            }
        },
    ], [router]);

    // 2. Define defaultColDef with useMemo
    const defaultColDef = useMemo<ColDef>(() => ({
        sortable: true,
        filter: true,
        resizable: true,
    }), []);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const response = await fetch("/api/products", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }); if (!response.ok) throw new Error("Failed to fetch products");
            const data = await response.json();
            setRowData(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this product?")) return;
        try {
            const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
            if (response.ok) {
                loadProducts();
            } else {
                console.error("Failed to delete product");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">Products</h1>
                <button
                    onClick={() => router.push("/Products/Create")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    Add New Product
                </button>
            </div>
            <div className="flex justify-end">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchText}
                    onChange={(e) =>
                        setSearchText(e.target.value)
                    }
                    className="border border-slate-300 rounded px-3 py-2 w-72 text-sm focus:outline-none focus:border-blue-500 text-slate-800"
                />
            </div>
            {/* Grid */}
            <div
                className="ag-theme-quartz"
                style={{ height: "650px", width: "100%" }}
            >
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    quickFilterText={searchText}
                    pagination={true}
                    paginationPageSize={10}
                    paginationPageSizeSelector={[10, 20, 50]}
                    animateRows={true}
                />
            </div>
        </div>
    );
}
