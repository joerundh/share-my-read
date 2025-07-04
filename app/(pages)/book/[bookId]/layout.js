import getQueryClient from "@/app/lib/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function Layout({ params, children }) {
    const { bookId } = await params;

    const queryClient = getQueryClient();

    queryClient.prefetchQuery({
        queryKey: [ "book-profile", bookId ],
        queryFn: async () => {
            const searchParams = new URLSearchParams([
                [ "ids", bookId ]
            ])
            const res = await fetch(`https://gutendex.com/books?${searchParams.toString()}`);
            if (!res.ok) {
                throw new Error("Could not fetch data.");
            }
            const obj = await res.json();
            if (!obj.results.length) {
                return null;
            }
            return obj.results[0];
        }
    });

    queryClient.prefetchQuery({
        queryKey: [ "book-profile", "count", bookId ],
        queryFn: async () => {
            const searchParams = new URLSearchParams([
                [ "bookId", bookId ]
            ]);

            const res = await fetch(`/api/reviews/book/count?${searchParams.toString()}`);
            if (!res.ok) {
                throw new Error("Could not fetch the data.");
            }
            const obj = await res.json();
            return obj.count;
        }
    });

    queryClient.prefetchQuery({
        queryKey: [ "book-profile", "rating", bookId ],
        queryFn: async () => {
            const searchParams = new URLSearchParams([
                [ "bookId", bookId ]
            ]);

            const res = await fetch(`/api/reviews/book/rating?${searchParams.toString()}`);
            if (!res.ok) {
                throw new Error("Could not fetch the data.");
            }
            const obj = await res.json();
            return { mean: obj.mean, count: obj.count };
        }
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className={"flex flex-col justify-start gap-5"}>
                {children}
            </div>
        </HydrationBoundary>
    );
}