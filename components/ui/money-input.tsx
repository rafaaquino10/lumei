'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface MoneyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: number
  onChange?: (value: number) => void
}

/**
 * Formata um número para exibição em BRL (ex: 1234.56 → "1.234,56")
 */
function formatBRL(value: number): string {
  if (value === 0) return ''
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/**
 * Converte string de dígitos para valor numérico
 * Ex: "12345" → 123.45 (divide por 100 para centavos)
 */
function parseDigitsToNumber(digits: string): number {
  if (!digits || digits === '0' || digits === '00') return 0
  const num = parseInt(digits, 10)
  return num / 100
}

export const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ className, value = 0, onChange, onFocus, onBlur, disabled, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [internalValue, setInternalValue] = React.useState('')
    const inputRef = React.useRef<HTMLInputElement>(null)

    // Sync internal value when external value changes
    React.useEffect(() => {
      if (!isFocused) {
        setInternalValue(formatBRL(value))
      }
    }, [value, isFocused])

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      // Se valor é 0, limpa para facilitar digitação
      if (value === 0) {
        setInternalValue('')
      }
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      // Ao sair, formata o valor atual
      setInternalValue(formatBRL(value))
      onBlur?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value

      // Remove tudo que não é dígito
      const digits = inputValue.replace(/\D/g, '')

      // Converte para número (centavos)
      const numericValue = parseDigitsToNumber(digits)

      // Formata para exibição
      const formatted = formatBRL(numericValue)
      setInternalValue(formatted)

      // Notifica o parent
      onChange?.(numericValue)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Permite: backspace, delete, tab, escape, enter, setas
      const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End']
      if (allowedKeys.includes(e.key)) {
        return
      }

      // Permite Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      if (e.ctrlKey || e.metaKey) {
        return
      }

      // Bloqueia qualquer tecla que não seja número
      if (!/^\d$/.test(e.key)) {
        e.preventDefault()
      }
    }

    // Combine refs
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

    const displayValue = internalValue || (isFocused ? '' : '')
    const showPlaceholder = !isFocused && value === 0

    return (
      <div className={cn('relative flex items-center', disabled && 'opacity-50')}>
        {/* Prefixo R$ fixo */}
        <span
          className={cn(
            'pointer-events-none absolute left-3 select-none font-mono text-base',
            showPlaceholder ? 'text-gray-400' : 'text-gray-700'
          )}
        >
          R$
        </span>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="0,00"
          className={cn(
            // Base styles
            'flex h-10 w-full rounded-md border border-gray-200 bg-white py-2 text-base transition-colors',
            // Padding: espaço para o "R$" à esquerda
            'pl-10 pr-3',
            // Text alignment e font
            'text-right font-mono',
            // Placeholder
            'placeholder:text-gray-400',
            // Focus states
            'focus:border-lumei-500 focus:outline-none focus:ring-2 focus:ring-lumei-500/20',
            // Disabled
            'disabled:cursor-not-allowed disabled:bg-gray-50',
            // Error state (via aria-invalid)
            'aria-invalid:border-red-500 aria-invalid:focus:ring-red-500/20',
            className
          )}
          {...props}
        />
      </div>
    )
  }
)

MoneyInput.displayName = 'MoneyInput'
