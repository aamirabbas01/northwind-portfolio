"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AgGridReact } from "ag-grid-react";
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



interface Customer {
    CustomerID: string;
    CompanyName: string;
    ContactName: string;
    ContactTitle: string;
    Address: string;
    City: string;
    Region: string;
    PostalCode: string;
    Country: string;
    Phone: string;
    Fax: string;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            const response = await fetch("/api/customers", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await response.json();

            setCustomers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const columnDefs = useMemo<ColDef<Customer>[]>(
        () => [
            {
                field: "CompanyName",
                headerName: "Company Name",
                flex: 2,
                sortable: true,
                filter: true
            },
            {
                field: "ContactName",
                headerName: "Contact Name",
                flex: 1.5,
                sortable: true,
                filter: true
            },
            {
                field: "ContactTitle",
                headerName: "Contact Title",
                flex: 1.5,
                sortable: true,
                filter: true
            },
            {
                field: "City",
                headerName: "City",
                flex: 1,
                sortable: true,
                filter: true
            },
            {
                field: "Country",
                headerName: "Country",
                flex: 1,
                sortable: true,
                filter: true
            },
            {
                headerName: "Actions",
                flex: 1,
                sortable: false,
                filter: false,
                cellRenderer: (params: any) => {
                    const id = params.data?.CustomerID;

                    if (!id) return null;

                    return (
                        <div className="flex items-center gap-3 h-full">
                            {/* FIXED: Restored opening tags for layout routing */}
                            <Link href={`/Customers/Edit/${id}`} className="hover:scale-110 transition">
                                ✏️
                            </Link>
                            <Link href={`/Customers/${id}`} className="hover:scale-110 transition">
                                👁️
                            </Link>
                            <Link href={`/Customers/Delete/${id}`} className="hover:scale-110 transition">
                                🗑️
                            </Link>
                        </div>
                    );
                }
            }
        ],
        []
    );

    return (
        <div className="space-y-4">

            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold">
                    Customers
                </h1>

                {/* FIXED: Restored opening tag and styled Create Button to match AdminLTE standards */}
                <Link
                    href="/Customers/Create"
                    className="bg-[#007bff] hover:bg-[#0069d9] text-white text-sm font-medium px-4 py-2 rounded transition shadow-sm"
                >
                    Create New
                </Link>
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

            <div
                className="ag-theme-quartz border border-slate-200 rounded overflow-hidden shadow-sm"
                style={{
                    height: 650,
                    width: "100%"
                }}
            >
                <AgGridReact
                    theme={themeQuartz}
                    rowData={customers}
                    columnDefs={columnDefs}
                    quickFilterText={searchText}
                    pagination={true}
                    paginationPageSize={10}
                    paginationPageSizeSelector={[
                        10,
                        25,
                        50,
                        100
                    ]}
                    animateRows={true}
                    defaultColDef={{
                        resizable: true
                    }}
                    loading={loading}
                />
            </div>

        </div>
    );
}
