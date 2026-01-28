"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useForm,
  UseFormReturn,
  FieldValues,
  Path,
  PathValue,
  ControllerRenderProps,
  DefaultValues,
  Resolver,
} from "react-hook-form"
import { z } from "zod"

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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

// Field configuration types
type FieldType = 
  | "text" 
  | "email" 
  | "password" 
  | "number" 
  | "tel" 
  | "date" 
  | "datetime-local"
  | "textarea" 
  | "select" 
  | "checkbox"
  | "hidden"
  | "custom"

interface SelectOption {
  label: string
  value: string
}

interface BaseFieldConfig {
  type?: FieldType
  label?: string
  placeholder?: string
  description?: string
  disabled?: boolean
  hidden?: boolean
  className?: string
  colSpan?: 1 | 2 | 3 | 4
  showIf?: (values: Record<string, unknown>) => boolean
}

interface TextFieldConfig extends BaseFieldConfig {
  type?: "text" | "email" | "password" | "tel" | "date" | "datetime-local"
  maxLength?: number
  minLength?: number
}

interface NumberFieldConfig extends BaseFieldConfig {
  type: "number"
  min?: number
  max?: number
  step?: number
}

interface TextareaFieldConfig extends BaseFieldConfig {
  type: "textarea"
  rows?: number
}

interface SelectFieldConfig extends BaseFieldConfig {
  type: "select"
  options: SelectOption[] | (() => SelectOption[])
}

interface CheckboxFieldConfig extends BaseFieldConfig {
  type: "checkbox"
}

interface CustomFieldConfig extends BaseFieldConfig {
  type: "custom"
  render: (props: {
    field: ControllerRenderProps<FieldValues, string>
    error?: string
    form: UseFormReturn<FieldValues>
  }) => React.ReactNode
}

type FieldConfig = 
  | TextFieldConfig 
  | NumberFieldConfig 
  | TextareaFieldConfig 
  | SelectFieldConfig 
  | CheckboxFieldConfig
  | CustomFieldConfig

type FieldsConfig<T> = {
  [K in keyof T]?: FieldConfig
}

// Ref type for external form control
interface ZodFormRef<TFormValues extends FieldValues> {
  reset: (values?: Partial<TFormValues>) => void
  setError: (name: Path<TFormValues> | "root", error: { type?: string; message: string }) => void
  clearErrors: (name?: Path<TFormValues> | "root") => void
  setValue: <K extends Path<TFormValues>>(name: K, value: PathValue<TFormValues, K>) => void
  getValues: () => TFormValues
  trigger: (name?: Path<TFormValues>) => Promise<boolean>
  formState: UseFormReturn<TFormValues>["formState"]
  form: UseFormReturn<TFormValues>
}

// Props for ZodForm
interface ZodFormProps<TFormValues extends FieldValues> {
  schema: z.ZodType<TFormValues>
  defaultValues?: Partial<TFormValues>
  onSubmit: (values: TFormValues) => void | Promise<void>
  fields?: FieldsConfig<TFormValues>
  children?: React.ReactNode | ((form: UseFormReturn<TFormValues>) => React.ReactNode)
  className?: string
  formRef?: React.RefObject<ZodFormRef<TFormValues> | null>
  submitText?: string
  cancelText?: string
  onCancel?: () => void
  isSubmitting?: boolean
  showSubmitButton?: boolean
  showCancelButton?: boolean
  layout?: "vertical" | "grid"
  gridCols?: 1 | 2 | 3 | 4
  gap?: "sm" | "md" | "lg"
}

// Helper to generate label from field name
function generateLabel(name: string): string {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .replace(/Id$/, "")
    .trim()
}

// Helper to get the inner schema (unwrap optional/nullable/default)
function getInnerSchema(schema: z.ZodTypeAny): z.ZodTypeAny {
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    return getInnerSchema((schema as z.ZodOptional<z.ZodTypeAny>).unwrap() as z.ZodTypeAny)
  }
  if (schema instanceof z.ZodDefault) {
    return getInnerSchema((schema as z.ZodDefault<z.ZodTypeAny>).removeDefault() as z.ZodTypeAny)
  }
  return schema
}

