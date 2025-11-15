import HeroSection from '../components/HeroSection'
import GalleryLoader from '../components/GalleryLoader'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <div id="work" className="scroll-section">
        <GalleryLoader />
      </div>
    </main>
  )
}