"use client"
import Link from "next/link";
import CoverPhoto from "@/app/components/ui/CoverPhoto";
import InlineList from "@/app/components/ui/InlineList";
import ReviewForm from "./ReviewForm";

export default function BookProfile({ bookObject }) {
    return (
        <div className={"flex flex-col justify-start align-center gap-5"}>
            <div className={"flex flex-row align-start gap-5"}>
                <CoverPhoto src={bookObject.formats["image/jpeg"]} />
                <div className={"flex flex-col justify-start gap-3"}>
                    <h2 className={"full text-xl font-bold"}>{bookObject.title}</h2>
                    <div>
                        by <InlineList separator={", "}>
                            {
                                bookObject.authors.map((author, index) => {
                                    const name = author.name.split(",").map(part => part.trim()).reverse().join(" ");
                                    return (
                                        <Link key={index} href={`/search?${new URLSearchParams([[ "q", name ]]).toString()}`} title="Search for author" style={{ textWrap: "nowrap" }}>{name}</Link>
                                    )
                                })
                            }
                        </InlineList>
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
            <ReviewForm />
        </div>
    )
}