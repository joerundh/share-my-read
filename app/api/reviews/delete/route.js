import { client } from "@/app/lib/sanity";
import { auth } from "@clerk/nextjs/server";

export async function POST(request) {
    const { userId: clientId, userRole: clientRole } = await auth();
    if (!clientId) {
        return Response.json({ message: "Access denied." }, { status: 401 });
    }

    const req = await request.json();
    if (!req.clientId) {
        return Response.json({ message: "Access denied." }, { status: 401 });
    }
    if (!req.reviewId) {
        return Response.json({ message: "Missing reference." }, { status: 400 });
    }

    try {
        const review = await client.fetch(`*[_id == "${req.reviewId}"][0]{ userId }`);
        if (clientId !== review.userId && clientRole !== "org:admin") {
            return Response.json({ message: "Action prohibited." }, { status: 401 })
        }
        const deleted = await client.delete(req.reviewId);
        return Response.json({ message: "Success." });
    }
    catch (e) {
        console.log(e.toString());
        return Response.json({ message: "An error occurred." }, { status: 500 });
    }
}