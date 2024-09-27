export const formatDateTime = (date: Date) =>
  `${date.toLocaleDateString()} ${date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`

export const formatISODateTime = (value: string | Date) => {
  const date = new Date(value)
  return formatDateTime(date)
}
