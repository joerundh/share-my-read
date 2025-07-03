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
        const data = await client.fetch(`*[_type == "review" && bookId == "${params.bookId}" && rating > 0]{ rating }`, { cache: "no-store" });

        const ratings = data.map(obj => obj.rating);
        const count = ratings.length;

        const mean = count ? Math.round(ratings.reduce((acc, cur) => acc + cur, 0)/count) : 0;

        return Response.json({
            message: "Success.",
            rating: {
                mean: mean,
                count: count
            }
        });
    }
    catch (e) {
        console.log(e.toString());
        return Response.json({ message: "An error occurred." }, { status: 500 })
    }
}