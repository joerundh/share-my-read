import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";


export async function POST(request) {
    const { userId: clientId } = await auth();
    if (!clientId) {
        return Response.json({ message: "Access denied." }, { status: 401 });
    }

    const req = await request.json();
    if (!req.clientId) {
        return Response.json({ message: "Access denied." }, { status: 401 });
    }
    if (req.clientId !== clientId) {
        return Response.json({ message: "Access denied." }, { status: 401 });
    }

    if (!req.userId) {
        return Response.json({ message: "Missing references" }, { status: 400 });
    }

    try {
        const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

        const users = await clerkClient.users.getUserList({ userId: req.userId });
        const data = users.data.map(user => {
            return {
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                imageUrl: user.imageUrl
            }
        });
        return Response.json({ message: "Success.", users: data });
    }
    catch (e) {
        console.log(e.toString());
        return Response.json({ message: "An error." }, { status: 500 });
    }
}