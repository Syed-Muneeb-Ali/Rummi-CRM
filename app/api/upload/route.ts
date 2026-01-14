 import { NextRequest, NextResponse } from "next/server"

 import { uploadToS3 } from "@/lib/s3"

 async function POST(request: NextRequest) {
   const formData = await request.formData()
   const file = formData.get("file")

   if (!file || !(file instanceof Blob)) {
     return NextResponse.json({ error: "File is required" }, { status: 400 })
   }

   const filename = formData.get("filename")

   const key = `uploads/${Date.now()}-${filename || "file"}`

   const arrayBuffer = await file.arrayBuffer()
   const buffer = Buffer.from(arrayBuffer)

   try {
     const url = await uploadToS3({
       file: buffer,
       key,
       contentType: file.type || "application/octet-stream",
     })

     return NextResponse.json({ url })
   } catch (error) {
     console.error("[upload] error", error)
     return NextResponse.json(
       { error: "Failed to upload file" },
       { status: 500 },
     )
   }
 }

 export { POST }


