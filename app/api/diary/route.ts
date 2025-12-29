import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import {auth} from "@/auth"


export async function POST (req: Request) {
    const session = await auth()
    if(!session) {
        throw new Error("未ログイン")
    } 

    const { title, content } = await req.json()
    const diary = await prisma.diary.create({
        data: {
            title, content,userId: session.user.id
        }
    })
    return NextResponse.json(diary)
}

export async function GET() {

    try {
        const diaries =  await prisma.diary.findMany()
        where: {
            userId: sessionStorage.user.id
        }
        return NextResponse.json(diaries)
    } catch(error) {
        console.error(error);
        return new NextResponse("Server Error", { status: 500})
    }
}