'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Calendar, Download, ExternalLink } from 'lucide-react'
import {
  CalendarEvent,
  generateGoogleCalendarLink,
  downloadICS,
  downloadAllDASEvents,
} from '@/lib/calendar'

interface AddToCalendarProps {
  event?: CalendarEvent
  allDAS?: {
    year: number
    valorDAS: number
  }
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function AddToCalendar({ event, allDAS, variant = 'outline', size = 'sm' }: AddToCalendarProps) {
  const [open, setOpen] = useState(false)

  const handleGoogleCalendar = () => {
    if (event) {
      const link = generateGoogleCalendarLink(event)
      window.open(link, '_blank')
    }
    setOpen(false)
  }

  const handleDownloadICS = () => {
    if (event) {
      downloadICS(event, 'das-mei')
    }
    setOpen(false)
  }

  const handleDownloadAllDAS = () => {
    if (allDAS) {
      downloadAllDASEvents(allDAS.year, allDAS.valorDAS)
    }
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Calendar className="w-4 h-4" />
          Adicionar ao Calendario
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {event && (
          <>
            <DropdownMenuItem onClick={handleGoogleCalendar}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Google Calendar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownloadICS}>
              <Download className="w-4 h-4 mr-2" />
              Baixar .ics (Apple/Outlook)
            </DropdownMenuItem>
          </>
        )}
        {allDAS && (
          <DropdownMenuItem onClick={handleDownloadAllDAS}>
            <Download className="w-4 h-4 mr-2" />
            Baixar todos DAS de {allDAS.year}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
