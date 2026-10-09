'use client';
import React, { useEffect, useState } from 'react';
import { ShoppingBag, Users, Layers, TrendingUp, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register necessary Chart.js modules
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface SalesDataPoint {
    month: string;
    totalSales: number;
}
export default function DashboardView() {
    const [dashboardData, setDashboardData] = useState({
        totalOrders: 0,
        activeCustomers: 0,
        productsCatalog: 0,
        totalEmployees: 0
    });
    const [salesData, setSalesData] = useState<SalesDataPoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const metrics = [
        {
            title: 'Total Orders',
            value: dashboardData.totalOrders,
            icon: ShoppingBag,
            color: 'bg-info bg-cyan-500',
            link: '/orders/all'
        },
        {
            title: 'Active Customers',
            value: dashboardData.activeCustomers,
            icon: Users,
            color: 'bg-success bg-green-500',
            link: '/Customers'
        },
        {
            title: 'Products Catalog',
            value: dashboardData.productsCatalog,
            icon: Layers,
            color: 'bg-warning bg-amber-500',
            link: '/business/products'
        },
        {
            title: 'Total Employees',
            value: dashboardData.totalEmployees,
            icon: TrendingUp,
            color: 'bg-danger bg-red-500',
            link: '/Employees'
        }
    ];
    useEffect(() => {
        async function fetchSalesOrders() {
            try {
                const responseMetrices = await fetch(
                    "/api/dashboard/metrics",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

                const dataMetrices = await responseMetrices.json();
                setDashboardData(dataMetrices);
                // Replace with your actual endpoint handling database sales aggregations
                const response = await fetch(
                    "/api/dashboard/sales-data",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

                const data = await response.json();
                setSalesData(data);
            } catch (error) {
                console.error('Failed to load sales chart data:', error);
                // Static AdminLTE fallback mock dataset if backend is loading
                setSalesData([
                    { month: 'January', totalSales: 15000 },
                    { month: 'February', totalSales: 28000 },
                    { month: 'March', totalSales: 18000 },
                    { month: 'April', totalSales: 35000 },
                    { month: 'May', totalSales: 42000 },
                    { month: 'June', totalSales: 39000 },
                    { month: 'July', totalSales: 48000 }
                ]);
            } finally {
                setIsLoading(false);
            }
        }
        fetchSalesOrders();
    }, []);

    // Configure Chart.js options matching AdminLTE's look
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
                labels: {
                    color: '#495057',
                    font: { family: 'sans-serif', size: 12 }
                }
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#6c757d' }
            },
            y: {
                grid: { color: '#dee2e6', drawTicks: false },
                ticks: { color: '#6c757d' }
            }
        }
    };

    // Compile datasets into the exact styling vectors used in AdminLTE layouts
    const data = {
        labels: salesData.map(d => d.month),
        datasets: [
            {
                fill: true,
                label: 'Sales Revenue ($)',
                data: salesData.map(d => d.totalSales),
                borderColor: 'rgba(60,141,188,1)',      // AdminLTE Classic Blue border
                backgroundColor: 'rgba(60,141,188,0.15)', // Light area fill matching template grid
                pointRadius: 4,
                pointBackgroundColor: '#3b8bba',
                pointBorderColor: 'rgba(60,141,188,1)',
                pointHoverRadius: 6,
                tension: 0.4 // Smooth curvature matrix matching original design
            }
        ]
    };

    return (
        <div className="p-6 bg-[#f4f6f9] min-h-screen text-slate-800">
            {/* Content Header Title */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
                <h1 className="text-2xl font-semibold text-slate-800">Northwind Database Dashboard</h1>
                <div className="text-sm text-slate-500">
                    <Link href="/" className="hover:text-blue-700">
                        Home
                    </Link>
                    &gt; <span className="text-slate-700 font-medium">Dashboard</span>
                </div>
            </div>

            {/* AdminLTE-Style Small Metric Boxes */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {metrics.map((box, idx) => (
                    <div key={idx} className={`${box.color} relative overflow-hidden rounded text-white shadow flex flex-col justify-between h-32`}>
                        <div className="p-4">
                            <h3 className="text-3xl font-bold tracking-tight">{box.value}</h3>
                            <p className="text-sm font-medium opacity-90">{box.title}</p>
                        </div>
                        <div className="absolute right-3 top-3 opacity-20">
                            <box.icon size={68} />
                        </div>
                        <Link href={box.link} className="bg-black/10 py-1 text-center text-xs hover:bg-black/20 flex items-center justify-center gap-1 transition">
                            More info <ArrowUpRight size={12} />
                        </Link>
                    </div>
                ))}
            </div>
            {/* Chart Canvas Area Wrapper */}
            <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden w-full">
                {/* AdminLTE Themed Card Header */}
                <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-white">
                    <h3 className="text-base font-medium text-gray-900 flex items-center gap-2">
                        📊 <span>Sales Order Report</span>
                    </h3>
                    <div className="flex gap-1.5">
                        <span className="inline-flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                        <span className="text-xs text-gray-400 font-medium">Real-time</span>
                    </div>
                </div>

                {/* Chart Canvas Area Wrapper */}
                <div className="p-4 bg-white" style={{ height: '300px' }}>
                    {isLoading ? (
                        <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                            Parsing sales vectors...
                        </div>
                    ) : (
                        <Line options={options} data={data} />
                    )}
                </div>
            </div>
            {/* Database Context Details Box */}
            <div className="rounded border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-4 py-3 bg-slate-50">
                    <h2 className="font-semibold text-slate-700">About Northwind Data Schema</h2>
                </div>
                <div className="mx-auto max-w-[1400px] text-base leading-8 text-slate-900 sm:text-xl mt-5">
                    <p>
                        Northwind is a fictional company often used as a sample database
                        in tutorials and training materials for database management
                        systems, particularly Microsoft Access and SQL Server.
                        It represents a small international trading company that imports
                        and exports specialty foods from around the world.
                        The Northwind database includes various interconnected tables
                        such as Customers, Orders, Employees, Products, and Suppliers,
                        allowing users to practice and understand relational database
                        concepts through realistic business scenarios.
                    </p>
                    <p>
                        Its structured data and relationships make it a valuable tool
                        for learning SQL queries, data modeling, and application
                        development.
                    </p>
                </div>
            </div>
        </div>
    );
}
