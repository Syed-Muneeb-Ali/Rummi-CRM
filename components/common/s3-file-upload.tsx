 "use client"

 import * as React from "react"
 import { useState } from "react"

 import { FileUpload } from "@/components/common/file-upload"

 function S3FileUpload({
   onUploaded,
   accept,
   maxSize,
   multiple = false,
   label,
   helperText,
 }: S3FileUploadProps) {
   const [isUploading, setIsUploading] = useState(false)

   async function handleUpload({ files }: { files: File[] }) {
     if (!files.length) return

     setIsUploading(true)

     const uploadedUrls: string[] = []

     try {
       for (const file of files) {
         const formData = new FormData()
         formData.set("file", file)
         formData.set("filename", file.name)

         const response = await fetch("/api/upload", {
           method: "POST",
           body: formData,
         })

         if (!response.ok) {
           continue
         }

         const json = (await response.json()) as { url?: string }
         if (json.url) {
           uploadedUrls.push(json.url)
         }
       }

       if (uploadedUrls.length) {
         onUploaded({ urls: uploadedUrls })
       }
     } finally {
       setIsUploading(false)
     }
   }

   return (
     <FileUpload
       onUpload={handleUpload}
       isUploading={isUploading}
       accept={accept}
       maxSize={maxSize}
       multiple={multiple}
       label={label}
       helperText={helperText}
     />
   )
 }

 export { S3FileUpload }

 interface S3FileUploadProps {
   onUploaded: ({ urls }: { urls: string[] }) => void
   accept?: Record<string, string[]>
   maxSize?: number
   multiple?: boolean
   label?: string
   helperText?: string
 }


