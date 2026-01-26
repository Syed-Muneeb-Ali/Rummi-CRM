"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Resolver } from "react-hook-form"
import {
  useForm,
  type FieldValues,
  type SubmitHandler,
  type Path,
  type ControllerRenderProps,
  type ControllerFieldState,
  type UseFormStateReturn,
} from "react-hook-form"
import type { z } from "zod"

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

interface ZodFormProps<TSchema extends z.ZodType<any, any, any>> {
  schema: TSchema
  defaultValues?: Partial<z.infer<TSchema>>
  onSubmit: (values: z.infer<TSchema>) => void
  children: React.ReactNode
  className?: string
}

function ZodForm<TSchema extends z.ZodType<any, any, any>>({
  schema,
  defaultValues,
  onSubmit,
  children,
  className,
}: ZodFormProps<TSchema>) {
  type FormValues = z.infer<TSchema>

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<FormValues>,
    defaultValues: defaultValues as FormValues,
    mode: "onBlur",
  })

  const handleSubmit: SubmitHandler<FormValues> = (values) => {
    onSubmit(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn("space-y-4", className)}
      >
        {children}
      </form>
    </Form>
  )
}

interface ZodFormFieldProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>
  render: (args: {
    field: ControllerRenderProps<TFieldValues, Path<TFieldValues>>
    fieldState: ControllerFieldState
    formState: UseFormStateReturn<TFieldValues>
  }) => React.ReactElement
}

function ZodFormField<TFieldValues extends FieldValues>({
  name,
  render,
}: ZodFormFieldProps<TFieldValues>) {
  return <FormField name={name} render={render} />
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