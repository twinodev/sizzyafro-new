export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-indigo-600 to-pink-500 text-white">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-32 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Dance With Sizzy Afro</h1>
          <p className="mt-4 text-lg text-indigo-100 max-w-xl">Empowering young people through high-quality dance training, performance opportunities and community programs.</p>
          <div className="mt-8 flex gap-4">
            <a href="/events" className="px-6 py-3 bg-white text-indigo-600 rounded font-semibold">Upcoming Events</a>
            <a href="/team" className="px-6 py-3 border border-white/30 rounded">Meet the Team</a>
          </div>
        </div>

        <div className="flex-1">
          <div className="w-full rounded-xl bg-white/10 p-6">
            <div className="h-64 bg-white/20 rounded flex items-center justify-center">
              <span className="text-white/90">[Event flyer / hero visual]</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
