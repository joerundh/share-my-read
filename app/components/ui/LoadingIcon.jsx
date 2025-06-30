import Image from "next/image";
import loadingIcon from "./assets/loader-icon.png";

export default function LoadingIcon({ message }) {
    return (
        <div className={"flex flex-row justify-center items-center gap-2"}>
            <Image src={loadingIcon} alt="Loading icon" className={"w-[20px] h-[20px] animate-spin"}/>
            <span>{message}</span>
        </div>
    )
}