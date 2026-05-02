import { useEffect } from 'react'
import OfflineBackground from '../components/offline/OfflineBackground'
import OfflineHero from '../components/offline/OfflineHero'
import OfflineGallery from '../components/offline/OfflineGallery'
import OfflineQuote from '../components/offline/OfflineQuote'
import OfflineInterests from '../components/offline/OfflineInterests'
import OfflineSocials from '../components/offline/OfflineSocials'
import OfflineFooter from '../components/offline/OfflineFooter'

export default function Offline() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="offline-root">
      <OfflineBackground />
      <OfflineHero />
      <OfflineGallery />
      <OfflineQuote />
      <OfflineInterests />
      <OfflineSocials />
      <OfflineFooter />
    </div>
  )
}
