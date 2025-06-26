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
        <div className={"flex flex-row justify-center gap-3"}>
            <Link className={"hover:underline"} onClick={() => firstPage()}>First</Link>
            <Link className={"hover:underline"} onClick={() => prevPage()}>Prev</Link>
            {
                pageValue - 2 < 0 ? <span>...</span> : <></>
            }
            {
                [ pageValue - 2, pageValue - 1].filter(x => x >= 0).map(x => (
                    <Link key={x} className={"hover:underline"} onClick={() => {}}>{x + 1}</Link>
                ))
            }
            <span>{}</span>
            {
                ...[ pageValue + 1, pageValue + 2 ].filter(x => x < pageCount).map(x => (
                    <Link key={x} className={"hover:underline"} onClick={() => {}}>{x + 1}</Link>
                ))
            }
            {
                pageValue + 2 < pageCount ? <span>...</span> : <></>
            }
            <Link className={"hover:underline"} onClick={() => nextPage()}>Next</Link>
            <Link className={"hover:underline"} onClick={() => lastPage()}>Last</Link>
        </div>
    )
}