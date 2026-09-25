import type { PublicRegistration } from './supabase'

export async function downloadRegistrationsExcel(rows: PublicRegistration[]) {
  // Loaded on demand so ExcelJS stays out of the main bundle
  const { default: ExcelJS } = await import('exceljs')

  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'AIC Pastors Conference'
  workbook.created = new Date()

  const sheet = workbook.addWorksheet('Registrations', {
    views: [{ state: 'frozen', ySplit: 1 }],
  })

  sheet.columns = [
    { header: '#', key: 'index', width: 6 },
    { header: 'Full Name', key: 'name', width: 36 },
    { header: 'Email', key: 'email', width: 40 },
    { header: 'M-Pesa Code', key: 'mpesa_code', width: 18 },
  ]

  rows.forEach((row, i) => {
    sheet.addRow({
      index: i + 1,
      name: row.name.replace(/\s+/g, ' ').trim(),
      email: row.email.trim(),
      mpesa_code: row.mpesa_code.trim().toUpperCase(),
    })
  })

  const header = sheet.getRow(1)
  header.font = { bold: true, color: { argb: 'FFFFFFFF' } }
  header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF042A35' } }
  header.alignment = { vertical: 'middle' }
  header.height = 22
  sheet.autoFilter = { from: 'A1', to: 'D1' }

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `registrations-${new Date().toISOString().slice(0, 10)}.xlsx`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
