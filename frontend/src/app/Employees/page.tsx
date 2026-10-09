"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Employee {
    EmployeeID: number;
    FirstName: string;
    LastName: string;
    City: string;
    Region: string;
    Country: string;
    PhotoPath?: string;
    ReportsTo?: number;
    PhotoBase64?: string;
}
interface Manager {
    EmployeeID: number;
    FirstName: string;
    LastName: string;
}



const bufferToBase64 = (photo: {
    type: string;
    data: number[];
}) => {
    const binary = Uint8Array.from(photo.data);

    let str = "";

    binary.forEach((byte) => {
        str += String.fromCharCode(byte);
    });

    return btoa(str);
};

export default function Employees() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
    const [nameSearch, setNameSearch] = useState("");
    const [reportsTo, setReportsTo] = useState("");
    const [managers, setManagers] = useState<Manager[]>([]);

    useEffect(() => {
        fetchEmployees();
        loadManagers();
    }, []);
    const loadManagers = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "/api/employees",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();
            setManagers(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "/api/employees",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();
            setEmployees(data);
            setFilteredEmployees(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = () => {
        const results = employees.filter((employee) => {
            const fullName =
                `${employee.FirstName} ${employee.LastName}`.toLowerCase();

            return (
                fullName.includes(nameSearch.toLowerCase()) &&
                (reportsTo === "" ||
                    employee.ReportsTo === parseInt(reportsTo))
            );
        });

        setFilteredEmployees(results);
    };

    const handleReset = () => {
        setNameSearch("");
        setReportsTo("");
        setFilteredEmployees(employees);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold text-gray-800">
                    Employees
                </h1>

                <Link
                    href="/Employees/Create"
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    New Employee
                </Link>
            </div>

            {/* Search Panel */}
            <div className="bg-white border border-gray-200 rounded shadow-sm">
                <div className="bg-cyan-500 text-white px-4 py-2 rounded-t">
                    <h2 className="font-semibold">Search</h2>
                </div>

                <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        <div>
                            <label className="block text-sm mb-1">
                                Find by name
                            </label>

                            <input
                                type="text"
                                value={nameSearch}
                                onChange={(e) =>
                                    setNameSearch(e.target.value)
                                }
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">
                                Find by Reports To
                            </label>

                            <select
                                name="ReportsTo"
                                value={reportsTo}
                                onChange={(e) =>
                                    setReportsTo(e.target.value)
                                }
                                className="w-full border rounded px-3 py-2"
                            >
                                <option value="">
                                    Select
                                </option>

                                {managers.map((manager) => (
                                    <option
                                        key={manager.EmployeeID}
                                        value={manager.EmployeeID}
                                    >
                                        {manager.FirstName}{" "}
                                        {manager.LastName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end gap-2">
                            <button
                                onClick={handleSearch}
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                Search
                            </button>

                            <button
                                onClick={handleReset}
                                className="px-4 py-2 bg-gray-500 text-white rounded"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Employee Table */}
            <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left p-3">
                                    Full Name
                                </th>

                                <th className="text-left p-3">
                                    City
                                </th>

                                <th className="text-left p-3">
                                    Region
                                </th>

                                <th className="text-left p-3">
                                    Country
                                </th>

                                <th className="text-left p-3">
                                    Photo
                                </th>


                                <th className="text-left p-3">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredEmployees.map((employee) => (
                                <tr
                                    key={employee.EmployeeID}
                                    className="border-b hover:bg-gray-50"
                                >
                                    <td className="p-3">
                                        {employee.FirstName}{" "}
                                        {employee.LastName}
                                    </td>

                                    <td className="p-3">
                                        {employee.City}
                                    </td>

                                    <td className="p-3">
                                        {employee.Region}
                                    </td>

                                    <td className="p-3">
                                        {employee.Country}
                                    </td>

                                    <td>
                                        {employee.PhotoBase64 ? (
                                            <img
                                                src={`data:image/bmp;base64,${employee.PhotoBase64}`}
                                                alt="Employee"
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                        ) : (
                                            <span className="text-gray-400">No Photo</span>
                                        )}
                                    </td>


                                    <td className="p-3">
                                        <div className="flex gap-2 text-blue-600">
                                            <Link href={`/Employees/Edit/${employee.EmployeeID}`}>
                                                ✏️
                                            </Link>

                                            <Link href={`/Employees/${employee.EmployeeID}`}>
                                                👁️
                                            </Link>
                                            <Link href={`/Employees/Delete/${employee.EmployeeID}`}>

                                                🗑️
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredEmployees.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="text-center p-6 text-gray-500"
                                    >
                                        No employees found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}