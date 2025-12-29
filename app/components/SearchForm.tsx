"use client"

import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { useRouter } from "next/navigation";


type Props = {
    defaultValue: string
}

export default function SearchForm({defaultValue}: Props) {
    const [q, setQ] = useState<string>(defaultValue)
    const router = useRouter();

    const handleSearch = () => {
        const params = q ? `?q=${encodeURIComponent(q)}`: "";
        router.push(`/${params}`);
    }

    

  return (
    <div className='flex gap-3'>
        <input 
        placeholder="キーワード検索"
        value={q}
        onChange={(e)=> setQ(e.target.value)}
        />
        <Button onClick={handleSearch}>検索</Button>

    </div>
  )
}
