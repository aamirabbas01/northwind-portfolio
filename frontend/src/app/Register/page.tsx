'use client';

import React, { useState } from 'react';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('Passwords do not match!');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            // 1. Always safely parse the response text to JSON if possible
            let data: any = {};
            try {
                data = await response.json();
            } catch (jsonParseError) {
                // Fallback if backend crashes and sends raw HTML or nothing
                data = { error: 'Internal Server Error' };
            }

            // 2. Catch the backend error status (409, 500, etc.)
            if (!response.ok) {
                // Read the exact '.error' property your backend outputs
                const serverError = data.error || 'Internal Server Error';
                setErrorMessage(serverError);
                return; // Stop execution here so it doesn't show success
            }

            // 3. If response.ok is true, handle success
            setSuccessMessage('Registration successful!');
            setFormData({ email: '', password: '', confirmPassword: '' });

        } catch (networkError: any) {
            // Handles complete drop in connection/CORS blocking
            setErrorMessage('Failed to connect to the server.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-white p-4">
            <div className="w-full max-w-[540px]">
                {/* Header Section */}
                <h1 className="text-[40px] font-semibold tracking-tight text-[#1a1a1a]">
                    Register
                </h1>
                <p className="mt-2 text-2xl font-semibold text-[#1a1a1a]">
                    Create a new account.
                </p>

                {/* Divider Line */}
                <hr className="mt-5 border-[#e5e7eb]" />

                {/* ERROR SCREEN BANNER - This renders when errorMessage state has a value */}
                {errorMessage && (
                    <div className="mt-4 rounded-md bg-red-50 p-3 text-base text-red-600 border border-red-200 font-medium">
                        ⚠️ {errorMessage}
                    </div>
                )}

                {/* SUCCESS SCREEN BANNER */}
                {successMessage && (
                    <div className="mt-4 rounded-md bg-green-50 p-3 text-base text-green-600 border border-green-200 font-medium">
                        ✅ {successMessage}
                    </div>
                )}

                {/* Form Container */}
                <form onSubmit={handleRegister} className="mt-6 space-y-4">

                    {/* Email Field */}
                    <div className="flex h-[58px] items-center justify-between rounded-md border border-[#e5e7eb] px-4 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                        <label htmlFor="email" className="text-base text-[#1a1a1a]">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="w-2/3 bg-transparent text-right text-base text-[#1a1a1a] placeholder-[#8e8e8e] outline-none disabled:opacity-50"
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div className="flex h-[58px] items-center justify-between rounded-md border border-[#e5e7eb] px-4 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                        <label htmlFor="password" className="text-base text-[#1a1a1a]">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="w-2/3 bg-transparent text-right text-base text-[#1a1a1a] placeholder-[#8e8e8e] outline-none disabled:opacity-50"
                            required
                        />
                    </div>

                    {/* Confirm Password Field */}
                    <div className="flex h-[58px] items-center justify-between rounded-md border border-[#e5e7eb] px-4 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                        <label htmlFor="confirmPassword" className="text-base text-[#1a1a1a]">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="w-2/3 bg-transparent text-right text-base text-[#1a1a1a] placeholder-[#8e8e8e] outline-none disabled:opacity-50"
                            required
                        />
                    </div>

                    {/* Register Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-2 flex h-[50px] w-full items-center justify-center rounded-md bg-[#0d6efd] text-[18px] font-medium text-white transition-colors duration-200 hover:bg-[#0b5ed7] focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    );
}
