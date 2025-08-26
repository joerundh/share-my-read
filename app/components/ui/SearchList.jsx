import { useState } from "react";
import SearchListItem from "./SearchListItem";

export default function SearchList({ books }) {
    const [ page, setPage ] = useState(0);
    const [ perPage, setPerPage ] = useState(10);

    const pageCount = Math.ceil(books.length/perPage);

    const firstPage = () => {
        if (page > 0) {
            setPage(0);
        }
    }

    const prevPage = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    }

    const nextPage = () => {
        if (page < pageCount - 1) {
            setPage(page + 1);
        }
    }

    const lastPage = () => {
        if (page < pageCount - 1) {
            setPage(pageCount - 1);
        }
    }

    return (
        <>
            <div className={"w-full p-2 bg-gray-200"}>
                <label className={"w-fit flex flex-row justify-center items-center gap-2"}>
                    <span>Results per page:</span>
                    <select value={perPage} onChange={e => setPerPage(e.target.value)} className={"p-1 border-1 rounded-xs bg-white"}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                        <option value={books.length}>All</option>
                    </select>
                </label>
            </div>
            <div className={"p-2 flex flex-col items-stretch gap-2"}>
                {
                    books.length ? 
                        books
                            .filter((x, index) => index >= page*perPage && index < (page + 1)*perPage)
                            .map((book, index) => <SearchListItem book={book} key={index}/>)
                    :
                        <p>No results found.</p>
                }
            </div>
            <div className={"w-full flex flex-row justify-center items-center gap-3 bg-gray-200"}>
                <button className={"p-2 hover:bg-gray-400 cursor-pointer"}>First</button>
                <button className={"p-2 hover:bg-gray-400 cursor-pointer"}>Prev</button>
                {

                }
                <span className={"p-2 bg-gray-400"}>{page + 1}</span>
                {

                }
                <button className={"p-2 hover:bg-gray-400 cursor-pointer"}>Next</button>
                <button className={"p-2 hover:bg-gray-400 cursor-pointer"}>Last</button>
            </div>
        </>
    )
}