import Image from "next/image";

import likeIcon from "./assets/thumbs-up-blue-icon.png";
import emptyIcon from "./assets/thumbs-up-line-icon.png";
import { useEffect, useState } from "react";
import LoadingIcon from "./LoadingIcon";

export default function LikeButton({ review, clientId }) {
    const [ likes, setLikes ] = useState(review.likes || []);
    const [ liked, setLiked ] = useState(likes.includes(clientId));
    const [ pending, setPending ] = useState(false);

    useEffect(() => {
        setLiked(likes.includes(clientId));
    }, [ likes ])

    const clickHandler = async () => {
        if (pending) return;
        setPending(true);

        try {
            const apiUrl = `/api/reviews/${liked ? "unlike" : "like"}`;
            const requestObject = {
                userId: clientId,
                reviewId: review["_id"]
            }
            const res = await fetch(apiUrl, {
                method: "POST",
                body: JSON.stringify(requestObject)
            });
            if (!res.ok) {
                console.log("nope")
                setPending(false);
                return;
            }
            const data = await res.json();
            setLikes([ ...data.newLikes ]);
            setPending(false);
        }
        catch (e) {
            setPending(false)
        }
    }

    if (review.userId === clientId) {
        return (
            <div className={"flex flex-col justify-center items-center"}>
                <div className={"flex flex-col justify-center items-center w-[50px] h-[50px] bg-gray-200"} title={"Likes"}>
                    <Image src={emptyIcon} width={20} height={20} alt={"Likes"} />
                </div>
                <p className={"p-1 text-center"}>{likes.length}</p>
            </div>
        );
    }

    return (
        (
            <div className={"flex flex-col justify-center items-center"}>
                {
                    pending ? 
                        <div className={"flex flex-col justify-center items-center w-[50px] h-[50px] rounded-sm bg-slate-300 cursor-pointer"} title={"Loading..."}>
                            <LoadingIcon />
                        </div>
                    :
                        <button className={"w-[50px] h-[50px] flex flex-col justify-center items-center rounded-sm bg-slate-300 cursor-pointer"} onClick={() => clickHandler()} title={`${liked ? "Un-like" : "Like"} this review`}>
                            <Image src={liked ? likeIcon : emptyIcon} width={20} height={20} alt={"Thumb up"} />
                        </button>
                }
                <p className={"p-1 text-"}>{likes.length}</p>
            </div>
        )
    )
}