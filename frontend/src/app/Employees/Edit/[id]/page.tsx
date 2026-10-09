"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { headers } from "next/dist/server/request/headers";

export default function EditEmployeePage() {
    const params = useParams();
    const router = useRouter();

    const employeeId = params.id;

    const [loading, setLoading] = useState(true);
    const [photoPreview, setPhotoPreview] = useState("");
    const [photoBase64, setPhotoBase64] = useState("");

    const [managers, setManagers] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        LastName: "",
        FirstName: "",
        Title: "",
        TitleOfCourtesy: "",
        BirthDate: "",
        HireDate: "",
        Address: "",
        City: "",
        Region: "",
        PostalCode: "",
        Country: "",
        HomePhone: "",
        Extension: "",
        Notes: "",
        ReportsTo: "",
        PhotoPath: ""
    });

    useEffect(() => {
        loadEmployee();
        loadManagers();
    }, []);

    const loadManagers = async () => {
        const response = await fetch("/api/employees",
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }

        );
        const data = await response.json();
        setManagers(data);
    };

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

            const employee = await response.json();
            setFormData({
                LastName: employee.LastName || "",
                FirstName: employee.FirstName || "",
                Title: employee.Title || "",
                TitleOfCourtesy:
                    employee.TitleOfCourtesy || "",
                BirthDate: employee.BirthDate
                    ? employee.BirthDate.substring(0, 10)
                    : "",
                HireDate: employee.HireDate
                    ? employee.HireDate.substring(0, 10)
                    : "",
                Address: employee.Address || "",
                City: employee.City || "",
                Region: employee.Region || "",
                PostalCode: employee.PostalCode || "",
                Country: employee.Country || "",
                HomePhone: employee.HomePhone || "",
                Extension: employee.Extension || "",
                Notes: employee.Notes || "",
                ReportsTo:
                    employee.ReportsTo?.toString() || "",
                PhotoPath: employee.PhotoPath || ""
            });

            if (employee.PhotoBase64) {
                setPhotoPreview(
                    `data:image/bmp;base64,${employee.PhotoBase64}`
                );

            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement |
            HTMLSelectElement
        >
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePhotoChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result as string;

            setPhotoPreview(result);

            const base64 = result.split(",")[1];

            setPhotoBase64(base64);
        };

        reader.readAsDataURL(file);
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        try {
            const payload = {
                ...formData,
                ReportsTo: formData.ReportsTo
                    ? Number(formData.ReportsTo)
                    : null,
                Photo: photoBase64 || null
            };

            const response = await fetch(
                `/api/employees/${employeeId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(payload)
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
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">
                Edit
            </h1>

            <h2 className="text-xl mb-6">
                Employee
            </h2>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-6">

                    <input
                        type="text"
                        name="LastName"
                        placeholder="Last Name"
                        value={formData.LastName}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />

                    <input
                        type="text"
                        name="FirstName"
                        placeholder="First Name"
                        value={formData.FirstName}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />

                    <input
                        type="text"
                        name="Title"
                        placeholder="Title"
                        value={formData.Title}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />

                    <input
                        type="text"
                        name="TitleOfCourtesy"
                        placeholder="Title Of Courtesy"
                        value={formData.TitleOfCourtesy}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />

                    <input
                        type="date"
                        name="BirthDate"
                        value={formData.BirthDate}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />

                    <input
                        type="date"
                        name="HireDate"
                        value={formData.HireDate}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />

                    <input
                        type="text"
                        name="Address"
                        placeholder="Address"
                        value={formData.Address}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />

                    <input
                        type="text"
                        name="City"
                        placeholder="City"
                        value={formData.City}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />

                    <input
                        type="text"
                        name="Region"
                        placeholder="Region"
                        value={formData.Region}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />

                    <input
                        type="text"
                        name="PostalCode"
                        placeholder="Postal Code"
                        value={formData.PostalCode}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />

                    <input
                        type="text"
                        name="Country"
                        placeholder="Country"
                        value={formData.Country}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />

                    <input
                        type="text"
                        name="HomePhone"
                        placeholder="Home Phone"
                        value={formData.HomePhone}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />

                    <input
                        type="text"
                        name="Extension"
                        placeholder="Extension"
                        value={formData.Extension}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    />

                    <select
                        name="ReportsTo"
                        value={formData.ReportsTo}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    >
                        <option value="">
                            Select Manager
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

                    <div>
                        {photoPreview && (
                            <img
                                src={photoPreview}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded"
                            />
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="block w-full text-sm text-gray-700
                                        file:mr-4 file:px-4 file:py-2
                                        file:bg-gray-300 file:text-gray-800
                                         file:border file:border-gray-400
                                         file:rounded file:cursor-pointer
                                         hover:file:bg-gray-400"
                        />
                    </div>

                    <textarea
                        name="Notes"
                        value={formData.Notes}
                        onChange={handleChange}
                        className="border p-2 rounded col-span-2"
                        rows={4}
                        placeholder="Notes"
                    />

                    <input
                        type="text"
                        name="PhotoPath"
                        value={formData.PhotoPath}
                        onChange={handleChange}
                        placeholder="Photo Path"
                        className="border p-2 rounded col-span-2"
                    />
                </div>

                <div className="mt-6 flex gap-2">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Save
                    </button>

                    <Link
                        href="/Employees"
                        className="bg-gray-600 text-white px-4 py-2 rounded"
                    >
                        Back to List
                    </Link>
                </div>
            </form>
        </div>
    );
}