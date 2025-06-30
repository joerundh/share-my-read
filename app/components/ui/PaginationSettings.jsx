export default function PaginationSettings({ perPageValue, perPageSetter, sortingValue, sortingSetter }) {
    return (
        <div className={"flex flex-row justify-between items-center"}>
            <label className={"flex flex-row items-center gap-2"}>
                <span>Results per page:</span>
                <select value={perPageValue} onChange={e => perPageSetter(e.target.value)}>
                    <option value={1}>1</option>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                </select>
            </label>
            <label className={"flex flex-row items-center gap-2"}>
                <span>Sort by:</span>
                <select value={sortingValue} onChange={e => sortingSetter(e.target.value)}>
                    <option value={0}>Date added</option>
                    <option value={1}>Rating, descending</option>
                    <option value={2}>Rating, ascending</option>
                </select>
            </label>
        </div>
    )
}