import { AlertCircle, ArrowLeft, ChevronLeft, ChevronRight, Download, Loader2, RefreshCw, Search } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { downloadRegistrationsExcel } from '@/lib/exportExcel'
import { fetchRegistrations, type PublicRegistration } from '@/lib/supabase'

const PAGE_SIZES = [10, 20, 50, 100]

export default function Registrations() {
  const [rows, setRows] = useState<PublicRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])

  const request = useCallback(
    () =>
      fetchRegistrations()
        .then((data) => {
          setRows(data)
          setError('')
        })
        .catch((err: Error) => setError(err.message ?? 'Failed to load registrations.'))
        .finally(() => setLoading(false)),
    [],
  )

  function load() {
    setLoading(true)
    request()
  }

  useEffect(() => {
    request()
  }, [request])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) =>
      [r.name, r.email, r.mpesa_code].some((v) => v.toLowerCase().includes(q)),
    )
  }, [rows, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * pageSize
  const pageRows = filtered.slice(pageStart, pageStart + pageSize)

  async function handleDownload() {
    setDownloading(true)
    try {
      await downloadRegistrationsExcel(filtered)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <main className="min-h-screen bg-brand-cream text-stone-900">
      <header className="border-b border-brand-green/12 bg-brand-dark text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 lg:px-8">
          <Link to="/" className="flex items-center rounded-md bg-white p-1">
            <img className="w-44 sm:w-60" src="/aic-logo.png" alt="AIC Pastors Conference" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-white/80 transition hover:text-white"
          >
            <ArrowLeft size={16} /> Back to site
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-green">Conference</p>
        <h1 className="mt-2 text-3xl font-extrabold text-brand-dark lg:text-4xl">Registrations</h1>

        <Card className="mt-8">
          <CardHeader className="gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-lg text-brand-dark">All registrations</CardTitle>
              <CardDescription className="mt-1">
                {loading ? 'Loading registrations…' : `Showing ${pageRows.length} of ${filtered.length}`}
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative sm:w-64">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setPage(1)
                  }}
                  placeholder="Search name, email, code"
                  className="pl-9"
                  disabled={loading}
                />
              </div>
              <Button variant="outline" onClick={load} disabled={loading}>
                <RefreshCw className={loading ? 'animate-spin' : undefined} />
                Refresh
              </Button>
              <Button onClick={handleDownload} disabled={loading || downloading || filtered.length === 0}>
                {downloading ? <Loader2 className="animate-spin" /> : <Download />}
                Download Excel
              </Button>
            </div>
          </CardHeader>

          <CardContent className="px-0">
            {error ? (
              <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
                <AlertCircle className="size-8 text-brand-red" />
                <p className="font-semibold text-brand-dark">Couldn&apos;t load registrations</p>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button variant="secondary" size="sm" onClick={load}>
                  Try again
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/60">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-14 pl-6">#</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="pr-6">M-Pesa Code</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: pageSize }, (_, i) => (
                      <TableRow key={i} className="hover:bg-transparent">
                        <TableCell className="pl-6"><Skeleton className="h-4 w-6" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-44" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-56" /></TableCell>
                        <TableCell className="pr-6"><Skeleton className="h-4 w-24" /></TableCell>
                      </TableRow>
                    ))
                  ) : filtered.length === 0 ? (
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={4} className="py-12 text-center text-muted-foreground">
                        {rows.length === 0 ? 'No registrations yet.' : 'No registrations match your search.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    pageRows.map((r, i) => (
                      <TableRow key={`${r.email}-${r.mpesa_code}-${i}`}>
                        <TableCell className="pl-6 text-muted-foreground">{pageStart + i + 1}</TableCell>
                        <TableCell className="font-medium">{r.name.replace(/\s+/g, ' ').trim()}</TableCell>
                        <TableCell className="text-muted-foreground">{r.email}</TableCell>
                        <TableCell className="pr-6 font-mono text-xs uppercase tracking-wide">
                          {r.mpesa_code}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}

            {!loading && !error && filtered.length > 0 && (
              <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-6 pt-4 sm:flex-row">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Rows per page</span>
                    <Select
                      value={String(pageSize)}
                      onValueChange={(value) => {
                        setPageSize(Number(value))
                        setPage(1)
                      }}
                    >
                      <SelectTrigger size="sm" className="w-20" aria-label="Rows per page">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PAGE_SIZES.map((size) => (
                          <SelectItem key={size} value={String(size)}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {pageStart + 1}–{pageStart + pageRows.length} of {filtered.length}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft /> Prev
                  </Button>
                  <span className="px-2 text-sm font-medium text-brand-dark">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next <ChevronRight />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
