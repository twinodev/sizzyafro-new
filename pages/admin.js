import Head from 'next/head'

export default function Admin() {
  return (
    <>
      <Head>
        <title>Admin — Dance With Sizzy Afro</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <main className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-semibold mb-4">Admin Configuration (Crawl-free)</h1>
          <p className="text-sm text-gray-600 mb-4">This admin is intentionally not indexed by search engines. Use this page to manage team members, events, and content.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded">Manage Team</button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded">Create Event</button>
          </div>

          <div className="mt-6 text-sm text-gray-500">(This is a placeholder admin UI — connect to Supabase and build CRUD interfaces here.)</div>
        </div>
      </main>
    </>
  )
}
