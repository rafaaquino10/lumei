// Utilitarios para integracao com calendarios

export interface CalendarEvent {
  title: string
  description: string
  startDate: Date
  endDate: Date
  location?: string
}

// Gera arquivo .ics para download
export function generateICS(event: CalendarEvent): string {
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const escapeText = (text: string): string => {
    return text.replace(/[,;\\]/g, '\\$&').replace(/\n/g, '\\n')
  }

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Calcula MEI//calculamei.com.br//PT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@calculamei.com.br`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(event.startDate)}`,
    `DTEND:${formatDate(event.endDate)}`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(event.description)}`,
    event.location ? `LOCATION:${escapeText(event.location)}` : '',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    'DESCRIPTION:Lembrete: DAS vence amanha!',
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT3H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Lembrete: DAS vence em 3 horas!',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n')

  return ics
}

// Gera link para Google Calendar
export function generateGoogleCalendarLink(event: CalendarEvent): string {
  const formatGoogleDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    details: event.description,
    dates: `${formatGoogleDate(event.startDate)}/${formatGoogleDate(event.endDate)}`,
  })

  if (event.location) {
    params.append('location', event.location)
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

// Gera eventos de DAS para o ano
export function generateDASEvents(year: number, valorDAS: number): CalendarEvent[] {
  const events: CalendarEvent[] = []

  for (let month = 0; month < 12; month++) {
    // DAS vence dia 20 do mes seguinte
    const vencimento = new Date(year, month + 1, 20, 23, 59, 59)

    // Se o dia 20 cair em fim de semana, ajusta para segunda
    const dayOfWeek = vencimento.getDay()
    if (dayOfWeek === 0) vencimento.setDate(21) // Domingo -> Segunda
    if (dayOfWeek === 6) vencimento.setDate(22) // Sabado -> Segunda

    const mesRef = new Date(year, month, 1).toLocaleDateString('pt-BR', { month: 'long' })

    events.push({
      title: `DAS MEI - ${mesRef.charAt(0).toUpperCase() + mesRef.slice(1)}/${year}`,
      description: `Vencimento do DAS referente a ${mesRef}/${year}.\n\nValor: R$ ${valorDAS.toFixed(2)}\n\nPague pelo app MEI (gov.br) ou no site do Simples Nacional.\n\nGerado por calculamei.com.br`,
      startDate: new Date(vencimento.getFullYear(), vencimento.getMonth(), vencimento.getDate(), 9, 0, 0),
      endDate: new Date(vencimento.getFullYear(), vencimento.getMonth(), vencimento.getDate(), 10, 0, 0),
      location: 'https://www8.receita.fazenda.gov.br/SimplesNacional/',
    })
  }

  return events
}

// Faz download do arquivo ICS
export function downloadICS(event: CalendarEvent, filename: string): void {
  const ics = generateICS(event)
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.ics`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Gera ICS com todos os DAS do ano
export function downloadAllDASEvents(year: number, valorDAS: number): void {
  const events = generateDASEvents(year, valorDAS)

  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const escapeText = (text: string): string => {
    return text.replace(/[,;\\]/g, '\\$&').replace(/\n/g, '\\n')
  }

  const icsEvents = events.map((event, index) => [
    'BEGIN:VEVENT',
    `UID:das-${year}-${index + 1}@calculamei.com.br`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(event.startDate)}`,
    `DTEND:${formatDate(event.endDate)}`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(event.description)}`,
    event.location ? `LOCATION:${escapeText(event.location)}` : '',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    'DESCRIPTION:Lembrete: DAS vence amanha!',
    'END:VALARM',
    'END:VEVENT',
  ].filter(Boolean).join('\r\n')).join('\r\n')

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Calcula MEI//calculamei.com.br//PT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:DAS MEI ${year}`,
    icsEvents,
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `das-mei-${year}.ics`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
