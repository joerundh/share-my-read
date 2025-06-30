import { client } from "@/app/lib/sanity";
import { auth } from "@clerk/nextjs/server";

/*
This route returns all the reviews that have been written of 
a specific book
*/

export async function GET(request) {
    const { userId: clientId } = await auth();

    if (!clientId) {
        return Response.json({ message: "Access denied." }, { status: 401 });
    }

    const req = await request.nextUrl.searchParams.entries().reduce((acc, [key, value]) => { acc[key] = value; return acc; }, {});

    if (!req.clientId) {
        return Response.json({ message: "Access denied." }, { status: 401 });
    }
    
    if (req.clientId !== clientId) {
        return Response.json({ message: "Access denied." }, { status: 401 });
    }
    
    if (!req.bookId) {
        return Response.json({ message: "Missing reference." }, { status: 400 });
    }
    
    const offset = Number(req.offset || 0);
    const limit = Number(req.limit || 5);
    const sorting = Number(req.sorting || 0);

    try {
        /*
        const query = `*[_type == "review" && bookId == "${req.bookId}"]) | order(${[ "_createdAt", "rating desc", "rating asc" ][sorting]}) {
            _id, userId, header, body, rating 
        }[${offset}...${offset + limit}]`;
        */
        const query = `*[_type == "review"] {
            _id,
            userId,
            header,
            body,
            rating
        }`

        const data = await client.fetch(query, { cache: "no-store" });
        return Response.json({ results: data })
    }
    catch (e) {
        console.log(e);
        return Response.json({ message: "Unable to fetch data." }, { status: 502 });
    }
}