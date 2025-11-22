import ImmersiveHero from '../components/ImmersiveHero'
import GalleryLoader from '../components/GalleryLoader'

export default function Home() {
  return (
    <main>
      <ImmersiveHero
        imageUrl="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=2400"
        title="STUDIO HAUS"
        subtitle="Visual narratives for luxury brands"
      />
      <div id="work">
        <GalleryLoader />
      </div>
    </main>
  )
}