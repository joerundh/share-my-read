import Image from "next/image";
import loadingIcon from "./assets/update-icon.png";

export default function SmallLoadingIcon({ size }) {
    if (!size) {
        size = 10;
    }

    return (
        <div className={"flex flex-row justify-center items-center gap-2"}>
            <Image src={loadingIcon} alt="Loading icon" width={size} height={size} className={`animate-spin`}/>
        </div>
    )
}