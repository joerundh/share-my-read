import { auth } from "@clerk/nextjs/server";

export async function POST(request) {
    const { userId: clientId } = await auth();

    if (!clientId) {
        return Response.json({ message: "Access denied." }, { status: 401 });
    }

    const req = request.body;

    if (!req.clientId) {
        return Response.json({ message: "Access denied." }, { status: 401 });
    }
    if (req.clientId !== clientId) {
        return Response.json({ message: "Access denied." }, { status: 401 });
    }

    if (!req.bookId) {
        return Response.json({ message: "Missing reference." }, { status: 400 })
    }
    if (!req.header || !req.body) {
        return Response.json({ message: "Missing content." }, { status: 400 })
    }

    try {
        const res = await fetch(`/api/review/book/user?clientId=${clientId}&bookId=${req.bookId}&userId=${clientId}`);
        if (!res.ok) {
            throw new Error("Error fetching data.");
        }
        const obj = await res.json();
        if (obj.result) {
            return Response.json({ message: "The action is prohibited." }, { status: 403 })
        }
    }
    catch (e) {
        console.log(e.toString());
        return Response.json({ message: "An error occurred." }, { status: 502 });
    }
}