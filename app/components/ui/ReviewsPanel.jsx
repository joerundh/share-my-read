import ReviewForm from "./ReviewForm";
import Review from "./Review";
import { useState, useEffect, Fragment } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import LoadingIcon from "./LoadingIcon";
import Paginator from "./Paginator";
import PaginationSettings from "./PaginationSettings";

export default function ReviewsPanel({ bookId }) {
    // User
    const { isLoaded, isSignedIn, user, error: userError } = useUser();

    // State variables
    const [ page, setPage ] = useState(0);
    const [ perPage, setPerPage ] = useState(5);
    const [ sorting, setSorting ] = useState(0);

    useEffect(() => {
        setPage(0);
    }, [ perPage, sorting ]);

    // Check whether the client user has written a review

    const { data: found, isLoading: searchLoading, error: searchError } = useQuery({
        queryKey: [ "book-reviews", "check", bookId ],
        queryFn: async () => {
            const searchParams = new URLSearchParams([
                [ "clientId", clientId ],
                [ "bookId", bookId ],                
                [ "userId", clientId ]
            ])
            const res = await fetch(`/api/reviews/book/user?${searchParams.toString()}`);
            if (!res.ok) {
                throw new Error("Could not fetch data.")
            }
            const obj = await res.json();
            return obj.result;
        },
        enabled: isSignedIn
    });

    // Number of reviews

    const { data: count, countLoading, countError } = useQuery({
        queryKey: [ "book-review", "count", bookId ],
        queryFn: async () => {
            const searchParams = new URLSearchParams([
                [ "clientId", clientId ],
                [ "bookId", bookId ]
            ]);

            const res = await fetch(`/api/reviews/count/book?${searchParams.toString()}`);
            if (!res.ok) {
                throw new Error("Could not fetch data.")
            }
            const obj = await res.json();
            return obj.count;
        },
        enabled: isSignedIn
    })

    // Fetch paginated reviews

    const { data, isLoading, error } = useQuery({
        queryKey: [ "book-reviews", bookId, page, perPage, sorting ],
        queryFn: async () => {
            const searchParams = new URLSearchParams([
                [ "clientId", clientId ],
                [ "bookId", bookId ],
                [ "offset", page*perPage ],
                [ "limit", perPage ],
                [ "sorting", sorting ]
            ])
            const res = await fetch(`/api/reviews/book?${searchParams.toString()}`)
            if (!res.ok) {
                throw new Error(res.message);
            }
            const obj = await res.json();
            return obj.results;
        },
        enabled: isSignedIn
    })

    if (!isLoaded) {
        return (
            <LoadingIcon message={"Loading..."} />
        )
    }

    if (!isSignedIn) {
        return (
            <p className={"w-full text-center"}>Log in to read reviews.</p>
        )
    }
    
    const clientId = user.id;

    const reviewForm = () => {
        if (searchLoading) {
            return <Fragment key={0} />
        }
        if (searchError) {
            return <Fragment key={0} />
        }
        if (found) {
            return <Fragment key={0} />
        }
        return <ReviewForm key={0} />
    }

    const reviews = () => {
        if (countLoading || isLoading) {
            return <LoadingIcon key={1} message={"Loading reviews..."} />
        }
        if (countError || error) {
            return <p key={1} className={"w-full text-center"}>An error occurred, try again later.</p>
        }
        return (
            <Fragment key={1}>
                <PaginationSettings perPageValue={perPage} perPageSetter={setPerPage} sortingValue={sorting} sortingSetter={setSorting} />
                {
                    data?.length ? 
                        data.map((review, index) => (
                            <Review key={index} review={review} />
                        ))
                    : (
                        <p className={"w-full text-center"}>No reviews.</p>
                    )
                }
                <Paginator pageValue={page} pageSetter={setPage} perPageValue={perPage} pageCount={count} />
            </Fragment>
        );
    }

    return (
        <div className={"flex flex-col justify-between gap-3"}>
            <h3 className={"text-lg font-bold"}>Reviews</h3>
            {
                [
                    reviewForm(),
                    reviews()
                ]
            }
        </div>
    );
}