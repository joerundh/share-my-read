import { useState } from "react";

import RatingBar from "./RatingBar";

export default function ReviewForm() {
    const [ header, setHeader ] = useState("");
    const [ body, setBody ] = useState("");
    const [ rating, setRating ] = useState(0);

    const submitReview = () => {

    }

    const clearForm = () => {
        setHeader("");
        setBody("");
        setRating(0);
    }

    return (
        <div className={"w-full flex flex-col justify-center gap-3"}>
            <h3 className={"font-bold"}>Add a review:</h3>
            <div className={"flex flex-row justify-between items-center"}>
                <div className={"flex flex-row gap-2 justify-between items-center"}>
                    <input className={"w-[400px] border-[1px] border-zinc-500 rounded-xs p-1"} type="text" placeholder="Header..." maxLength={80} value={header} onChange={e => setHeader(e.target.value)} />
                    <span>{header.length}/80</span>
                </div>
                <RatingBar value={rating} setter={setRating} />
            </div>
            <div>
                <textarea className={"w-full h-[220px] border-[1px] border-zing-500 rounded-xs p-1 resize-none"} placeholder="Body..." maxLength={600} value={body} onChange={e => setBody(e.target.value)}></textarea>
                <p className={"w-full text-right color-grey-500"}>{body.length}/600</p>
            </div>
            <div className={"flex flex-row justify-center items-center gap-2"}>
                <button className={"w-[150px] p-2 bg-gray-200 rounded-xs"} onClick={submitReview}>Submit</button>
                <button className={"w-[150px] p-2 bg-gray-200 rounded-xs"} onClick={clearForm}>Clear</button>
            </div>
        </div>
    )
}