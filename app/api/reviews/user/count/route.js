import { client } from "@/app/lib/sanity";
import { auth } from "@clerk/nextjs/server";

export async function GET(request) {
    const { id: clientId } = await auth();

    if (!clientId) {
        return Response.json({ message: "Access denied." }, { status: 401 });
    }

    const req = await request.body;

    if (!req.clientId) {
        return Response.json({ message: "Access denied." }, { status: 401 });
    }
    if (req.clientId !== clientId) {
        return Response.json({ message: "Access denied." }, { status: 401 });
    }

    if (!req.userId) {
        return Response.json({ message: "Missing reference." }, { status: 400 });
    }

    try {
        const query = `count(*[_type == "review" && userId == "${req.userId}"])`;

        const data = await client.fetch(query, { cache: "no-store" });
        return Response.json({ count: count })
    }
    catch (e) {
        return Response.json({ message: "Unable to fetch data." }, { status: 502 });
    }
}