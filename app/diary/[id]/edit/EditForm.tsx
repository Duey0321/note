"use client"

import { useState } from "react"
import { useRouter} from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { updateDiary } from "../../actions"

type Diary = {
    id: number
    title: string
    content: string
    createdAt: Date
}

type Props = {
    diary: Diary
}

export default function EditForm({diary}: Props) {
    const [ title, setTitle] = useState(diary.title)
    const [ content, setContent ] = useState(diary.content)
    const router = useRouter()

    const handleUpdate = async() => {
        try {
            await updateDiary(diary.id, title, content);
            router.push('/')
        } catch(e) {
            alert('更新に失敗しました')
        }
    } 

    return (
        <div className="max-w-xl mx-auto mt-10">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">日記を編集</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">タイトル</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="タイトルを入力"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">内容</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="本文を入力"
              rows={6}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleUpdate} className="px-6">
              更新する
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    )
}