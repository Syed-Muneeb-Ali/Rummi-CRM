 import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
 import type { PutObjectCommandInput } from "@aws-sdk/client-s3"

 const S3_REGION = process.env.AWS_S3_REGION
 const S3_BUCKET = process.env.AWS_S3_BUCKET

 if (!S3_REGION || !S3_BUCKET) {
   console.warn(
     "[s3] AWS_S3_REGION and AWS_S3_BUCKET must be set for uploads to work",
   )
 }

 const s3Client =
   S3_REGION && S3_BUCKET
     ? new S3Client({
         region: S3_REGION,
         credentials: {
           accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
           secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
         },
       })
     : undefined

 async function uploadToS3({
   file,
   key,
   contentType,
 }: UploadToS3Args): Promise<string> {
   if (!s3Client || !S3_BUCKET) {
     throw new Error("S3 client is not configured")
   }

   const params: PutObjectCommandInput = {
     Bucket: S3_BUCKET,
     Key: key,
     Body: file,
     ContentType: contentType,
   }

   const command = new PutObjectCommand(params)
   await s3Client.send(command)

   return `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`
 }

 export { uploadToS3, S3_BUCKET, S3_REGION }

 interface UploadToS3Args {
   file: Buffer | Uint8Array | Blob | string
   key: string
   contentType: string
 }


