import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
    try {
        if (!process.env.GROQ_API_KEY) {
            return Response.json(
                { error: "AI insights are not configured on the server." },
                { status: 500 }
            );
        }

        const { salesData } = await req.json();

        const completion =
            await groq.chat.completions.create({
                model: "openai/gpt-oss-20b",
                messages: [
                    {
                        role: "user",
                        content: `
Analyze this sales data:

${JSON.stringify(salesData)}

Give:
1. Best performing month
2. Worst performing month
3. Sales trend
4. Business recommendations
`,
                    },
                ],
            });

        return Response.json({
            insights:
                completion.choices[0].message.content ?? "",
        });
    } catch (error) {
        console.error("Failed to generate AI insights:", error);
        return Response.json(
            { error: "Failed to generate AI insights." },
            { status: 500 }
        );
    }
}