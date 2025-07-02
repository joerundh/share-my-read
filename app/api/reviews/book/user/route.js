import { client } from "@/app/lib/sanity";
import { auth } from "@clerk/nextjs/server";

/*
This route checks whether or not the client has written a review about 
the book in question
*/

export async function GET(request) {
    const { userId: clientId } = await auth();

    if (!clientId) {
        return Response.json({ message: "Access denied." }, { status: 401 })
    }

    const req = await request.nextUrl.searchParams.entries().reduce((acc, [key, value]) => { acc[key] = value; return acc; }, {});

    if (req.clientId !== clientId) {
        return Response.json({ message: "Access denied." }, { status: 401 });
    }
    if (!req.userId || !req.bookId) {
        return Response.json({ message: "Reference missing." }, { status: 400 });
    }

    try {
        const query = `count(*[_type == "review" && userId == "${req.userId}" && bookId == "${req.bookId}"])`;

        const data = await client.fetch(query, { cache: "no-store" });
        return Response.json({ message: "Success.", result: data > 0 });
    }
    catch (e) {
        console.log(e)
        return Response.json({ message: "Could not fetch data." }, { status: 502 });
    }
}