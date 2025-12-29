"use client"

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession} from "next-auth/react"

export default function LoginButton() {
    const { data: session} = useSession();

    if(session ) {
        return (
            <Button onClick={()=> signOut()}>
                ログアウト
            </Button>
        )
    }

    return (
        <Button onClick={()=> signIn("github")}>
            GitHubでログイン
        </Button>
    )





}