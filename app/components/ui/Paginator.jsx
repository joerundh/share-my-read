export default function Paginator({ pageValue, pageSetter, perPageValue, pageCount }) {
    return (
        <div className={""}>
            <Link className={"hover:underline"} onClick={() => {}}>First</Link>
            <Link className={"hover:underline"} onClick={() => {}}>Prev</Link>
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
            <Link className={"hover:underline"} onClick={() => {}}>Next</Link>
            <Link className={"hover:underline"} onClick={() => {}}>Last</Link>
        </div>
    )
}