import { useState } from "react";

import RatingBar from "./RatingBar";

export default function ReviewForm({ bookId, clientId, submitter }) {
    const [ header, setHeader ] = useState("");
    const [ body, setBody ] = useState("");
    const [ rating, setRating ] = useState(0);
    const [ pending, setPending ] = useState(0);

    const submitReview = async e => {
        e.preventDefault();
        if (pending) {
            return;
        }
        setPending(true);
        if (header === "" || body === "") {
            setPending(false);
            return;
        }
        submitter(e, setPending);
    }

    const clearForm = e => {
        e.preventDefault();
        setHeader("");
        setBody("");
        setRating(0);
    }

    return (
        <form method="POST" action={"/api/reviews/post"} onSubmit={submitReview}>
            <div className={"p-3 w-[700px] border-1 border-black rounded-sm mx-auto flex flex-col justify-center gap-3 bg-slate-200"}>
                <h3 className={"font-bold"}>Add a review of this book:</h3>
                <div className={"flex flex-row justify-between items-center"}>
                    <div className={"flex flex-row gap-2 justify-between items-center"}>
                        <input name={"header"} className={"w-[400px] border-[1px] border-black-500 rounded-xs p-1 bg-white"} type="text" placeholder="Header..." maxLength={80} value={header} onChange={e => setHeader(e.target.value)} />
                        <span>{header.length}/80</span>
                    </div>
                    <label className={"flex flex-row justify-center items-center gap-2"}>
                        <span>Rating:</span>
                        <RatingBar name={"rating"} value={rating} setter={setRating} />
                    </label>
                </div>
                <div>
                    <textarea name={"body"} className={"w-full h-[220px] border-[1px] border-zing-500 rounded-xs p-1 resize-none bg-white"} placeholder="Body..." maxLength={600} value={body} onChange={e => setBody(e.target.value)}></textarea>
                    <p className={"w-full text-right color-grey-500"}>{body.length}/600</p>
                </div>
                <div className={"flex flex-row justify-center items-center gap-2"}>
                    <button className={"w-[150px] p-2 bg-gray-200 border-1 border-black rounded-xs"}>Submit review</button>
                    <button className={"w-[150px] p-2 bg-gray-200 border-1 border-black rounded-xs"} onClick={clearForm}>Clear form</button>
                </div>
            </div>
        </form>
    )
}