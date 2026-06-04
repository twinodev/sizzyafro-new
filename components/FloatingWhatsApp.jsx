export default function FloatingWhatsApp() {
  return (
    <a href={`https://wa.me/256000000000`} target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 bg-green-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12.79A9 9 0 1111.21 3 9 9 0 0121 12.79z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M22 22l-4.35-1.54" />
      </svg>
    </a>
  )
}
