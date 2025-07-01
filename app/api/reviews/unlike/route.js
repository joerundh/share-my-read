import { client } from "@/app/lib/sanity";
import { auth } from "@clerk/nextjs/server";

export async function POST(request) {
    const { userId: clientId } = await auth();

    if (!clientId) {
        return Response.json({ message: "Access denied." }, { status: 401 })
    }

    const req = await request.json();

    if (!req.userId) {
        return Response.json({ message: "Access denied." }, { status: 401 })
    }
    if (req.userId !== clientId) {
        return Response.json({ message: "Action prohibited." }, { status: 400 })
    }
    if (!req.reviewId) {
        return Response.json({ message: "Missing reference." }, { status: 400 })
    }

    try {
        const data = await client.fetch(`*[_id == "${req.reviewId}"][0]{ userId, likes }`, { cache: "no-store" });
        if (data.userId === req.userId) {
            return Response.json({ message: "The action is prohibited." }, { status: 403 })
        }
        if (data.likes) {
            if (!data.likes.includes(req.userId)) {
                return Response.json({ message: "The requested action is redundant." });
            }
        } else {
            return Response.json({ message: "The action is redundant." })
        }

        const updated = await client
                                .patch(req.reviewId)
                                .set({ "likes": data.likes.filter(id => id !== req.userId) })
                                .commit();
        return Response.json({ message: "Success.", newLikes: updated.likes });
    }
    catch (e) {
        console.log(e.toString());
        return Response.json({ message: "An error occurred." }, { status: 502 })
    }
}