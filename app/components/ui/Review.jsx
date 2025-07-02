import { useState, useEffect } from "react";

import Link from "next/link";

import RatingBar from "./RatingBar";
import Rating from "./Rating";
import Image from "next/image";
import LikeButton from "./LikeButton";

import editIcon from "./assets/edit-icon.png";
import saveIcon from "./assets/save-icon.png";
import cancelIcon from "./assets/cancel-icon.png";
import profileImage from "./assets/profile-icon.png";


export default function Review({ review, clientId }) {
    const [ header, setHeader ] = useState(review.header);
    const [ body, setBody ] = useState(review.body);
    const [ rating, setRating ] = useState(review.rating);

    const [ editingHeader, setEditingHeader ] = useState(false);
    const [ editingBody, setEditingBody ] = useState(false);
    const [ editingRating, setEditingRating ] = useState(false);

    const [ editedHeader, setEditedHeader ] = useState(header);
    const [ editedBody, setEditedBody ] = useState(body);
    const [ editedRating, setEditedRating ] = useState(rating);

    const saveHeader = async () => {
        if (editedHeader === "") {
            return;
        }
        const res = await fetch("/api/reviews/edit", {
            method: "POST",
            body: JSON.stringify({
                clientId: clientId,
                reviewId: review["_id"],
                header: editedHeader
            })
        });
        if (res.ok) {
            setHeader(editedHeader);
        } else {
            setEditedHeader(header);
        }
        setEditingHeader(false);
    }

    const saveBody = async () => {
        if (editedBody === "") {
            return;
        }
        const res = await fetch("/api/reviews/edit", {
            method: "POST",
            body: JSON.stringify({
                clientId: clientId,
                reviewId: review["_id"],
                body: editedBody
            })
        });
        if (res.ok) {
            setBody(editedBody);
        } else {
            setEditedBody(body);
        }
        setEditingBody(false);
    }

    const saveRating = async () => {
        const res = await fetch("/api/reviews/edit", {
            method: "POST",
            body: JSON.stringify({
                clientId: clientId,
                reviewId: review["_id"],
                rating: editedRating
            })
        });
        if (res.ok) {
            setRating(editedRating);
        } else {
            setEditedRating(rating);
        }
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
        setEditingRating(false);
    }

    const userProfile = () => {
        if (review.user) {
            return (
                <>
                    <Image src={review.user.imageUrl || profileImage} width={120} height={120} alt={"Profile image"} className={"rounded-full"} />
                    <Link href={`/user/${review.user.username}`} className={"text-black hover:text-underline"}>{review.user.firstName || review.user.username || "User"}</Link>
                </>
            )
        }
        return (
            <>
                <Image src={profileImage} alt="No profile image" />
                <span>User</span>
            </>
        )
    }

    return (
        <div className={"w-full p-2 flex flex-row gap-1 mx-auto"}>
            <div className={"w-[120px] h-full flex flex-col gap-2 justify-center items-center"}>
                {
                    userProfile()
                }
            </div>
            <div className={"w-[600px] p-3 flex flex-col justify-start items-stretch gap-2"}>
                <div className={"w-full flex flex-row justify-between items-center"}>
                    {
                        editingHeader ?
                            <>
                                <input type="text" value={editedHeader} onChange={e => setEditedHeader(e.target.value)} className={"w-[400px] border-1 rounded-xs p-1"} />,
                                <div className={"flex flex-row gap-2"}>
                                    <button className={"bg-gray-200 cursor-pointer"} onClick={saveHeader} title={"Save edit"}>
                                        <Image src={saveIcon} width={20} height={20} alt={"Save"} />
                                    </button>
                                    <button className={"bg-gray-200 cursor-pointer"} onClick={() => cancelHeader()} title={"Cancel edit"}>
                                        <Image src={cancelIcon} width={20} height={20} alt={"Save"} />
                                    </button>
                                </div>
                            </>
                        :
                            <>
                                <h4 className={"font-bold"}>{header}</h4>
                                {
                                    clientId === review.userId ? (
                                        <button className={"bg-gray-200 cursor-pointer"} onClick={() => setEditingHeader(true)} title={"Edit header"}>
                                            <Image src={editIcon} width={20} height={20} alt={"Edit"} />
                                        </button>
                                    ) : (<></>)
                                }
                            </>
                    }
                </div>
                <div className={"w-full flex flex-row justify-between items-center"}>
                    {
                        editingRating ?
                            <>
                                <RatingBar value={editedRating} setter={setEditedRating} align={"right"} />
                                <div className={"flex flex-row gap-2"}>
                                    <button className={"bg-gray-200 cursor-pointer"} onClick={saveRating} title={"Save edit"}>
                                        <Image src={saveIcon} width={20} height={20} alt={"Save"} />
                                    </button>
                                    <button className={"bg-gray-200 cursor-pointer"} onClick={cancelRating} title={"Cancel edit"}>
                                        <Image src={cancelIcon} width={20} height={20} alt={"Cancel"} />
                                    </button>
                                </div>
                            </>
                        :
                            <>
                                <Rating value={rating} align={"right"}/>
                                {
                                    clientId === review.userId ? (
                                        <button className={"bg-gray-200 cursor-pointer"} onClick={() => setEditingRating(true)} title={"Edit rating"}>
                                            <Image src={editIcon} width={20} height={20} alt={"Edit"} />
                                        </button>
                                    ) : (<></>)
                                }
                            </>
                    }
                </div>
                <div className={"w-full flex flex-row justify-between items-start gap-2"}>
                    {
                        editingBody ?
                            <>
                                <textarea className={"w-full border-[1px] outline-0 rounded-xs h-[140px] resize-none p-1"} onChange={e => setEditedBody(e.target.value)} value={editedBody} />
                                <div className={"flex flex-row justify-end gap-2"}>
                                    <button className={"bg-gray-200 cursor-pointer"} onClick={saveBody} title={"Save edit"}>
                                        <Image src={saveIcon} width={20} height={20} alt={"Save"} />
                                    </button>
                                    <button className={"bg-gray-200 cursor-pointer"} onClick={cancelBody} title={"Cancel edit"}>
                                        <Image src={cancelIcon} width={20} height={20} alt={"Cancel"} />
                                    </button>
                                </div>
                            </>
                        :
                            <>
                                <div className={"w-full"}>
                                    {
                                        ...body.split("\\n").filter(x => !!x).map((par, index) => (
                                            <p key={index}>{par}</p>
                                        ))
                                    }
                                </div>
                                {
                                    clientId === review.userId ? (
                                        <button className={"bg-gray-200 cursor-pointer"} onClick={() => setEditingBody(true)} title={"Edit body"}>
                                            <Image src={editIcon} width={20} height={20} alt={"Edit"} />
                                        </button>
                                    ) : (<></>)
                                }
                            </>
                    }
                </div>
            </div>
            <LikeButton review={review} clientId={clientId} />
        </div>
    )
}