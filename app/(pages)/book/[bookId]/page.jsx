"use client"

import BookProfile from "@/app/components/ui/BookProfile";
import LoadingIcon from "@/app/components/ui/LoadingIcon";
import getBookProfile from "@/app/lib/getBookProfile";
import ReviewsPanel from "@/app/components/ui/ReviewsPanel";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation";

export default function Page() {
    const { user, isSignedIn, isLoaded } = useUser();

    const params = useParams();

    const { data: bookObject, isLoading, error } = useQuery({
        queryKey: [ "book-profile", params.bookId ],
        queryFn: async () => {
            const res = await fetch(`https://gutendex.com/books?ids=${params.bookId}`);
            if (!res.ok) {
                throw new Error("Could not fetch data.");
            }
            const obj = await res.json();
            if (!obj.results.length) {
                return null;
            }
            return obj.results[0];
        },
        enabled: !!params.bookId
    });

    if (!params.bookId) {
        return (
            <>
                <h2>No reference given</h2>
                <p>Please provide a reference to a book.</p>
            </>
        )
    }

    if (error || !bookObject) {
        return (
            <>
                <h2 className={"w-full text-center text-lg font-bold"}>An error occurred</h2>
                <p>Could not fetch the data, try again later.</p>
            </>
        )
    }

    const clientId = user?.id;
    const isAdmin = user?.roles?.includes("admin") || false;

    return (
        <>
            {
                isLoading ?
                    <LoadingIcon message={"Loading book profile..."} />
                :
                    <BookProfile bookObject={bookObject} />
            }
            {
                isLoaded ? (
                    <div className={"flex flex-col justify-between gap-5"}>
                        <h3 className={"text-lg font-bold"}>Reviews</h3>
                        {
                            isSignedIn ?
                                <ReviewsPanel bookId={bookObject.id} clientId={clientId} isAdmin={isAdmin} />
                            :
                                <p>Log in or sign up to read and add reviews.</p>
                        }
                    </div>
                ) : <></>
            }
        </>
    );
} 