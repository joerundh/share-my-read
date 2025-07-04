"use client"
import { useUser, SignedIn, SignedOut, SignUpButton, SignInButton, SignOutButton } from "@clerk/nextjs";

export default function LoginBar() {
    const { user } = useUser();

    return (
        <div className={"flex flex-row justify-between items-center gap-5"}>
            <SignedIn>
                <p>Logged in as <b>{user?.firstName || user?.username}</b></p>
                <SignOutButton className={"cursor-pointer"} title={"Sign out"} />
            </SignedIn>
            <SignedOut>
                <SignInButton className={""} title={""}></SignInButton>
                <SignUpButton className={""} title={""}></SignUpButton>
            </SignedOut>
        </div>
    )
}