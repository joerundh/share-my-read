import getQueryClient from "@/app/lib/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function Layout({ children }) {
    const queryClient = getQueryClient();

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className={"flex flex-col justify-start gap-3"}>
                {children}
            </div>
        </HydrationBoundary>
    );
}