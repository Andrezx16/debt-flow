import type { DebtWithPayments } from '@/types'
import { formatCurrency } from '@/lib/utils'

export function exportToCSV(debt: DebtWithPayments): void {
  const rows = [
    ['DebtFlow — Exportación'],
    [],
    ['Deudor', debt.debtor_name],
    ['Descripción', debt.description ?? ''],
    ['Monto total', debt.total_amount],
    ['Monto pagado', debt.amount_paid],
    ['Saldo restante', debt.remaining],
    ['Porcentaje', `${debt.percentage}%`],
    ['Estado', debt.status],
    ['Fecha creación', debt.created_at.split('T')[0]],
    [],
    ['--- HISTORIAL DE PAGOS ---'],
    ['ID', 'Monto', 'Fecha', 'Estado', 'Comentario'],
    ...debt.payments.map((p) => [p.id, p.amount, p.payment_date, p.status, p.comment ?? '']),
  ]

  const csv = rows
    .map((row) =>
      row.map((cell) => (typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell)).join(',')
    )
    .join('\n')

  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `debtflow_${debt.debtor_name.replace(/\s+/g, '_')}_${Date.now()}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export async function exportToExcel(debt: DebtWithPayments): Promise<void> {
  const { utils, writeFile } = await import('xlsx')

  const wb = utils.book_new()

  // Summary sheet
  const summaryData = [
    ['Campo', 'Valor'],
    ['Deudor', debt.debtor_name],
    ['Descripción', debt.description ?? ''],
    ['Monto Total', debt.total_amount],
    ['Monto Pagado', debt.amount_paid],
    ['Saldo Restante', debt.remaining],
    ['Porcentaje', debt.percentage / 100],
    ['Estado', debt.status],
    ['Fecha Creación', debt.created_at.split('T')[0]],
  ]
  const summarySheet = utils.aoa_to_sheet(summaryData)
  utils.book_append_sheet(wb, summarySheet, 'Resumen')

  // Payments sheet
  const paymentsData = [
    ['ID', 'Monto', 'Fecha', 'Estado', 'Comentario', 'Registrado'],
    ...debt.payments.map((p) => [
      p.id,
      p.amount,
      p.payment_date,
      p.status,
      p.comment ?? '',
      p.created_at.split('T')[0],
    ]),
  ]
  const paymentsSheet = utils.aoa_to_sheet(paymentsData)
  utils.book_append_sheet(wb, paymentsSheet, 'Pagos')

  writeFile(wb, `debtflow_${debt.debtor_name.replace(/\s+/g, '_')}_${Date.now()}.xlsx`)
}

export async function exportToPDF(
  debt: DebtWithPayments,
  elementId: string
): Promise<void> {
  const { default: jsPDF } = await import('jspdf')
  const { default: html2canvas } = await import('html2canvas')

  const element = document.getElementById(elementId)
  if (!element) return

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: null,
    useCORS: true,
  })

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageWidth = pdf.internal.pageSize.getWidth()
  const imgWidth = pageWidth - 20
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight)
  pdf.save(`debtflow_${debt.debtor_name.replace(/\s+/g, '_')}_${Date.now()}.pdf`)
}
