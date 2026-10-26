import Image from "next/image";

export default function HomePage() {
    return (
        <div className="bg-slate-50">

            <section className="relative h-[500px] w-[70%] mx-auto overflow-hidden rounded-lg shadow-lg">
                <Image
                    src="/images/northwind_group_cover.jpeg"
                    alt="Northwind"
                    fill
                    priority
                    className="object-cover object-center"
                />

                <div className="absolute inset-0 bg-black/50" />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                    <h1 className="text-5xl font-bold">
                        Welcome to Northwind
                    </h1>

                    <p className="mt-3 text-xl">
                        Complete Business Management System
                    </p>
                </div>
            </section>

            <div className="mx-auto max-w-7xl px-6 py-12">

                {/* About Card */}
                <div className="rounded-xl bg-white p-8 shadow-lg">
                    <h2 className="mb-6 text-3xl font-bold text-blue-600">
                        About Northwind Database
                    </h2>

                    <p className="mb-4 text-slate-600">
                        Northwind is a fictional company frequently used as a sample
                        database for learning database management, SQL and application
                        development.
                    </p>

                    <p className="text-slate-600">
                        It represents an international trading company that imports
                        and exports specialty food products around the world.
                    </p>

                    <div className="mt-10 grid gap-6 md:grid-cols-4">

                        <div className="rounded-lg border bg-white p-5 text-center shadow">
                            <div className="mb-2 text-3xl">👥</div>
                            <h3 className="font-semibold">Customers</h3>
                            <p className="mt-2 text-sm text-slate-500">
                                Store customer information.
                            </p>
                        </div>

                        <div className="rounded-lg border bg-white p-5 text-center shadow">
                            <div className="mb-2 text-3xl">📦</div>
                            <h3 className="font-semibold">Products</h3>
                            <p className="mt-2 text-sm text-slate-500">
                                Manage inventory details.
                            </p>
                        </div>

                        <div className="rounded-lg border bg-white p-5 text-center shadow">
                            <div className="mb-2 text-3xl">📝</div>
                            <h3 className="font-semibold">Orders</h3>
                            <p className="mt-2 text-sm text-slate-500">
                                Track customer purchases.
                            </p>
                        </div>

                        <div className="rounded-lg border bg-white p-5 text-center shadow">
                            <div className="mb-2 text-3xl">🚚</div>
                            <h3 className="font-semibold">Suppliers</h3>
                            <p className="mt-2 text-sm text-slate-500">
                                Manage supplier logistics.
                            </p>
                        </div>

                    </div>
                </div>

                {/* Features */}
                <div className="mt-10 grid gap-6 md:grid-cols-3">

                    <div className="rounded-xl bg-white p-8 shadow">
                        <div className="text-4xl">📊</div>
                        <h3 className="mt-3 text-xl font-bold">
                            Dashboard Reports
                        </h3>
                        <p className="mt-2 text-slate-500">
                            Analyze sales, customers, and inventory.
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-8 shadow">
                        <div className="text-4xl">⚡</div>
                        <h3 className="mt-3 text-xl font-bold">
                            CRUD Operations
                        </h3>
                        <p className="mt-2 text-slate-500">
                            Manage business data efficiently.
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-8 shadow">
                        <div className="text-4xl">🔒</div>
                        <h3 className="mt-3 text-xl font-bold">
                            Secure Access
                        </h3>
                        <p className="mt-2 text-slate-500">
                            Authentication and authorization support.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}