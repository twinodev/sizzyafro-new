export default function PartnersStrip() {
  return (
    <section className="py-8 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <h3 className="text-center text-lg font-medium mb-4">Our Partners</h3>
        <div className="flex items-center gap-6 overflow-x-auto py-3">
          {/* Replace with real sponsor logos */}
          <div className="w-40 h-16 bg-white rounded shadow flex items-center justify-center">Sponsor 1</div>
          <div className="w-40 h-16 bg-white rounded shadow flex items-center justify-center">Sponsor 2</div>
          <div className="w-40 h-16 bg-white rounded shadow flex items-center justify-center">Sponsor 3</div>
          <div className="w-40 h-16 bg-white rounded shadow flex items-center justify-center">Sponsor 4</div>
          <div className="w-40 h-16 bg-white rounded shadow flex items-center justify-center">Sponsor 5</div>
        </div>
      </div>
    </section>
  )
}
