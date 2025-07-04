"use client"
import Link from "next/link";
import CoverPhoto from "@/app/components/ui/CoverPhoto";
import InlineList from "@/app/components/ui/InlineList";
import Rating from "./RatingDisplay";
import SmallLoadingIcon from "./SmallLoadingIcon";

export default function BookProfile({ bookObject, count, rating }) {
    const { countValue, countIsLoading, countError } = count;
    const { ratingData, ratingIsLoading, ratingError } = rating;

    return (
        <div className={"flex flex-col justify-start align-center gap-5"}>
            <div className={"flex flex-row align-start gap-5"}>
                <CoverPhoto src={bookObject.formats["image/jpeg"]} width={200} height={300} />
                <div className={"flex flex-col justify-start gap-5"}>
                    <h2 className={"full text-2xl font-bold"}>{bookObject.title}</h2>
                    <div>
                        by <InlineList separator={", "}>
                            {
                                bookObject.authors.map((author, index) => {
                                    const name = author.name.split(",").map(part => part.trim()).reverse().join(" ");
                                    return (
                                        <Link key={index} href={`/search?${new URLSearchParams([[ "q", name ]]).toString()}`} title="Search for author" className={"font-bold hover:underline"}>{name}</Link>
                                    )
                                })
                            }
                        </InlineList>
                    </div>
                    <div className={"flex flex-row justify-start gap-2"}>
                            <span>Number of reviews:</span>
                            {
                                countIsLoading ? <SmallLoadingIcon /> :
                                    countError ? 
                                        <span>(Unavailable)</span>
                                    :
                                        <span className={"font-bold"}>{countValue}</span>
                            }
                    </div>
                    <div className={"flex flex-row justify-start items-center gap-2"}>
                            <span>Mean rating:</span>
                            {
                                ratingIsLoading ? <SmallLoadingIcon /> : 
                                    ratingError ?
                                        <span>(Unavailable)</span>
                                    :
                                        ratingData.count ?
                                            (
                                                <>
                                                    <Rating value={ratingData.mean} />
                                                    <span>based on {ratingData.count} review{ratingData.count === 1 ? "" : "s"}</span>
                                                </>
                                            )
                                        :
                                            (
                                                <>
                                                    <Rating value={0} />
                                                    <span>No ratings yet</span>
                                                </>
                                            )
                            }
                    </div>
                </div>
            </div>
            <div>
                <h3 className={"font-bold"}>Summary</h3>
                {
                    bookObject.summaries.length ? (
                        <p>{bookObject.summaries[0]}</p>
                    ) : (
                        <p>No summary available.</p>
                    )
                }
            </div>
        </div>
    )
}