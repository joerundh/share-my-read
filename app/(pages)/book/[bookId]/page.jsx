"use client"

import BookProfile from "@/app/components/ui/BookProfile";
import LoadingIcon from "@/app/components/ui/LoadingIcon";
import ReviewsPanel from "@/app/components/ui/ReviewsPanel";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation";

export default function Page() {
    const { user, isSignedIn, isLoaded } = useUser();
    const clientId = user?.id;
    const isAdmin = user?.roles?.includes("admin");

    const params = useParams();

    const { data: bookObject, isLoading, error } = useQuery({
        queryKey: [ "book-profile", params.bookId ],
        queryFn: async () => {
            const searchParams = new URLSearchParams([
                [ "ids", params.bookId ]
            ]);

            const res = await fetch(`https://gutendex.com/books?${searchParams.toString()}`);
            if (!res.ok) {
                throw new Error("Could not fetch data.");
            }
            const obj = await res.json();
            if (!obj.results.length) {
                throw new Error("Could not fetch the data.")
            }
            return obj.results[0];
        },
        enabled: !!params.bookId
    });

    const { data: countValue, isLoading: countIsLoading, error: countError, refetch: recount } = useQuery({
        queryKey: [ "book-profile", "count", params.bookId ],
        queryFn: async () => {
            const searchParams = new URLSearchParams([
                [ "bookId", params.bookId ]
            ]);

            const res = await fetch(`/api/reviews/book/count?${searchParams.toString()}`);
            if (!res.ok) {
                throw new Error("Could not fetch the data.");
            }
            const obj = await res.json();
            return obj.count;
        },
        enabled: !!params.bookId
    });

    const { data: ratingData, isLoading: ratingIsLoading, error: ratingError, refetch: refetchRating } = useQuery({
        queryKey: [ "book-profile", "rating", params.bookId ],
        queryFn: async () => {
            const searchParams = new URLSearchParams([
                [ "bookId", params.bookId ]
            ]);

            const res = await fetch(`/api/reviews/book/rating?${searchParams.toString()}`);
            if (!res.ok) {
                throw new Error("Could not fetch the data.");
            }
            const obj = await res.json();
            return obj.rating;
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

    if (isLoading) {
        return (
            <LoadingIcon message={"Loading book information..."} />
        )
    }

    if (error) {
        return (
            <>
                <h2 className={"w-full text-center text-lg font-bold"}>An error occurred</h2>
                <p>Could not fetch the data, try again later.</p>
            </>
        )
    }

    const refetchNumbers = () => {
        recount();
        refetchRating();
    }

    return (
        <>
            {
                <BookProfile bookObject={bookObject} rating={{ ratingData, ratingIsLoading, ratingError }} count={{ countValue, countIsLoading, countError }} />
            }
            {
                isLoaded ? (
                    <div className={"flex flex-col justify-between gap-5"}>
                        <h3 className={"text-lg font-bold"}>Reviews</h3>
                        {
                            isSignedIn ?
                                <ReviewsPanel bookId={bookObject.id} clientId={clientId} isAdmin={isAdmin} refetcher={refetchNumbers} />
                            :
                                <p>Log in or sign up to read and add reviews.</p>
                        }
                    </div>
                ) :
                    <LoadingIcon message={"Loading reviews..."} />
            }
        </>
    );
} 