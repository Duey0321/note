"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { createDiary } from "../diary/actions";

export default function DirectFrom() {
  



  return (
    <form action={createDiary} className="flex w-full max-w-sm items-center gap-2">
      <Input name="title" type="text"/>
      <Input name="content" type="text" />
      <Button variant="outline">Submit</Button>
    </form>
  )
}
