import Image from "next/image";
import northwindCover from "../assests/northwind_group_cover.jpeg";

export default function HomePage() {
    return (
        <section className="px-4 pt-5">
            <div className="mx-auto w-full max-w-[1020px]">
                <Image
                    src={northwindCover}
                    alt="New York City skyline with the Northwind Value Creation logo"
                    priority
                    className="h-auto max-w-[1020px] rounded-lg object-cover"
                />
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
        </section>
    );
}