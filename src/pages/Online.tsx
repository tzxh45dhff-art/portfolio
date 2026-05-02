import { useEffect } from 'react'
import OnlineBackground from '../components/online/OnlineBackground'
import OnlineHero from '../components/online/OnlineHero'
import OnlineDashboard from '../components/online/OnlineDashboard'
import OnlineStack from '../components/online/OnlineStack'
import OnlineCommits from '../components/online/OnlineCommits'
import OnlineFooter from '../components/online/OnlineFooter'

export default function Online() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="online-root">
      <OnlineBackground />
      <OnlineHero />
      <OnlineDashboard />
      <OnlineStack />
      <OnlineCommits />
      <OnlineFooter />
    </div>
  )
}
