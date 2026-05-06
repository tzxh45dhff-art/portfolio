import { useEffect } from 'react'
import OnlineBackground from '../components/online/OnlineBackground'
import OnlineHero from '../components/online/OnlineHero'
import OnlineDeployments from '../components/online/OnlineDeployments'
import OnlineActivity from '../components/online/OnlineActivity'
import OnlineSystems from '../components/online/OnlineSystems'
import OnlineFooter from '../components/online/OnlineFooter'

export default function Online() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="online-root">
      <OnlineBackground />
      <main className="on-page">
        <OnlineHero />
        <OnlineDeployments />
        <OnlineActivity />
        <OnlineSystems />
        <OnlineFooter />
      </main>
    </div>
  )
}
