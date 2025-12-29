

import Image from "next/image";
import DirectFrom from "./components/DirectFrom";
import FormList from "./components/FormList";
import prisma from "@/lib/prisma";
import SearchForm from "./components/SearchForm";
import { Prisma } from "./lib/prisma/generated/browser";
import { redirect } from "next/navigation";
import { auth } from "@/auth"

type Props = {
  searchParams: Promise<{
    q?: string;
    page?: string;
    sort?: "new" | "old";
  }>
}

export default async function Home({searchParams}: Props) {

  const session = await auth()

  if(!session) {
    redirect("/api/auth/signin")
  }

  const params = await searchParams
  const page = Number(params.page ?? "1")
  console.log("page:", params.page);

  const take = 5;
  const skip = (page -1) * take

  const q =  params.q ?? "";
  const sort = params.sort ?? "new";

  const orderBy: Prisma.DiaryOrderByWithRelationInput = 
    sort === "old"
    ? { createdAt: "asc"}
    : { createdAt: "desc"}

  const where: Prisma.DiaryWhereInput | undefined = q
    ? {
      OR: [
        { title: {contains: q, mode: "insensitive"}},
        { content: { contains: q, mode: "insensitive"}},
      ],
    }
    : undefined;

  const [ diaries, totalCount ] = await Promise.all([
    prisma.diary.findMany({
      where,
      take,
      skip,
      orderBy,
    }),
    prisma.diary.count({where}),
  ])  

  const totalPages = Math.ceil(totalCount / take)

  return (
    <div>
      <DirectFrom />
      <SearchForm defaultValue={q} />
      <FormList diaries={diaries} query={q ?? ""} page={page} totalPages={totalPages} totalCount={totalCount} sort={sort}/>
    </div>
  );
}
