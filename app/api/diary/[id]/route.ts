import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function DELETE(req: Request, context: {params: Promise<{id: string}>}) {
    const { id } = await context.params
    const diaryId = Number(id)

    if(!id) {
        return NextResponse.json({ error: "Invalid ID"}, {status: 400})
    }

    try {
        const deleted = await prisma.diary.delete({
            where: { id: diaryId}
        })

        return NextResponse.json(deleted)
    } catch(error) {
        return NextResponse.json({error: "削除できません"}, { status: 500})
    }
}

