 "use client"

 import * as React from "react"
 import { zodResolver } from "@hookform/resolvers/zod"
 import {
   FormProvider,
   useForm,
   type DefaultValues,
   type FieldValues,
   type SubmitHandler,
 } from "react-hook-form"
 import type { ZodSchema, ZodTypeDef, TypeOf } from "zod"

 import { cn } from "@/lib/utils"
 import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
 } from "@/components/ui/form"

 function ZodForm<TSchema extends ZodSchema<any, ZodTypeDef, any>>({
   schema,
   defaultValues,
   onSubmit,
   children,
   className,
 }: ZodFormProps<TSchema>) {
   type FormValues = TypeOf<TSchema>

   const methods = useForm<FormValues>({
     resolver: zodResolver(schema),
     defaultValues: defaultValues as DefaultValues<FormValues>,
     mode: "onBlur",
   })

   const handleSubmit: SubmitHandler<FormValues> = values => {
     onSubmit({ values })
   }

   return (
     <FormProvider {...methods}>
       <Form {...methods}>
         <form
           onSubmit={methods.handleSubmit(handleSubmit)}
           className={cn("space-y-4", className)}
         >
           {children}
         </form>
       </Form>
     </FormProvider>
   )
 }

 function ZodFormField<TFieldValues extends FieldValues>({
   name,
   render,
 }: ZodFormFieldProps<TFieldValues>) {
   return (
     <FormField
       name={name}
       render={({ field, fieldState }) =>
         render({ field, fieldState })
       }
     />
   )
 }

 export {
   ZodForm,
   ZodFormField,
   FormItem,
   FormLabel,
   FormControl,
   FormDescription,
   FormMessage,
 }

 interface ZodFormProps<TSchema extends ZodSchema<any, ZodTypeDef, any>> {
   schema: TSchema
   defaultValues?: Partial<TypeOf<TSchema>>
   onSubmit: ({ values }: { values: TypeOf<TSchema> }) => void
   children: React.ReactNode
   className?: string
 }

 interface ZodFormFieldProps<TFieldValues extends FieldValues> {
   name: keyof TFieldValues & string
   render: (args: {
     field: any
     fieldState: {
       invalid: boolean
       isTouched: boolean
       isDirty: boolean
       error: { message?: string } | undefined
     }
   }) => React.ReactNode
 }


