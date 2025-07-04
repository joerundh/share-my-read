import { useState } from "react"

export default function SearchForm({ to }) {
    const [ query, setQuery ] = useState("");

    const clearForm = e => {
        e.preventDefault();
        setQuery("");
    }

    return (
        <form method="GET" action={to}>
            <div className={"flex flex-col justify-center items-center gap-5"}>
                <div>
                    <label className={"flex flex-row justify-center items-center gap-5"}>
                        <span>Query:</span>
                        <input type="text" name="q" id="q" value={query} onChange={e => setQuery(e.target.value)} className={"border-1 p-1 w-[400px]"} />
                    </label>
                </div>
                <div className={"flex flex-row justify-center gap-2"}>
                    <input type="submit" value="Submit" className={"w-[100px] bg-gray-300 p-1 rounded-sm border-1"} />
                    <button onClick={clearForm} className={"w-[100px] bg-gray-300 p-1 rounded-sm border-1"}>Clear</button>
                </div>
            </div>
        </form>
    )
}