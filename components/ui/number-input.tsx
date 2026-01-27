'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: number
  onChange?: (value: number) => void
  suffix?: string
  decimals?: number
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, value = 0, onChange, suffix, decimals = 2, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState(value.toString())

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/[^0-9.]/g, '')
      const numericValue = parseFloat(rawValue) || 0
      
      setDisplayValue(rawValue)
      onChange?.(Number(numericValue.toFixed(decimals)))
    }

    React.useEffect(() => {
      setDisplayValue(value.toString())
    }, [value])

    return (
      <div className="relative">
        <Input
          ref={ref}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          className={cn('text-right font-mono', suffix && 'pr-12', className)}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
            {suffix}
          </span>
        )}
      </div>
    )
  }
)

NumberInput.displayName = 'NumberInput'
