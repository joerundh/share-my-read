import Link from "next/link";

export default function NavBar() {
    return (
        <div>
            <ul className={"list-none flex flex-row justify-between align-center gap-5"}>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/search">Search</Link></li>
            </ul>
        </div>
    )
}