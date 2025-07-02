import { client } from "@/app/lib/sanity";
import { auth } from "@clerk/nextjs/server";

export async function POST(request) {
    const { userId: clientId } = await auth();
    if (!clientId) {
        return Response.json({ message: "Access denied." }, { status: 401 })
    }

    const req = await request.json();
    if (req.clientId !== clientId) {
        return Response.json({ message: "Action prohibited." }, { status: 403 });
    }
    if (!req.reviewId) {
        return Response.json({ message: "Reference missing." }, { status: 400 })
    }
    if ((!req.header || req.header === "") && (!req.body || req.body === "") && !req.rating) {
        return Response.json({ message: "Missing content." }, { status: 400 })
    }

    try {
        const editObject = {}
        if (req.header) {
            editObject["header"] = req.header;
        }
        if (req.body) {
            editObject["body"] = req.body;
        }
        if (req.rating) {
            editObject["rating"] = Number(req.rating);
        }
        const edited = await client
                                .patch(req.reviewId)
                                .set(editObject)
                                .commit();
        return Response.json({ message: "Success." });
    }
    catch (e) {
        console.log(e.toString());
        return Response.json({ message: "An error occurred." }, { status: 502 })
    }
}