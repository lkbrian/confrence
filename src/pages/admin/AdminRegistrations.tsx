import RegistrationsTable, { type RegistrationColumn } from '@/components/admin/RegistrationsTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { fetchFourthRegistrations, formatPhone, type FourthRegistration } from '@/lib/fourthConference'
import { fetchRegistrations, type PublicRegistration } from '@/lib/supabase'

const tidy = (text: string) => text.replace(/\s+/g, ' ').trim()

const thirdColumns: RegistrationColumn<PublicRegistration>[] = [
  { header: 'Full Name', width: 36, value: (r) => tidy(r.name), className: 'font-medium', skeleton: 'w-44' },
  { header: 'Email', width: 40, value: (r) => r.email.trim(), className: 'text-muted-foreground', skeleton: 'w-56' },
  {
    header: 'M-Pesa Code',
    width: 18,
    value: (r) => r.mpesa_code.trim().toUpperCase(),
    className: 'font-mono text-xs uppercase tracking-wide',
    skeleton: 'w-24',
  },
]

const fourthColumns: RegistrationColumn<FourthRegistration>[] = [
  { header: 'Full Name', width: 36, value: (r) => tidy(r.name), className: 'font-medium', skeleton: 'w-44' },
  { header: 'Phone', width: 18, value: (r) => formatPhone(r.phone), className: 'whitespace-nowrap', skeleton: 'w-28' },
  { header: 'Area', width: 24, value: (r) => tidy(r.area), className: 'text-muted-foreground', skeleton: 'w-28' },
  {
    header: 'M-Pesa Code',
    width: 18,
    value: (r) => r.mpesa_code ?? '',
    cell: (r) => r.mpesa_code ?? <span className="font-sans normal-case tracking-normal text-muted-foreground">—</span>,
    className: 'font-mono text-xs uppercase tracking-wide',
    skeleton: 'w-24',
  },
  {
    header: 'Registered',
    width: 16,
    value: (r) => new Date(r.created_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }),
    className: 'whitespace-nowrap text-muted-foreground',
    skeleton: 'w-20',
  },
]

const tabClass =
  'rounded-full border border-brand-dark/15 bg-white px-5 py-2 text-sm font-bold text-brand-dark data-[state=active]:border-brand-dark data-[state=active]:bg-brand-dark data-[state=active]:text-white'

export default function AdminRegistrations() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-green">Conference</p>
      <h1 className="mt-2 text-2xl font-extrabold text-brand-dark sm:text-3xl">Registrations</h1>

      <Tabs defaultValue="fourth" className="mt-6">
        <TabsList>
          <TabsTrigger value="third" className={tabClass}>3rd Conference</TabsTrigger>
          <TabsTrigger value="fourth" className={tabClass}>4th Conference · 2027</TabsTrigger>
        </TabsList>
        <TabsContent value="third">
          <RegistrationsTable
            title="3rd Conference registrations"
            load={fetchRegistrations}
            columns={thirdColumns}
            searchPlaceholder="Search name, email, code"
            filePrefix="registrations-3rd-conference"
          />
        </TabsContent>
        <TabsContent value="fourth">
          <RegistrationsTable
            title="4th Conference registrations"
            load={fetchFourthRegistrations}
            columns={fourthColumns}
            searchPlaceholder="Search name, phone, area, code"
            filePrefix="registrations-4th-conference"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
