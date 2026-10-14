import Image from "next/image";

export default function HomePage() {
    return (
        <section className="px-4 pt-5">
            <div className="mx-auto w-full max-w-[1020px]">
                <Image
                    src="/images/northwind_group_cover.jpeg"
                    alt="New York City skyline with the Northwind Value Creation logo"
                    priority
                    unoptimized
                    className="mx-auto h-auto w-full max-w-[860px] rounded-lg object-cover"
                    width={1452}
                    height={747}
                />
            </div>


            <div className="mx-auto max-w-[1200px] text-base leading-8 text-slate-900 sm:text-xl mt-5 text-justify">
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
        </section>
    );
}