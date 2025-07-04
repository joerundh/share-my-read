import Link from "next/link";
import CoverPhoto from "./CoverPhoto";

export default function SearchListItem({ book }) {
    return (
        <div className={"w-full p-2 flex flex-row gap-3"}>
            <CoverPhoto src={book.imageUrl} width={150} height={200} />
            <div className={"w-full flex flex-col justify-start align-start gap-2"}>
                <Link href={`/book/${book.id}`} className={"text-xl font-bold hover:underline"} title="Open profile">{book.title}</Link>
                <div className={"flex flex-wrap gap-2"}>
                    <span>by</span>
                    {
                        book.authors.map((str, index) => {
                            const searchParams = new URLSearchParams([
                                [ "q", str ]
                            ]);
                            return <Link href={`/search?${searchParams.toString()}`} key={index} className={"hover:underline"} title="Search for author">{str}</Link>
                        })
                    }
                </div>
            </div>
        </div>
    )
}