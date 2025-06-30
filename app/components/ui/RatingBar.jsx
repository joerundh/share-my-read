import { useState } from "react";
import Image from "next/image";

import starIcon from "./assets/star-icon.png";
import emptyIcon from  "./assets/star-empty-icon.png";

export default function RatingBar({ value, setter }) {
    const [ hovering, setHovering ] = useState(0);

    const pickIcon = n => {
        if (hovering) {
            if (n <= hovering) {
                return fullIcon;
            }
            return starIcon;
        }
        if (!value) {
            return emptyIcon;
        }
        if (n <= value) {
            return starIcon;
        }
        return emptyIcon;
    }

    const displayedValue = () => {
        if (hovering) {
            return `${hovering} / 5`
        }
        return `${value ? value : "-"} / 5`
    }

    return (
        <div className={"w-fit h-fit flex flex-row justify-between align-center gap-2"}>
            <span>{displayedValue()}</span>
            <div className={"flex flex-row justify-start align-center"}>
                <Image className={"w-[20px] h-[20px] cursor-pointer"} src={pickIcon(1)} alt="Star icon" onMouseDown={() => setter(1)} onMouseEnter={() => setHovering(1)} onMouseLeave={() => setHovering(0)} />
                <Image className={"w-[20px] h-[20px] cursor-pointer"} src={pickIcon(2)} alt="Star icon" onMouseDown={() => setter(2)} onMouseEnter={() => setHovering(2)} onMouseLeave={() => setHovering(0)} />
                <Image className={"w-[20px] h-[20px] cursor-pointer"} src={pickIcon(3)} alt="Star icon" onMouseDown={() => setter(3)} onMouseEnter={() => setHovering(3)} onMouseLeave={() => setHovering(0)} />
                <Image className={"w-[20px] h-[20px] cursor-pointer"} src={pickIcon(4)} alt="Star icon" onMouseDown={() => setter(4)} onMouseEnter={() => setHovering(4)} onMouseLeave={() => setHovering(0)} />
                <Image className={"w-[20px] h-[20px] cursor-pointer"} src={pickIcon(5)} alt="Star icon" onMouseDown={() => setter(5)} onMouseEnter={() => setHovering(5)} onMouseLeave={() => setHovering(0)} />
            </div>
        </div>
    )
}