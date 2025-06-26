import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import RatingBar from "./RatingBar";
import Rating from "./Rating";

export default function Review({ review }) {
    const { userId: clientId } = useUser();

    const [ header, setHeader ] = useState(review.header);
    const [ body, setBody ] = useState(review.body);
    const [ rating, setRating ] = useState(review.rating || 0);

    const [ editingHeader, setEditingHeader ] = useState(false);
    const [ editingBody, setEditingBody ] = useState(false);
    const [ editingRating, setEditingRating ] = useState(false);

    const [ editedHeader, setEditedHeader ] = useState(header);
    const [ editedBody, setEditedBody ] = useState(body);
    const [ editedRating, setEditedRating ] = useState(rating);

    const saveHeader = () => {
        setHeader(editedHeader);
        setEditingHeader(false);
    }

    const saveBody = () => {
        setBody(editedBody);
        setEditingBody(false);
    }

    const saveRating = () => {
        setRating(editedRating);
        setEditingRating(false);
    }

    const cancelHeader = () => {
        setEditedHeader(header);
        setEditingHeader(false);
    }

    const cancelBody = () => {
        setEditedBody(body);
        setEditingBody(false);
    }

    const cancelRating = () => {
        setEditedRating(rating);
        setEditedRating(false);
    }

    useEffect(() => {
        // API
    }, [ header ]);

    useEffect(() => {
        // API
    }, [ body ]);

    useEffect(() => {
        // API
    }, [ rating ])

    return (
        <div className={"flex flex-row"}>
            <div className={""}>
                {
                    // Profile
                }
            </div>
            <div className={"flex flex-column justify-start items-stretch gap-2"}>
                <div className={"flex flex-row justify-between items-center"}>
                    {
                        editingHeader ? [
                            <input type="text" value={editedHeader} onChange={e => setEditedHeader(e.target.value)} />,
                            <div className={"flex flex-row gap-2"}>
                                <button className={"p-2 bg-gray-200"} onClick={() => saveHeader()}>Save</button>
                                <button className={"p-2 bg-gray-200"} onClick={() => cancelHeader()}>Cancel</button>
                            </div>
                        ] : [
                            <p>{header}</p>,
                            clientId === review.userId ? (
                                <button className={"p-2 bg-gray-200"} onClick={() => setEditingHeader(true)}>Edit</button>
                            ) : (<></>)
                        ]
                    }
                </div>
                <div className={"flex flex-row justify-between items-center"}>
                    {
                        editingRating ? [
                            <RatingBar value={editedRating} setter={setEditedRating} />,
                            <div className={"flex flex-row gap-2"}>
                                <button className={"p-2 bg-gray-200"} onClick={() => saveRating()}>Save</button>
                                <button className={"p-2 bg-gray-200"} onClick={() => cancelRating()}>Cancel</button>
                            </div>
                        ]: [
                            <Rating stars={rating} />,
                            clientId === review.userId ? (
                                <button className={"p-2 bg-gray-200"} onClick={() => setEditingRating(true)}>Edit</button>
                            ) : (<></>)
                        ]
                    }
                </div>
                <div className={"flex flex-col gap-2"}>
                    {
                        editingBody ? [
                            <textarea className={"w-full"} onChange={e => setEditedBody(e.target.value)}>{editedBody}</textarea>,
                            <div className={"flex flex-row justify-end gap-2"}>
                                <button className={"p-2 bg-gray-200"} onClick={() => saveBody()}>Save</button>
                                <button className={"p-2 bg-gray-200"} onClick={() => cancelBody()}>Cancel</button>
                            </div>
                        ] : [
                            ...body.split("\\n").filter(x => !!x).map((par, index) => (
                                <p key={index}>{par}</p>
                            )),
                            clientId === userId ? (
                                <button className={"p-2 bg-gray-200"} onClick={() => setEditingBody(true)}>Edit</button>
                            ) : (<></>)
                        ]
                    }
                </div>
            </div>
        </div>
    )
}