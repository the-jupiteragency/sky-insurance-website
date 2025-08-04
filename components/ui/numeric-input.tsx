"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface NumericInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value?: number
  onChange?: (value: number | undefined) => void
  min?: number
  max?: number
  step?: number
  allowDecimals?: boolean
  prefix?: string
  suffix?: string
}

const NumericInput = React.forwardRef<HTMLInputElement, NumericInputProps>(
  ({ className, value, onChange, min, max, step = 1, allowDecimals = false, prefix, suffix, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState(
      value ? value.toLocaleString('en-US') : ""
    )

    React.useEffect(() => {
      setDisplayValue(value ? value.toLocaleString('en-US') : "")
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value

      // Remove prefix and suffix for processing
      if (prefix) inputValue = inputValue.replace(prefix, "")
      if (suffix) inputValue = inputValue.replace(suffix, "")

      // Remove commas and any non-numeric characters except decimal point
      const cleanValue = inputValue.replace(/,/g, "")
      let processedValue = cleanValue
      
      if (allowDecimals) {
        processedValue = cleanValue.replace(/[^0-9.]/g, "")
        // Ensure only one decimal point
        const parts = processedValue.split(".")
        if (parts.length > 2) {
          processedValue = parts[0] + "." + parts.slice(1).join("")
        }
      } else {
        processedValue = cleanValue.replace(/[^0-9]/g, "")
      }

      // Format with commas while typing
      const formattedValue = processedValue ? Number(processedValue).toLocaleString('en-US') : ""
      setDisplayValue(formattedValue)

      // Convert to number and validate
      const numericValue = processedValue === "" ? undefined : Number(processedValue)

      if (numericValue !== undefined) {
        if (min !== undefined && numericValue < min) return
        if (max !== undefined && numericValue > max) return
      }

      onChange?.(numericValue)
    }

    const handleBlur = () => {
      if (value !== undefined) {
        let formattedValue = value.toLocaleString('en-US')
        if (prefix || suffix) {
          formattedValue = `${prefix || ""}${formattedValue}${suffix || ""}`
        }
        setDisplayValue(formattedValue)
      }
    }

    const handleFocus = () => {
      setDisplayValue(value?.toString() || "")
    }

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className={cn(className)}
      />
    )
  },
)
NumericInput.displayName = "NumericInput"

export { NumericInput }
