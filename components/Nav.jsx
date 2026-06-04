export default function Nav() {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-xl font-bold">Dance With <span className="text-indigo-600">Sizzy Afro</span></a>
        <nav className="hidden md:flex gap-6 text-sm">
          <a href="/team" className="text-gray-700 hover:text-indigo-600">Our Team</a>
          <a href="/events" className="text-gray-700 hover:text-indigo-600">Events</a>
          <a href="/videos" className="text-gray-700 hover:text-indigo-600">Videos</a>
          <a href="/blog" className="text-gray-700 hover:text-indigo-600">Blog</a>
          <a href="/merch" className="text-gray-700 hover:text-indigo-600">Merch</a>
        </nav>
        <div className="flex items-center gap-3">
          <a href="/donate" className="hidden sm:inline-block px-4 py-2 bg-yellow-400 text-black rounded">Donate</a>
          <a href="/contact" className="px-4 py-2 border rounded">Contact</a>
        </div>
      </div>
    </header>
  )
}
