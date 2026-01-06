import { NextResponse } from "next/server"
import { uploadToR2, generateImageKey } from "@/lib/r2-storage"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = formData.get("folder") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const key = generateImageKey(folder, file.name)
    const url = await uploadToR2(file, key)

    return NextResponse.json({ url })
  } catch (error) {
    console.error("[v0] Error uploading image:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}
