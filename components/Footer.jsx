export default function Footer() {
  return (
    <footer className="mt-12 bg-white border-t">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-600">
        <div>© {new Date().getFullYear()} Dance With Sizzy Afro</div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <a href="/privacy" className="hover:underline">Privacy</a>
          <a href="/terms" className="hover:underline">Terms</a>
          <a href="https://g.page" className="hover:underline">Reviews</a>
        </div>
      </div>
    </footer>
  )
}
