export type ExcelColumn<T> = {
  header: string
  width: number
  value: (row: T) => string
}

/** Downloads `rows` as a one-sheet workbook named `<filePrefix>-<today>.xlsx`. */
export async function downloadExcel<T>(filePrefix: string, columns: ExcelColumn<T>[], rows: T[]) {
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
    ...columns.map((col, i) => ({ header: col.header, key: `c${i}`, width: col.width })),
  ]

  rows.forEach((row, i) => {
    sheet.addRow({ index: i + 1, ...Object.fromEntries(columns.map((col, c) => [`c${c}`, col.value(row)])) })
  })

  const header = sheet.getRow(1)
  header.font = { bold: true, color: { argb: 'FFFFFFFF' } }
  header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF042A35' } }
  header.alignment = { vertical: 'middle' }
  header.height = 22
  sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: columns.length + 1 } }

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filePrefix}-${new Date().toISOString().slice(0, 10)}.xlsx`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
