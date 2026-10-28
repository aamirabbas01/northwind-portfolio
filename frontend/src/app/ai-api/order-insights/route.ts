import Groq, { APIError } from "groq-sdk";

type OrderRecord = Record<string, unknown>;

function isOrderRecord(value: unknown): value is OrderRecord {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function summarizeOrders(orders: OrderRecord[]) {
    const customers = new Map<string, number>();
    const countries = new Map<string, number>();
    const months = new Map<string, number>();
    let totalFreight = 0;
    let shippedOrders = 0;
    let lateOrders = 0;

    for (const order of orders) {
        const customer = typeof order.CompanyName === "string"
            ? order.CompanyName
            : "Unknown";
        const country = typeof order.ShipCountry === "string"
            ? order.ShipCountry
            : "Unknown";
        const freight = Number(order.Freight);
        const orderDate = new Date(String(order.OrderDate ?? ""));
        const requiredDate = new Date(String(order.RequiredDate ?? ""));
        const shippedDate = new Date(String(order.ShippedDate ?? ""));

        customers.set(customer, (customers.get(customer) ?? 0) + 1);
        countries.set(country, (countries.get(country) ?? 0) + 1);

        if (Number.isFinite(freight)) {
            totalFreight += freight;
        }

        if (!Number.isNaN(orderDate.getTime())) {
            const month = orderDate.toISOString().slice(0, 7);
            months.set(month, (months.get(month) ?? 0) + 1);
        }

        if (!Number.isNaN(shippedDate.getTime())) {
            shippedOrders += 1;
            if (
                !Number.isNaN(requiredDate.getTime()) &&
                shippedDate > requiredDate
            ) {
                lateOrders += 1;
            }
        }
    }

    const topEntries = (entries: Map<string, number>) =>
        [...entries.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([name, count]) => ({ name, count }));

    return {
        totalOrders: orders.length,
        totalFreight: Number(totalFreight.toFixed(2)),
        averageFreight: Number((totalFreight / orders.length).toFixed(2)),
        shippedOrders,
        lateShippedOrders: lateOrders,
        ordersByMonth: [...months.entries()]
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([month, count]) => ({ month, count })),
        topCustomers: topEntries(customers),
        topShippingCountries: topEntries(countries),
    };
}

export async function POST(req: Request) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        return Response.json(
            { error: "Order insights are not configured on the server." },
            { status: 503 }
        );
    }

    let body: { orders?: unknown };
    try {
        body = await req.json();
    } catch {
        return Response.json(
            { error: "The request body must be valid JSON." },
            { status: 400 }
        );
    }

    if (
        !Array.isArray(body.orders) ||
        body.orders.length === 0 ||
        !body.orders.every(isOrderRecord)
    ) {
        return Response.json(
            { error: "A non-empty list of valid orders is required." },
            { status: 400 }
        );
    }

    try {
        const groq = new Groq({ apiKey });
        const summary = summarizeOrders(body.orders);
        const completion = await groq.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: [
                {
                    role: "user",
                    content: `
Analyze these aggregated Northwind order statistics:

${JSON.stringify(summary)}

Return the response using these sections:

📈 ORDER SUMMARY

🏆 TOP CUSTOMERS

🌍 SHIPPING AND DELIVERY

⚠️ ISSUES DETECTED

✅ RECOMMENDATIONS

The supplied data contains order headers only, not order line items or products.
Do not infer or invent product popularity or sales revenue.
`,
                },
            ],
        });

        return Response.json({
            insights: completion.choices[0].message.content ?? "",
        });
    } catch (error) {
        if (error instanceof APIError) {
            console.error("Groq order-insights request failed:", {
                status: error.status,
                message: error.message,
            });

            if (error.status === 401 || error.status === 403) {
                return Response.json(
                    {
                        error: "Groq rejected the API request. Check the frontend server logs for details.",
                    },
                    { status: 502 }
                );
            }

            if (error.status === 429) {
                return Response.json(
                    { error: "The Groq API rate limit or quota was reached. Try again later." },
                    { status: 503 }
                );
            }

            return Response.json(
                { error: `Groq could not process the order-insights request (HTTP ${error.status ?? "unknown"}).` },
                { status: 502 }
            );
        }

        console.error("Failed to connect to Groq for order insights:", error);
        return Response.json(
            { error: "Could not reach the Groq API. Try again later." },
            { status: 502 }
        );
    }
}