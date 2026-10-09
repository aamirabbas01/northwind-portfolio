"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Manager {
    EmployeeID: number;
    FirstName: string;
    LastName: string;
}

export default function CreateEmployeePage() {
    const [managers, setManagers] = useState<Manager[]>([]);
    const [photoBase64, setPhotoBase64] = useState("");

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

    const [photoPreview, setPhotoPreview] = useState("");

    useEffect(() => {
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

            // remove data:image/jpeg;base64,
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
                Photo: photoBase64
            };

            const response = await fetch("/api/employees", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(payload)
            });

            const result = await response.text();

            console.log(result);

            if (!response.ok) {
                throw new Error(result);
            }

            window.location.href = "/Employees";
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">
                Create
            </h1>

            <h2 className="text-xl mb-6">
                Employee
            </h2>

            <hr className="mb-6" />

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Last Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Last Name
                        </label>

                        <input
                            type="text"
                            name="LastName"
                            value={formData.LastName}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    {/* First Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            First Name
                        </label>

                        <input
                            type="text"
                            name="FirstName"
                            value={formData.FirstName}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Title
                        </label>

                        <input
                            type="text"
                            name="Title"
                            value={formData.Title}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    {/* Title Of Courtesy */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Title of Courtesy
                        </label>

                        <input
                            type="text"
                            name="TitleOfCourtesy"
                            value={formData.TitleOfCourtesy}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    {/* Birth Date */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Birth Date
                        </label>

                        <input
                            type="date"
                            name="BirthDate"
                            value={formData.BirthDate}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    {/* Hire Date */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Hire Date
                        </label>

                        <input
                            type="date"
                            name="HireDate"
                            value={formData.HireDate}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Address
                        </label>

                        <input
                            type="text"
                            name="Address"
                            value={formData.Address}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    {/* City */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            City
                        </label>

                        <input
                            type="text"
                            name="City"
                            value={formData.City}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    {/* Region */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Region
                        </label>

                        <input
                            type="text"
                            name="Region"
                            value={formData.Region}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    {/* Postal Code */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Postal Code
                        </label>

                        <input
                            type="text"
                            name="PostalCode"
                            value={formData.PostalCode}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    {/* Country */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Country
                        </label>

                        <input
                            type="text"
                            name="Country"
                            value={formData.Country}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    {/* Home Phone */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Home Phone
                        </label>

                        <input
                            type="text"
                            name="HomePhone"
                            value={formData.HomePhone}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    {/* Extension */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Extension
                        </label>

                        <input
                            type="text"
                            name="Extension"
                            value={formData.Extension}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    {/* Reports To */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Reports To
                        </label>

                        <select
                            name="ReportsTo"
                            value={formData.ReportsTo}
                            onChange={handleChange}
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

                    {/* Photo */}

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


                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Notes
                        </label>

                        <textarea
                            name="Notes"
                            rows={4}
                            value={formData.Notes}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    {/* PhotoPath */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Photo Path
                        </label>

                        <input
                            type="text"
                            name="PhotoPath"
                            value={formData.PhotoPath}
                            onChange={handleChange}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Create
                    </button>

                    <Link
                        href="/Employees"
                        className="px-4 py-2 bg-gray-600 text-white rounded"
                    >
                        Back to List
                    </Link>
                </div>
            </form>
        </div>
    );
}