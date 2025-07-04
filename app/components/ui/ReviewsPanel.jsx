import ReviewForm from "./ReviewForm";
import Review from "./Review";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import LoadingIcon from "./LoadingIcon";
import Paginator from "./Paginator";
import PaginationSettings from "./PaginationSettings";

export default function ReviewsPanel({ bookId, clientId, isAdmin, refetcher }) {
    // State variables
    const [ page, setPage ] = useState(0);
    const [ perPage, setPerPage ] = useState(5);
    const [ sorting, setSorting ] = useState(0);

    useEffect(() => {
        setPage(0);
    }, [ perPage, sorting ]);

    // Check whether the client user has written a review

    const { data: found, isLoading: isSearching, error: searchError, refetch: research, isRefetching: isResearching, refetchError: researchError } = useQuery({
        queryKey: [ "book-reviews", "search", bookId, clientId ],
        queryFn: async () => {
            const params = new URLSearchParams([
                [ "clientId", clientId ],
                [ "bookId", `${bookId}` ],
                [ "userId", clientId ]
            ]);
            const res = await fetch(`/api/reviews/book/user?${params.toString()}`);
            if (!res.ok) {
                throw new Error("Could not fetch data.")
            }
            const obj = await res.json();
            return obj.result;
        },
        enabled: !!clientId
    });

    // Number of reviews

    const { data: count, isLoading: isCounting, error: countingError, refetch: recount, refetchIsLoading: isRecounting, refetchError: recountError } = useQuery({
        queryKey: [ "book-review", "count", bookId ],
        queryFn: async () => {
            const searchParams = new URLSearchParams([
                [ "bookId", bookId ]
            ]);

            const res = await fetch(`/api/reviews/book/count?${searchParams.toString()}`);
            if (!res.ok) {
                throw new Error("Could not fetch data.")
            }
            const obj = await res.json();
            return obj.count;
        },
        enabled: !!clientId
    });

    // Fetch paginated reviews
    
    const { data, isLoading, error, refetch, refetchIsLoading, refetchError} = useQuery({
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
            
            const reviews = obj.results;

            const userIds = reviews.map(obj => obj.userId);
            const usersRes = await fetch("/api/users", {
                method: "POST",
                body: JSON.stringify({
                    clientId: clientId,
                    userId: userIds
                })
            });
            if (!usersRes.ok) {
                return reviews;
            }
            const data = await usersRes.json();
            
            const users = data.users;

            reviews.forEach(review => { review.user = users.find(x => x.id === review.userId); });
            return reviews;
        },
        enabled: !!clientId
    });

    const refetchAll = () => {
        refetcher();
        refetch();
        recount();
        research();
    }

    async function submit(e, pender) {
        const formData = new FormData(e.target);
        const data = formData.entries().reduce((acc, [ key, value ]) => { acc[key] = value; return acc; }, {})
        data.rating = Number(data.rating);

        data.bookId = `${bookId}`;
        data.userId = clientId;

        const res = await fetch("/api/reviews/post", {
            method: "POST",
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            pender(false);
            return;
        }
        refetchAll();
    }

    const pageCount = Math.ceil(count/perPage);

    const reviewForm = () => {
        if (isSearching || searchError || found || isResearching) {
            return <></>
        }
        return <ReviewForm bookId={bookId} clientId={clientId} submitter={submit} />
    }

    const reviewNumbers = () => {
        const x = count ? page*perPage + 1 : 0;
        const y = (page + 1)*perPage > count ? count : (page + 1)*perPage;
        return (
            <p className={"w-full"}>Showing {x} - {y} out of {count} reviews</p>
        )
    }

    const reviews = () => {
        if (isCounting || isLoading || isRecounting) {
            return <LoadingIcon message={"Loading reviews..."} />
        }
        if (countingError || error || recountError) {
            console.log(error)
            return <p className={"w-full text-center"}>An error occurred, try again later.</p>
        }
        if (!data?.length) {
            return (
                <p className={"w-full text-center"}>No reviews.</p>
            );
        }
        return data.map((review, index) => (
            <Review key={index} review={review} clientId={clientId} isAdmin={isAdmin} refetcher={refetchAll} />
        ))
    }

    return (
        <>
            {
                reviewForm()
            }
            <div className={"flex flex-col justify-between items-center gap-3"}>
                {
                    reviewNumbers()
                }
                <PaginationSettings perPageValue={perPage} perPageSetter={setPerPage} sortingValue={sorting} sortingSetter={setSorting} />
                {
                    reviews()
                }
                <Paginator pageValue={page} pageSetter={setPage} perPageValue={perPage} pageCount={pageCount} />
            </div>
        </>
    );
}