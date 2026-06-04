import Nav from '../components/Nav'
import Hero from '../components/Hero'
import PartnersStrip from '../components/PartnersStrip'
import Footer from '../components/Footer'
import FloatingWhatsApp from '../components/FloatingWhatsApp'
import SEO from '../components/SEO'
import { organizationSchema } from '../lib/seo'

export default function Home() {
  return (
    <>
      <SEO
        title="Home"
        description="Youth-focused dance community: training, events, and mentorship."
        url="/"
        structuredData={organizationSchema({ url: 'https://example.com', logo: '/logo.png' })}
      />

      <div className="min-h-screen flex flex-col">
        <Nav />
        <Hero />

        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-semibold text-center mb-6">Our Programs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gray-50 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-2">Classes & Workshops</h3>
                <p className="text-sm text-gray-600">Structured training across styles for all levels.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-2">Events & Battles</h3>
                <p className="text-sm text-gray-600">Competitions, showcases and community events.</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg shadow">
                <h3 className="text-xl font-bold mb-2">Mentorship</h3>
                <p className="text-sm text-gray-600">Career guidance, performance coaching, and outreach.</p>
              </div>
            </div>
          </div>
        </section>

        <PartnersStrip />

        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-semibold mb-4">Join the Movement</h2>
            <p className="text-gray-600 mb-6">Sign up for classes, volunteer, or partner with us to support youth development through dance.</p>
            <div className="flex items-center justify-center gap-4">
              <a href="/events" className="px-6 py-3 bg-indigo-600 text-white rounded-md shadow">See Events</a>
              <a href="/partner" className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-md">Partner With Us</a>
            </div>
          </div>
        </section>

        <Footer />
        <FloatingWhatsApp />
      </div>
    </>
  )
}
