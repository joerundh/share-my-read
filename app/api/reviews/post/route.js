import { client } from "@/app/lib/sanity";
import { auth } from "@clerk/nextjs/server";

export async function POST(request) {
    const { userId: clientId } = await auth();

    if (!clientId) {
        return Response.json({ message: "Access denied." }, { status: 401 });
    }

    const req = await request.json();

    if (!req.userId) {
        return Response.json({ message: "Access denied." }, { status: 401 });
    }
    if (req.userId !== clientId) {
        return Response.json({ message: "Action prohibited." }, { status: 403 });
    }

    if (!req.bookId) {
        return Response.json({ message: "Missing reference." }, { status: 400 })
    }
    if (!req.header || !req.body) {
        return Response.json({ message: "Missing content." }, { status: 400 })
    }

    try {
        const count = await client.fetch(`count(*[_type == "review" && bookId == "${req.bookId}" && userId == "${clientId}"])`);
        if (count !== 0) {
            return Response.json({ message: "Action prohibited." }, { status: 403 })
        }

        const created = await client
                                .create({
                                    _type: "review",
                                    bookId: req.bookId,
                                    userId: req.userId,
                                    header: req.header,
                                    body: req.body,
                                    rating: req.rating || 0,
                                    likes: []
                                });
        if (created["_id"]) {
            return Response.json({ message: "Success." });
        }
        return Response.json({ message: "An error occurred." }, { status: 502 })
    }
    catch (e) {
        console.log(e.toString());
        return Response.json({ message: "An error occurred." }, { status: 502 });
    }
}