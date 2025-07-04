"use client"
import Link from "next/link";
import CoverPhoto from "./CoverPhoto";
import RatingDisplay from "./RatingDisplay";
import Image from "next/image";

export default function ReviewListItem({ reviewObject }) {
    return (
        <div className={"flex flex-row justify-between items-stretch gap-2 border-1 bg-gray-200 rounded p-2"}>
            <div className={"flex flex-col justify-start items-center"}>
                <CoverPhoto src={reviewObject.book.imageUrl} width={100} height={150} />
            </div>
            <div className={"w-full flex flex-col gap-2"}>
                <div className={"flex flex-wrap gap-1 items-center gap-2"}>
                    <Link href={`/book/${reviewObject.book.id}`} className={"font-bold hover:underline"}>{reviewObject.book.title}</Link>
                    <div className={"text-sm flex flex-wrap gap-1"}>
                        <span>by</span>
                        {
                            reviewObject.book.authors.map((name, index) => {
                                const searchParams = new URLSearchParams([
                                    [ "q", name ]
                                ])
                                return <Link href={`/search/${searchParams.toString()}`} className={"font-bold hover:underline"} key={index}>{name}</Link>;
                            })
                        }
                    </div>
                </div>
                <div className={"flex flex-col gap-1"}>
                    <h4 className={"font-bold"}>{reviewObject.header}</h4>
                    <RatingDisplay value={reviewObject.rating} align={"right"} />
                    <p>{reviewObject.body}</p>
                </div>
            </div>
            <div className={"w-[100] flex flex-col justify-center items-center gap-2"}>
                <Image src={reviewObject.user.imageUrl} width={100} height={100} className={"rounded-full"} alt={"Profile picture"} />
                <span className={"font-bold"}>{reviewObject.user.firstName || reviewObject.user.userName || "User"}</span>
            </div>
        </div>
    )
}