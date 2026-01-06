import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
})

const BUCKET_NAME = process.env.R2_BUCKET_NAME || "cafe"
const PUBLIC_URL = process.env.R2_PUBLIC_URL || ""

export async function uploadToR2(file: File, key: string): Promise<string> {
  try {
    const buffer = await file.arrayBuffer()

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: Buffer.from(buffer),
      ContentType: file.type,
    })

    await r2Client.send(command)

    return `${PUBLIC_URL}/${key}`
  } catch (error) {
    console.error("[v0] Error uploading to R2:", error)
    throw new Error("Failed to upload image")
  }
}

export async function deleteFromR2(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    await r2Client.send(command)
  } catch (error) {
    console.error("[v0] Error deleting from R2:", error)
    throw new Error("Failed to delete image")
  }
}

export function generateImageKey(folder: string, filename: string): string {
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 9)
  const ext = filename.split(".").pop()
  return `${folder}/${timestamp}-${randomStr}.${ext}`
}
