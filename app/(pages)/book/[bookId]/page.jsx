"use client"

import BookProfile from "@/app/components/ui/BookProfile";
import getBookProfile from "@/app/lib/getBookProfile";
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation";

export default function Page() {
    const params = useParams();

    const { data, isLoading, error } = useQuery({
        queryKey: [ "book-profile", params.bookId ],
        queryFn: () => getBookProfile(params.bookId)
    });

    if (isLoading) {
        return (
            <h2 className={"center"}>Loading...</h2>
        )
    }

    if (error) {
        return (
            <h2 className={"center"}>An error occured.</h2>
        )
    }

    if (!data) {
        return (
            <h2 className={"center"}>Could not fetch data.</h2>
        )
    }

    return (
        <BookProfile bookObject={data} />
    )
} 