"use client"
import Image from "next/image";

export default function CoverPhoto({ src, width, height }) {
    return (
        <div className={`w-[${width}px] h-[${height}px] border-1`}>
            <Image src={src} width={width} height={height} alt={"Cover photo"} />
        </div>
    )
}