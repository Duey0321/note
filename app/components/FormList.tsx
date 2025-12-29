"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { deleteDiary } from "../diary/actions";

type Diary = {
  id: number;
  title: string;
  content: string;
  page?: number;
};

type Props = {
  diaries: Diary[];
  query: string;
  page: number;
  totalPages: number;
  totalCount: number;
  sort: "new" | "old";
};

export default function FormList({
  diaries,
  query,
  page,
  totalPages,
  totalCount,
  sort,
}: Props) {
  function highlightText(text: string, query: string) {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");

    return text.split(regex).map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-yellow-300 text-black rounded px-1">
          {part}
        </mark>
      ) : (
        part
      )
    );
  }
  const router = useRouter();

  const handleDelete = async (id: number) => {
    try {
      await deleteDiary(id);
    } catch (e) {
      alert("削除に失敗しました");
    }
  };

  function createPageNumbers(current: number, total: number) {
    const pages:number[] = []
    for(let i=1; i<=total; i++) {
      pages.push(i)
    }

    return pages
  }

  return (
    <div>
      <div className="grid gap-4">
        {diaries.map((diary) => (
          <div
            key={diary.id}
            className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <h2 className="text-lg font-semibold">
              {highlightText(diary.title, query)}
            </h2>

            <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
              {highlightText(diary.content, query)}
            </p>

            <div className="mt-4 flex justify-end gap-2">
              <Link href={`/diary/${diary.id}/edit`}>
                <Button variant="outline" size="sm">
                  編集
                </Button>
              </Link>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(diary.id)}
              >
                削除
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-6 justify-center mt-10 hover:color-red-500">
        <Button disabled={page <= 1}>
          <Link href={`/?q=${query}&sort=${sort}&page=${page - 1}`}>前へ</Link>
        </Button>

        <span>
          {page} / {totalPages}
        </span>
        <Button disabled={page >= totalPages}>
          <Link href={`/?q=${query}&sort=${sort}&page=${page + 1}`}>次へ</Link>
        </Button>
        <span>{totalCount}</span>
      </div>

      <div className="flex justify-center mt-5 mb-10">
        <Link href={`/?sort=new`}>
          <Button>新しい順</Button>
        </Link>
        <Link href={`/?sort=old`}>
          <Button>古い順</Button>
        </Link>
      </div>

      <div>
        {/*前へ */}
        <Button variant="outline" disabled={page <= 1}>
          <Link href={`/?q=${query}&page=${page - 1}`}>前へ</Link>
        </Button>

        {/*ページ番号 */}
        {createPageNumbers(page, totalPages).map((p) => (
          <Link key={p} href={`/?query=${query}&page=${p}`}>
            <Button
              variant={p === page ? "default": "outline"}
              className={p === page ? "font-bold": ""}
            >{p}</Button>
          </Link>
        ))}

        {/*次へ */}
        <Button
          variant="outline"
          disabled={page >= totalPages}
        >
          <Link href={`/?q=${query}&page=${page + 1}`}>次へ</Link>
        </Button>
      </div>
    </div>
  );
}
