export default function Paginator({ pageValue, pageSetter, perPageValue, pageCount }) {
    const firstPage = () => {
        if (pageValue > 0) {
            pageSetter(0);
        }
    }

    const prevPage = () => {
        if (pageValue > 0) {
            pageSetter(pageValue - 1);
        }
    }

    const nextPage = () => {
        if (pageValue < pageCount - 1) {
            pageSetter(pageValue + 1);
        }
    }

    const lastPage = () => {
        if (pageValue < pageCount - 1) {
            pageSetter(pageCount - 1);
        }
    }

    return (
        <div className={"w-full p-2 flex flex-row justify-center items-center gap-3 bg-gray-200 rounded-sm"}>
            <button className={"cursor-pointer p-2 hover:border-bottom-1 hover:bg-gray-300"} onClick={() => firstPage()}>First</button>
            <button className={"cursor-pointer p-2 hover:border-bottom-1 hover:bg-gray-300"} onClick={() => prevPage()}>Prev</button>
            {
                pageValue - 2 > 0 ? <span>...</span> : <></>
            }
            {
                [ pageValue - 2, pageValue - 1].filter(x => x >= 0).map(x => (
                    <button key={x} className={"cursor-pointer p-2 hover:border-bottom-1 hover:bg-gray-300"} onClick={() => {}}>{x + 1}</button>
                ))
            }
            <span className={"px-2 py-2 bg-slate-400"}>{pageValue + 1}</span>
            {
                ...[ pageValue + 1, pageValue + 2 ].filter(x => x < pageCount).map(x => (
                    <button key={x} className={"cursor-pointer p-2 hover:border-bottom-1 hover:bg-gray-300"} onClick={() => {}}>{x + 1}</button>
                ))
            }
            {
                pageValue + 2 < pageCount ? <span>...</span> : <></>
            }
            <button className={"cursor-pointer p-2 hover:border-bottom-1 hover:bg-gray-300"} onClick={() => nextPage()}>Next</button>
            <button className={"cursor-pointer p-2 hover:border-bottom-1 hover:bg-gray-300"} onClick={() => lastPage()}>Last</button>
        </div>
    )
}