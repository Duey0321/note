// ❌ "use client" ← 絶対に書かない

import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import EditForm from "./EditForm";
import { auth } from "@/auth";

export default async function EditPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth()
  if(!session?.user?.id) {
    notFound()
  }
  const  { id } = await params

  

  if (Number.isNaN(id)) {
    throw new Error("Invalid id");
  }

  const diary = await prisma.diary.findFirst({
    where: { id: Number(id),
      userId: session.user.id,
     },
  });

  if (!diary) notFound();

  return <div><EditForm diary={diary}/></div>;
}
