"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function DeleteEmployeePage() {
    const params = useParams();
    const router = useRouter();

    const employeeId = params.id;

    const [employee, setEmployee] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEmployee();
    }, []);

    const loadEmployee = async () => {
        try {
            const response = await fetch(
                `/api/employees/${employeeId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            const data = await response.json();
            setEmployee(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${employee.FirstName} ${employee.LastName}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `/api/employees/${employeeId}`,
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

            router.push("/Employees");
        } catch (error) {
            console.error(error);
            alert("Failed to delete employee.");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!employee) {
        return <div>Employee not found.</div>;
    }

    return (
        <div className="max-w-6xl mx-auto">

            <h1 className="text-3xl font-bold text-red-600 mb-2">
                Delete Employee
            </h1>

            <p className="text-red-500 mb-6">
                Are you sure you want to delete this employee?
            </p>

            <div className="bg-white rounded shadow p-6">

                <div>
                    {employee.PhotoBase64 && (
                        <div className="mb-6 flex justify-center">
                            <img
                                src={`data:image/bmp;base64,${employee.PhotoBase64}`}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded"
                            />
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">

                    <div>
                        <strong>Employee ID</strong>
                        <div>{employee.EmployeeID}</div>
                    </div>

                    <div>
                        <strong>Reports To</strong>
                        <div>
                            {employee.ReportsTo ?? "-"}
                        </div>
                    </div>

                    <div>
                        <strong>First Name</strong>
                        <div>{employee.FirstName}</div>
                    </div>

                    <div>
                        <strong>Last Name</strong>
                        <div>{employee.LastName}</div>
                    </div>

                    <div>
                        <strong>Title</strong>
                        <div>{employee.Title}</div>
                    </div>

                    <div>
                        <strong>Title Of Courtesy</strong>
                        <div>
                            {employee.TitleOfCourtesy}
                        </div>
                    </div>

                    <div>
                        <strong>Birth Date</strong>
                        <div>
                            {employee.BirthDate
                                ? new Date(
                                    employee.BirthDate
                                ).toLocaleDateString()
                                : "-"}
                        </div>
                    </div>

                    <div>
                        <strong>Hire Date</strong>
                        <div>
                            {employee.HireDate
                                ? new Date(
                                    employee.HireDate
                                ).toLocaleDateString()
                                : "-"}
                        </div>
                    </div>

                    <div>
                        <strong>Address</strong>
                        <div>{employee.Address}</div>
                    </div>

                    <div>
                        <strong>City</strong>
                        <div>{employee.City}</div>
                    </div>

                    <div>
                        <strong>Region</strong>
                        <div>{employee.Region}</div>
                    </div>

                    <div>
                        <strong>Postal Code</strong>
                        <div>{employee.PostalCode}</div>
                    </div>

                    <div>
                        <strong>Country</strong>
                        <div>{employee.Country}</div>
                    </div>

                    <div>
                        <strong>Home Phone</strong>
                        <div>{employee.HomePhone}</div>
                    </div>

                    <div>
                        <strong>Extension</strong>
                        <div>{employee.Extension}</div>
                    </div>

                    <div>
                        <strong>Photo Path</strong>
                        <div>{employee.PhotoPath}</div>
                    </div>

                </div>

                <div className="mt-6">
                    <strong>Notes</strong>

                    <div className="mt-2 p-4 border rounded bg-gray-50 whitespace-pre-wrap">
                        {employee.Notes}
                    </div>
                </div>

                <div className="mt-8 flex gap-3">
                    <Link
                        href="/Employees"
                        className="inline-flex h-9 items-center justify-center rounded bg-[#6c757d] hover:bg-[#5a6268] text-white text-sm font-medium px-4 transition shadow-sm"
                    >
                        Back To List
                    </Link>

                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Delete
                    </button>

                </div>

            </div>

        </div>
    );
}