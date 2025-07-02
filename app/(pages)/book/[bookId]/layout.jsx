import getBookProfile from "@/app/lib/getBookProfile";
import getQueryClient from "@/app/lib/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function Layout({ params, children }) {
    const { bookId } = await params;

    const queryClient = getQueryClient();

    queryClient.prefetchQuery({
        queryKey: [ "book-profile", bookId ],
        queryFn: () => getBookProfile(bookId)
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className={"flex flex-col justify-start gap-5"}>
                {children}
            </div>
        </HydrationBoundary>
    );
}