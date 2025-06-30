import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import RatingBar from "./RatingBar";
import Rating from "./Rating";
import Image from "next/image";

import editIcon from "./assets/edit-icon.png";
import saveIcon from "./assets/save-icon.png"
import cancelIcon from "./assets/cancel-icon.png"

export default function Review({ review }) {
    const { isLoaded, isSignedIn, user } = useUser();

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
    }, [ rating ]);

    const clientId = user.id;

    return (
        <div className={"flex flex-row gap-1 mx-auto"}>
            <div className={"w-[100px] bg-gray-500"}>
                {
                    // Profile
                }
            </div>
            <div className={"p-3 flex flex-col justify-start items-stretch gap-2"}>
                <div className={"flex flex-row justify-between items-center"}>
                    {
                        editingHeader ?
                            <>
                                <input type="text" value={editedHeader} onChange={e => setEditedHeader(e.target.value)} />,
                                <div className={"flex flex-row gap-2"}>
                                    <button className={"p-1 bg-gray-200 cursor-pointer"} onClick={() => saveHeader()}>
                                        <Image src={saveIcon} width={15} height={15} alt={"Save"} />
                                    </button>
                                    <button className={"p-1 bg-gray-200 cursor-pointer"} onClick={() => cancelHeader()}>
                                        <Image src={cancelIcon} width={15} height={15} alt={"Save"} />
                                    </button>
                                </div>
                            </>
                        :
                            <>
                                <h4 className={"font-bold"}>{header}</h4>
                                {
                                    clientId === review.userId ? (
                                        <button className={"p-1 bg-gray-200 cursor-pointer"} onClick={() => setEditingHeader(true)}>
                                            <Image src={editIcon} width={15} height={15} alt={"Edit"} />
                                        </button>
                                    ) : (<></>)
                                }
                            </>
                    }
                </div>
                <div className={"flex flex-row justify-between items-center"}>
                    {
                        editingRating ?
                            <>
                                <RatingBar value={editedRating} setter={setEditedRating} />
                                <div className={"flex flex-row gap-2"}>
                                    <button className={"p-1 bg-gray-200 cursor-pointer"} onClick={() => saveRating()}>
                                        <Image src={saveIcon} width={15} height={15} alt={"Save"} />
                                    </button>
                                    <button className={"p-1 bg-gray-200 cursor-pointer"} onClick={() => cancelRating()}>
                                        <Image src={cancelIcon} width={15} height={15} alt={"Cancel"} />
                                    </button>
                                </div>
                            </>
                        :
                            <>
                                <Rating stars={rating} />
                                {
                                    clientId === review.userId ? (
                                        <button className={"p-1 bg-gray-200 cursor-pointer"} onClick={() => setEditingRating(true)}>
                                            <Image src={editIcon} width={15} height={15} alt={"Edit"} />
                                        </button>
                                    ) : (<></>)
                                }
                            </>
                    }
                </div>
                <div className={"flex flex-column gap-2"}>
                    {
                        editingBody ?
                            <>
                                <textarea className={"w-full"} onChange={e => setEditedBody(e.target.value)}>{editedBody}</textarea>,
                                <div className={"flex flex-row justify-end gap-2"}>
                                    <button className={"p-1 bg-gray-200 cursor-pointer"} onClick={() => saveBody()}>
                                        <Image src={saveIcon} width={15} height={15} alt={"Save"} />
                                    </button>
                                    <button className={"p-1 bg-gray-200 cursor-pointer"} onClick={() => cancelBody()}>
                                        <Image src={cancelIcon} width={15} height={15} alt={"Cancel"} />
                                    </button>
                                </div>
                            </>
                        :
                            <>
                                {
                                    ...body.split("\\n").filter(x => !!x).map((par, index) => (
                                        <p key={index}>{par}</p>
                                    ))
                                }
                                {
                                    clientId === review.userId ? (
                                        <button className={"p-1 bg-gray-200 cursor-pointer"} onClick={() => setEditingBody(true)}>
                                            <Image src={editIcon} width={15} height={15} alt={"Edit"} />
                                        </button>
                                    ) : (<></>)
                                }
                            </>
                    }
                </div>
            </div>
        </div>
    )
}