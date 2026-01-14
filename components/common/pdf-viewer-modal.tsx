 "use client"

 import * as React from "react"
 import dynamic from "next/dynamic"

 import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
 } from "@/components/ui/dialog"

 const Worker = dynamic(
   async () => {
     const mod = await import("@react-pdf-viewer/core")
     return mod.Worker
   },
   { ssr: false },
 )

 const Viewer = dynamic(
   async () => {
     const mod = await import("@react-pdf-viewer/core")
     return mod.Viewer
   },
   { ssr: false },
 )

 const defaultLayoutPluginPromise = import("@react-pdf-viewer/default-layout")

 function PdfViewerModal({
   open,
   onOpenChange,
   url,
   title = "Document preview",
 }: PdfViewerModalProps) {
   const [defaultLayoutPlugin, setDefaultLayoutPlugin] =
     React.useState<any | null>(null)

   React.useEffect(() => {
     defaultLayoutPluginPromise.then(mod => {
       setDefaultLayoutPlugin(mod.defaultLayoutPlugin())
     })
   }, [])

   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="max-w-4xl h-[80vh] flex flex-col gap-3">
         <DialogHeader>
           <DialogTitle className="truncate">{title}</DialogTitle>
         </DialogHeader>
         <div className="flex-1 min-h-0 border rounded-md overflow-hidden bg-muted">
           {url ? (
             <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
               <Viewer
                 fileUrl={url}
                 plugins={defaultLayoutPlugin ? [defaultLayoutPlugin] : []}
               />
             </Worker>
           ) : (
             <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
               No document selected
             </div>
           )}
         </div>
       </DialogContent>
     </Dialog>
   )
 }

 export { PdfViewerModal }

 interface PdfViewerModalProps {
   open: boolean
   onOpenChange: (open: boolean) => void
   url?: string
   title?: string
 }


