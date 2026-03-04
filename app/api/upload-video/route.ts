
import { NextResponse } from "next/server";
import { PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/aws";
import crypto from "crypto";

export const runtime = "nodejs";
export const maxDuration = 60;
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a SHA-256 hash of the buffer to use as the file key
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    const key = `videos/${hash}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`; // sanitize filename just in case

    // Check if the file already exists in S3
    try {
      await s3.send(
        new HeadObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME!,
          Key: key,
        })
      );

      // If no error is thrown, the object exists. Return early to avoid re-uploading.
      console.log(`Video exactly matches existing S3 object: ${key}. Reusing.`);
      return NextResponse.json({ success: true, key });
    } catch (headErr: any) {
      // If error is NotFound, proceed with upload. Otherwise, re-throw.
      if (headErr.name !== "NotFound" && headErr.$metadata?.httpStatusCode !== 404) {
        throw headErr;
      }
    }

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );

    return NextResponse.json({ success: true, key });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}