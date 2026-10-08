// Admin-only list of 4th annual conference registrations.
// Deploy to the MAIN project (the one admins sign in to):
//   supabase secrets set FOURTH_URL=https://<4th-project>.supabase.co FOURTH_SERVICE_ROLE_KEY=<its service_role key>
//   supabase functions deploy fourth-registrations
// (or Dashboard → Edge Functions → Deploy a new function, then add the two secrets under Secrets).
// The service role key bypasses RLS on the 4th project, so it must only ever live in function secrets.
import { createClient } from 'npm:@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  // The anon key is also a valid JWT, so check for a real signed-in user. Sign-ups are disabled
  // on the main project, so every user there is an admin.
  const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '') ?? ''
  const main = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!)
  const { data: auth, error: authError } = await main.auth.getUser(token)
  if (authError || !auth.user) return json({ error: 'Please sign in again.' }, 401)

  const fourth = createClient(Deno.env.get('FOURTH_URL')!, Deno.env.get('FOURTH_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false },
  })

  // PostgREST caps each response (1000 rows by default), so page through everything.
  const rows: unknown[] = []
  const PAGE = 1000
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await fourth
      .from('registrations')
      .select('name, phone, mpesa_code, area, created_at')
      .order('created_at', { ascending: true })
      .range(from, from + PAGE - 1)
    if (error) return json({ error: error.message }, 500)
    rows.push(...data)
    if (data.length < PAGE) break
  }

  return json({ data: rows })
})
