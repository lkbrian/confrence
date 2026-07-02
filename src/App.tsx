import About from './components/About'
import Committee from './components/Committee'
import Contact from './components/Contact'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import Gallery from './components/Gallery'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import Office from './components/Office'
import Register from './components/Register'
import Schedule from './components/Schedule'
import Speakers from './components/Speakers'
import Sponsors from './components/Sponsors'
import Testimonials from './components/Testimonials'
import Topics from './components/Topics'
import Tracks from './components/Tracks'
import Venue from './components/Venue'

function App() {
  return (
    <main className="min-h-screen bg-brand-cream text-stone-900">
      <Navbar />
      <Hero />
      <About />
      <Office />
      <Committee />
      <Speakers />
      <Schedule />
      <Topics />
      <Tracks />
      <Venue />
      <Register />
      <Gallery />
      <Testimonials />
      <Sponsors />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  )
}

export default App
