import { client } from "@/app/lib/sanity";
import { auth } from "@clerk/nextjs/server";

export async function GET(request) {
    const { userId: clientId } = await auth();
    if (!clientId) {
        return Response.json({ message: "Access denied." }, { status: 401 });
    }

    const params = await request.nextUrl.searchParams.entries().reduce((acc, [key, value]) => { acc[key] = value; return acc; }, {});

    if (!params.bookId) {
        return Response.json({ message: "Missing reference." }, { status: 400 });
    }

    try {
        const ratings = client.fetch(`*[_type == "review" && bookId == "${params.bookId}" && rating > 0]{ rating }`);
        return Response.json({
            mean: ratings.reduce((acc, cur) => acc + cur, 0)/ratings.length,
            count: ratings.length
        });
    }
    catch (e) {
        console.log(e.toString());
    }
}