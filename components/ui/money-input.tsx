'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import currency from 'currency.js'

export interface MoneyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: number
  onChange?: (value: number) => void
}

const BRL = (value: currency.Any) =>
  currency(value, { symbol: 'R$ ', decimal: ',', separator: '.' })

export const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ className, value = 0, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState(
      BRL(value).format()
    )

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/[^0-9]/g, '')
      const numericValue = Number(rawValue) / 100
      
      setDisplayValue(BRL(numericValue).format())
      onChange?.(numericValue)
    }

    React.useEffect(() => {
      setDisplayValue(BRL(value).format())
    }, [value])

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        className={cn('text-right font-mono', className)}
        {...props}
      />
    )
  }
)

MoneyInput.displayName = 'MoneyInput'
