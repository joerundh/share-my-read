import ReviewForm from "./ReviewForm";
import Review from "./Review";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import LoadingIcon from "./LoadingIcon";

export default function ReviewsPanel({ userId, bookId, reviews }) {
    const [ page, setPage ] = useState(0);
    
    const perPage = 10;
    const pageCount = Math.ceil(reviews.length/perPage);

    useEffect(() => {
        setPage(0);
    }, [ perPage ]);

    return (
        <div className={"flex flex-col justify-between gap-2"}>
            <h3>Reviews</h3>
            {
                // Review form, if the user is logged in, and has not submitted a review yet
            }
            <div className={"flex flex-col justify-start gap-2"}>
                {
                    isLoading ? (
                        <div className={"flex flex-row justify-center items-center gap-3"}>
                            <LoadingIcon width={20} />
                        </div>
                    ) : (
                        <>
                            <Paginator pageValue={page} pageSetter={setPage} perPageValue={perPage} />
                            {

                            }
                            <Paginator pageValue={page} pageSetter={setPage} perPageValue={perPage} pageCount={pageCount} />
                        </>
                    )
                }
            </div>
        </div>
    )
}