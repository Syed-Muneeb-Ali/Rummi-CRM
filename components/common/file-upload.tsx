 "use client"

 import * as React from "react"
 import { useCallback } from "react"
 import { useDropzone } from "react-dropzone"

 import { cn } from "@/lib/utils"
 import { Button } from "@/components/ui/button"
 import { Card } from "@/components/ui/card"

 function FileUpload({
   onUpload,
   isUploading,
   accept,
   maxSize,
   multiple = false,
   label = "Upload files",
   helperText,
   className,
 }: FileUploadProps) {
   const handleDrop = useCallback(
     (acceptedFiles: File[]) => {
       if (!acceptedFiles.length || isUploading) return

       onUpload({ files: acceptedFiles })
     },
     [onUpload, isUploading],
   )

   const {
     getRootProps,
     getInputProps,
     isDragActive,
     fileRejections,
     acceptedFiles,
   } = useDropzone({
     onDrop: handleDrop,
     accept,
     multiple,
     maxSize,
   })

   return (
     <div className={cn("space-y-2", className)}>
       <Card
         {...getRootProps()}
         className={cn(
           "flex flex-col items-center justify-center gap-2 border-dashed border-muted-foreground/40 cursor-pointer px-4 py-6 text-center transition-colors",
           isDragActive && "bg-muted/40 border-primary/60",
         )}
       >
         <input {...getInputProps()} />
         <p className="text-sm font-medium">{label}</p>
         <p className="text-muted-foreground text-xs">
           Drag and drop files here, or click to browse
         </p>
         {helperText && (
           <p className="text-muted-foreground text-xs mt-1">{helperText}</p>
         )}
         <Button
           variant="outline"
           size="sm"
           type="button"
           className="mt-2"
           disabled={isUploading}
         >
           {isUploading ? "Uploading..." : "Choose files"}
         </Button>
       </Card>

       {!!acceptedFiles.length && (
         <ul className="text-xs space-y-1">
           {acceptedFiles.map(file => (
             <li
               key={file.name}
               className="flex items-center justify-between gap-2"
             >
               <span className="truncate">{file.name}</span>
               <span className="text-muted-foreground shrink-0">
                 {(file.size / 1024).toFixed(1)} KB
               </span>
             </li>
           ))}
         </ul>
       )}

       {!!fileRejections.length && (
         <ul className="text-destructive text-xs space-y-1">
           {fileRejections.map(rejection => (
             <li key={rejection.file.name}>
               {rejection.file.name}:{" "}
               {rejection.errors.map(error => error.message).join(", ")}
             </li>
           ))}
         </ul>
       )}
     </div>
   )
 }

 export { FileUpload }

 interface FileUploadProps {
   onUpload: ({ files }: { files: File[] }) => void
   isUploading: boolean
   accept?: Record<string, string[]>
   maxSize?: number
   multiple?: boolean
   label?: string
   helperText?: string
   className?: string
 }


