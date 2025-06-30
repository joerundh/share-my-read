import { client } from "@/app/lib/sanity";
import { auth } from "@clerk/nextjs/server";

/*
This route returns all the reviews that have been written
by a given user
*/

export async function GET(request) {
    const { id: clientId } = await auth();

    if (!clientId) {
        return Response.json({ message: "Access denied." }, { status: 401 });
    }

    const req = await request.body;

    if (!req.clientId) {
        return Response.json({ message: "Access denied." }, { status: 401 });
    }
    if (!req.clientId !== clientId) {
        return Response.json({ message: "Access denied." }, { status: 401 });
    }

    if (!req.userId) {
        return Response.json({ message: "Missing reference." }, { status: 400 });
    }

    const offset = req.offset || 0;
    const limit = req.limit || 5;
    const sorting = req.sorting || 0;

    try {
        const query = `*[_type == "review" && userId == "${req.userId}"] | order(${[ "_createdAt", "rating desc", "rating asc" ][sorting]}) {
            _id,
            bookId,
            header,
            body,
            rating
        }[${offset}...${offset + limit}]`;

        const data = await client.fetch(query, { cache: "no-store" });
        return Response.json({ count: count })
    }
    catch (e) {
        console.log(e);
        return Response.json({ message: "Unable to fetch data." }, { status: 502 });
    }
}