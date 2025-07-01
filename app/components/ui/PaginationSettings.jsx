export default function PaginationSettings({ perPageValue, perPageSetter, sortingValue, sortingSetter }) {
    return (
        <div className={"flex flex-row justify-between items-center"}>
            <label className={"flex flex-row items-center gap-2"}>
                <span>Results per page:</span>
                <select value={perPageValue} onChange={e => perPageSetter(e.target.value)} className={"border-[1px] border-black rounded-xs"}>
                    <option value={1}>1</option>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                </select>
            </label>
            <label className={"flex flex-row items-center gap-2"}>
                <span>Sort by:</span>
                <select value={sortingValue} onChange={e => sortingSetter(e.target.value)} className={"border-[1px] border-black rounded-xs"}>
                    <option value={0}>Date added, descending</option>
                    <option value={1}>Date added, ascending</option>
                    <option value={2}>Rating, descending</option>
                    <option value={3}>Rating, ascending</option>
                </select>
            </label>
        </div>
    )
}