"use server"

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth"
import { redirect } from "next/navigation";

export async function updateDiary(
    id: number,
    title: string,
    content: string,
) {

    const session = await auth()
    if(!session) {
        throw new Error("Unauthorized")
    }


    const updated = await prisma.diary.updateMany({
        where: {
            id,
            userId: session.user.id, 
        },
        data: {
            content, title
        }
    });

    if(updated.count === 0) {
        throw new Error("Forbidden")
    }

    return updated

    revalidatePath('/');
}

export async function deleteDiary(
    id: number
) {
    await prisma.diary.delete({
        where: {id}
    });
    revalidatePath("/")
}

export async function createDiary(
    formData: FormData
) {
    const session = await auth()
    console.log("ACTION SESSION", session);
    if(!session) {
        redirect("/api/auth/signin");
        throw  new Error("Unauthorized")
    }

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    //diary作成
    await prisma.diary.create({
        data: {
            title,
        content,
        userId: session.user.id
        }
        
    })
}