import ReviewForm from "./ReviewForm";
import Review from "./Review";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import LoadingIcon from "./LoadingIcon";

async function fetchSingleReview(userId, bookId) {
    const res = await fetch("/api/reviews", {
        method: "POST",
        body: JSON.stringify({
            userId: userId,
            bookId: bookId
        })
    });
    if (!res.ok) {
        return {};
    }
    const obj = await res.json();
    return obj.results[0] || null;
}

export default function ReviewsPanel({ bookId }) {
    const { userId: clientId } = useUser();

    const [ reviews, setReviews ] = useState([]);
    const [ page, setPage ] = useState(0);
    const [ perPage, setPerPage ] = useState(5);

    const pageCount = Math.ceil(reviews.length/perPage);

    useEffect(() => {
        setPage(0);
    }, [ perPage ]);

    const { data: showForm, isLoading: clientReviewLoading } = useQuery({
        queryKey: [ "client-has-review", clientId, bookId ],
        queryFn: () => fetchSingleReview(clientId, bookId)
    });

    const { data, isLoading, error } = useQuery({
        queryKey: [],
        queryFn: async () => {
            const res = await fetch("/api/reviews", {
                method: "GET",
                body: JSON.stringify({
                    bookId: bookId,
                    offset: page*perPage,
                    limit: perPage
                })
            })
        }
    })

    return (
        <div className={"flex flex-col justify-between gap-3"}>
            <h3>Reviews</h3>
            {
                !clientReviewLoading && !!showForm ? (
                    <ReviewForm></ReviewForm>
                ) : (<></>)
            }
            <div className={"flex flex-col justify-start gap-2"}>
                {
                    isLoading ? (
                        <div className={"flex flex-row justify-center items-center gap-3"}>
                            <LoadingIcon width={20} />
                        </div>
                    ) : (
                        <>
                            <div className={"flex flex-row justify-between items-center"}>
                                <label className={"flex flex-row items-center gap-2"}>
                                    <span>Results per page:</span>
                                    <select value={perPage} onChange={e => setPerPage(e.target.value)}>
                                        <option value={1}>1</option>
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                    </select>
                                </label>
                                <label className={"flex flex-row items-center gap-2"}>
                                    <span>Sort by:</span>
                                    <select>
                                        <option value={0}>Date added</option>
                                        <option value={1}>Rating, descending</option>
                                        <option value={2}>Rating, ascending</option>
                                    </select>
                                </label>
                            </div>
                            <Paginator pageValue={page} pageSetter={setPage} perPageValue={perPage} />
                            {
                                isLoading ? (
                                    <LoadingIcon message={"Loading reviews..."} />
                                ) : 
                                    reviews.map((review, index) => (
                                        <Review review={review} />
                                    ))
                            }
                            <Paginator pageValue={page} pageSetter={setPage} perPageValue={perPage} pageCount={pageCount} />
                        </>
                    )
                }
            </div>
        </div>
    )
}