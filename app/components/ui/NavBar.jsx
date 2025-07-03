import Link from "next/link";

export default function NavBar() {
    return (
        <div>
            <ul className={"h-[20px] list-none flex flex-row items-center gap-5"}>
                <li><Link href="/" title="Latest">Latest</Link></li>
                <li><Link href="/search" title="Search">Search</Link></li>
            </ul>
        </div>
    )
}