import { client } from "@/app/lib/sanity";
import { auth } from "@clerk/nextjs/server";

/*
This route returns the number of reviews that have been written 
about a given book
*/

export async function GET(request) {
    const { userId: clientId } = await auth();

    if (!clientId) {
        return Response.json({ message: "Access denied: not logged in." }, { status: 401 });
    }

    const req = request.nextUrl.searchParams.entries().reduce((acc, [key, value]) => { acc[key] = value; return acc; }, {});

    if (!req.clientId) {
        return Response.json({ message: "Access denied." }, { status: 401 });
    }

    if (req.clientId !== clientId) {
        return Response.json({ message: "Access denied: mismatch." }, { status: 401 });
    }

    if (!req.bookId) {
        return Response.json({ message: "Missing reference." }, { status: 400 });
    }

    try {
        const query = `count(*[_type == "review" && bookId == "${req.bookId}"])`;

        const data = await client.fetch(query, { cache: "no-store" });
        return Response.json({ count: Number(data) })
    }
    catch (e) {
        console.log(e)
        return Response.json({ message: "Unable to fetch data." }, { status: 502 });
    }
}