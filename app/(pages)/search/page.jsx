"use client"
import LoadingIcon from "@/app/components/ui/LoadingIcon";
import SearchForm from "@/app/components/ui/SearchForm";
import SearchList from "@/app/components/ui/SearchList";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export default function Page() {
    const searchParams = useSearchParams();

    const { data, isLoading, error } = useQuery({
        queryKey: [ "book-search", searchParams.get("q") ],
        queryFn: async () => {
            const params = new URLSearchParams([
                [ "search", searchParams.get("q") ]
            ]);
            const res = await fetch(`https://gutendex.com/books?${params.toString()}`);
            if (!res.ok) {
                throw new Error("Could not fetch data.");
            }
            const obj = await res.json();
            const books = obj.results.map(book => {
                return {
                    id: book.id,
                    title: book.title,
                    authors: book.authors.map(author => author.name.split(", ").reverse().join(" ")),
                    imageUrl: book.formats["image/jpeg"]
                }
            });
            return books;
        },
        enabled: searchParams.has("q")
    });

    if (!searchParams.has("q")) {
        return (
            <>
                <h2 className={"text-lg font-bold text-center"}>Search</h2>
                <p>Search for a title, and author, or other.</p>
                <SearchForm to={"/search"} />
            </>
        )
    }

    if (isLoading) {
        return (
            <>
                <h2 className={"text-lg font-bold text-center"}>Search results</h2>
                <LoadingIcon message={"Searching..."} />
            </>
        )
    }
    if (error) {
        return (
            <>
                <h2 className={"text-lg font-bold text-center"}>An error occurred</h2>
                <p>Try again later.</p>
            </>
        )
    }

    return (
        <>
            <h2 className={"text-center text-lg font-bold"}>Search results</h2>
            <SearchList books={data} />
        </>
    )
}