// Helper to infer field type from Zod schema
function inferFieldType(schema: z.ZodTypeAny, fieldName: string): FieldType {
  const inner = getInnerSchema(schema)

  if (inner instanceof z.ZodNumber) return "number"
  if (inner instanceof z.ZodBoolean) return "checkbox"
  if (inner instanceof z.ZodEnum) return "select"
  if (inner instanceof z.ZodString) {
    if (fieldName.toLowerCase().includes("email")) return "email"
    if (fieldName.toLowerCase().includes("password")) return "password"
    if (fieldName.toLowerCase().includes("phone") || fieldName.toLowerCase().includes("tel")) return "tel"
    if (fieldName.toLowerCase().includes("date")) return "date"
    if (fieldName.toLowerCase().includes("description") || fieldName.toLowerCase().includes("notes") || fieldName.toLowerCase().includes("message")) return "textarea"
    return "text"
  }

  return "text"
}

// Helper to get enum options from Zod schema
function getEnumOptions(schema: z.ZodTypeAny): SelectOption[] {
  const inner = getInnerSchema(schema)

  if (inner instanceof z.ZodEnum) {
    const values = inner.options as string[]
    return values.map((value: string) => ({
      label: value.charAt(0).toUpperCase() + value.slice(1),
      value,
    }))
  }

  return []
}

// Check if schema field is optional
function isFieldOptional(schema: z.ZodTypeAny): boolean {
  return schema instanceof z.ZodOptional || schema.isOptional()
}

