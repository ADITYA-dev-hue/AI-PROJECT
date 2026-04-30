import Header from '../components/Header'
import MapPanel from '../components/MapPanel'
import TrafficSignals from '../components/TrafficSignals'
import VitalsPanel from '../components/VitalsPanel'
import AlertsPanel from '../components/AlertsPanel'
import NetworkPanel from '../components/NetworkPanel'
import ChartsPanel from '../components/ChartsPanel'
import AmbulanceTracker from '../components/AmbulanceTracker'
import HospitalPanel from '../components/HospitalPanel'
import StatsBar from '../components/StatsBar'
import styles from './DashboardPage.module.css'

export default function DashboardPage() {
  return (
    <div className={styles.root}>
      <Header />
      <div className={styles.grid}>
        {/* LEFT */}
        <div className={styles.col}>
          <MapPanel />
          <TrafficSignals />
        </div>
        {/* CENTER */}
        <div className={styles.col}>
          <VitalsPanel />
          <ChartsPanel />
          <AmbulanceTracker />
        </div>
        {/* RIGHT */}
        <div className={styles.col}>
          <AlertsPanel />
          <NetworkPanel />
          <HospitalPanel />
        </div>
      </div>
      <StatsBar />
    </div>
  )
}
