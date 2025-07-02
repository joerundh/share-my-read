import Image from "next/image";

import starIcon from "./assets/star-icon.png";
import emptyIcon from "./assets/star-empty-icon.png";

export default function Rating({ value, align }) {
    const getIcon = x => {
        if (!value) {
            return emptyIcon;
        }
        if (x <= value) {
            return starIcon;
        }
        return emptyIcon;
    }
    return (
        <div className={"w-fit flex flex-row gap-2 items-center"}>
            {
                align === "left" ? 
                    <span className={"w-fit text-sm text-center"}>
                        {
                            value ? `${value} / 5` : "(No rating)"
                        }
                    </span>
                : <></>
            }
            <div className={"flex flex-row"}>
            {
                new Array(5).fill(0)
                        .map((x, index) => index + 1)
                        .map(x => (
                                <Image width={18} height={18} key={x} src={getIcon(x)} alt={"Star icon"} />
                        ))
            }
            </div>
            {
                align === "right" ? 
                    <span className={"w-fit text-sm text-center"}>
                        {
                            value ? `${value} / 5` : "(No rating)"
                        }
                    </span>
                : <></>
            }
        </div>
    );
}