// Main ZodForm component
function ZodForm<TFormValues extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  fields = {} as FieldsConfig<TFormValues>,
  children,
  className,
  formRef,
  submitText = "Submit",
  cancelText = "Cancel",
  onCancel,
  isSubmitting: externalIsSubmitting,
  showSubmitButton = true,
  showCancelButton = false,
  layout = "vertical",
  gridCols = 1,
  gap = "md",
}: ZodFormProps<TFormValues>) {
  const form = useForm<TFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any) as Resolver<TFormValues>,
    defaultValues: defaultValues as DefaultValues<TFormValues>,
    mode: "onBlur",
  })

  const [internalSubmitting, setInternalSubmitting] = React.useState(false)
  const isSubmitting = externalIsSubmitting ?? internalSubmitting

  // Expose form methods via ref
  React.useImperativeHandle(formRef, () => ({
    reset: (values?: Partial<TFormValues>) => {
      if (values) {
        form.reset(values as TFormValues)
      } else {
        form.reset()
      }
    },
    setError: (name, error) => {
      form.setError(name as Path<TFormValues>, {
        type: error.type || "manual",
        message: error.message,
      })
    },
    clearErrors: (name) => {
      if (name) {
        form.clearErrors(name as Path<TFormValues>)
      } else {
        form.clearErrors()
      }
    },
    setValue: (name, value) => {
      form.setValue(name, value)
    },
    getValues: () => form.getValues(),
    trigger: async (name) => {
      if (name) {
        return form.trigger(name)
      }
      return form.trigger()
    },
    formState: form.formState,
    form: form as UseFormReturn<TFormValues>,
  }))

  const handleSubmit = async (values: TFormValues) => {
    try {
      setInternalSubmitting(true)
      await onSubmit(values)
    } finally {
      setInternalSubmitting(false)
    }
  }

  // Get schema shape for auto-generating fields
  const schemaShape = schema instanceof z.ZodObject 
    ? (schema as z.ZodObject<z.ZodRawShape>).shape 
    : {}
  const fieldNames = Object.keys(schemaShape) as Array<keyof TFormValues & string>

  // Gap classes
  const gapClass = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  }[gap]

  // Grid column classes
  const gridColClass = {
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  }[gridCols]

  // Render a single field
  const renderField = (name: keyof TFormValues & string) => {
    const fieldConfig = fields[name] || {}
    const fieldSchema = schemaShape[name] as z.ZodTypeAny | undefined

    if (!fieldSchema) return null
    if (fieldConfig.hidden) return null

    // Check conditional rendering
    if (fieldConfig.showIf && !fieldConfig.showIf(form.watch() as Record<string, unknown>)) {
      return null
    }

    const fieldType = fieldConfig.type || inferFieldType(fieldSchema, name)
    const label = fieldConfig.label || generateLabel(name)
    const isRequired = !isFieldOptional(fieldSchema)

    // Col span class - use explicit classes for Tailwind to detect them
    const colSpanClasses = {
      1: "md:col-span-1",
      2: "md:col-span-2",
      3: "md:col-span-3",
      4: "md:col-span-4",
    } as const
    const colSpanClass = fieldConfig.colSpan ? colSpanClasses[fieldConfig.colSpan] : ""

    return (
      <FormField
        key={name}
        control={form.control}
        name={name as Path<TFormValues>}
        render={({ field, fieldState }) => {
          // Custom render
          if (fieldType === "custom" && "render" in fieldConfig) {
            return (
              <FormItem className={cn(fieldConfig.className, colSpanClass)}>
                {(fieldConfig as CustomFieldConfig).render({
                  field: field as ControllerRenderProps<FieldValues, string>,
                  error: fieldState.error?.message,
                  form: form as unknown as UseFormReturn<FieldValues>,
                })}
              </FormItem>
            )
          }

          return (
            <FormItem className={cn(fieldConfig.className, colSpanClass)}>
              {fieldType !== "checkbox" && fieldType !== "hidden" && (
                <FormLabel>
                  {label}
                  {isRequired && <span className="text-destructive ml-1">*</span>}
                </FormLabel>
              )}
              <FormControl>
                {renderFieldInput(field, fieldType, fieldConfig, fieldSchema)}
              </FormControl>
              {fieldConfig.description && (
                <FormDescription>{fieldConfig.description}</FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )
        }}
      />
    )
  }

  // Render the appropriate input based on field type
  const renderFieldInput = (
    field: ControllerRenderProps<TFormValues, Path<TFormValues>>,
    fieldType: FieldType,
    config: FieldConfig,
    fieldSchema: z.ZodTypeAny
  ) => {
    const baseProps = {
      disabled: config.disabled || isSubmitting,
      placeholder: config.placeholder,
    }

    switch (fieldType) {
      case "textarea":
        return (
          <Textarea
            {...field}
            {...baseProps}
            rows={(config as TextareaFieldConfig).rows || 3}
            value={(field.value as string) || ""}
          />
        )

      case "select": {
        const selectConfig = config as SelectFieldConfig
        const options = typeof selectConfig.options === "function" 
          ? selectConfig.options() 
          : selectConfig.options || getEnumOptions(fieldSchema)
        
        return (
          <Select
            onValueChange={field.onChange}
            value={(field.value as string) || ""}
            disabled={baseProps.disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder={baseProps.placeholder || `Select ${config.label || "option"}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      }

      case "checkbox": {
        const checkboxLabel = config.label || generateLabel(field.name)
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={(field.value as boolean) || false}
              onCheckedChange={field.onChange}
              disabled={baseProps.disabled}
            />
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {checkboxLabel}
            </label>
          </div>
        )
      }

      case "number": {
        const numConfig = config as NumberFieldConfig
        return (
          <Input
            {...baseProps}
            type="number"
            min={numConfig.min}
            max={numConfig.max}
            step={numConfig.step}
            value={(field.value as number) ?? ""}
            onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
            onBlur={field.onBlur}
            name={field.name}
            ref={field.ref}
          />
        )
      }

      case "hidden":
        return <input type="hidden" name={field.name} value={(field.value as string) || ""} ref={field.ref} />

      case "date":
      case "datetime-local":
        return (
          <Input
            {...field}
            {...baseProps}
            type={fieldType}
            value={(field.value as string) || ""}
          />
        )

      default: {
        const textConfig = config as TextFieldConfig
        return (
          <Input
            {...field}
            {...baseProps}
            type={fieldType}
            maxLength={textConfig.maxLength}
            value={(field.value as string) || ""}
          />
        )
      }
    }
  }

  const hasFields = fieldNames.length > 0

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn("space-y-6", className)}
      >
        {/* Auto-generated fields - always render if fields exist */}
        {hasFields && (
          <div className={layout === "grid" ? `grid grid-cols-1 ${gridColClass} ${gapClass}` : "space-y-4"}>
            {fieldNames.map(renderField)}
          </div>
        )}

        {/* Children - rendered after auto-generated fields */}
        {typeof children === "function" ? children(form as UseFormReturn<TFormValues>) : children}

        {/* Root error message */}
        {form.formState.errors.root && (
          <div className="text-sm text-destructive">
            {form.formState.errors.root.message}
          </div>
        )}

        {/* Action buttons */}
        {(showSubmitButton || showCancelButton) && (
          <div className="flex justify-end gap-2 pt-4">
            {showCancelButton && onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                {cancelText}
              </Button>
            )}
            {showSubmitButton && (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : submitText}
              </Button>
            )}
          </div>
        )}
      </form>
    </Form>
  )
}

// Hook for using ZodForm ref
function useZodFormRef<TFormValues extends FieldValues>() {
  return React.useRef<ZodFormRef<TFormValues>>(null)
}

// Export everything
export {
  ZodForm,
  useZodFormRef,
  type ZodFormRef,
  type ZodFormProps,
  type FieldConfig,
  type FieldsConfig,
  type SelectOption,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
}
