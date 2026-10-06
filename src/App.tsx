import About from './components/user/About'
import Committee from './components/user/Committee'
import Contact from './components/user/Contact'
import FAQ from './components/user/FAQ'
import Footer from './components/user/Footer'
import Gallery from './components/user/Gallery'
import Hero from './components/user/Hero'
import Navbar from './components/user/Navbar'
import Office from './components/user/Office'
import PanelistQA from './components/user/PanelistQA'
import Register from './components/user/Register'
import Schedule from './components/user/Schedule'
import Speakers from './components/user/Speakers'
import Sponsors from './components/user/Sponsors'
import Testimonials from './components/user/Testimonials'
import Topics from './components/user/Topics'
// import Tracks from './components/user/Tracks'
import Venue from './components/user/Venue'

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
      {/* <Tracks /> */}
      <PanelistQA />
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
