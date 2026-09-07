import { Link, useNavigate } from 'react-router-dom'
import './Sidebar.css'
import { useLanguage } from '../LanguageContext'

function Sidebar() {
  const { language } = useLanguage()
  const navigate = useNavigate()

  const isGreek = language === 'Ελληνικά'

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn')
    navigate('/login', { replace: true })
  }

  return (
    <aside className="sidebar">
      <h2>Warehouse</h2>

      <nav>
        <Link to="/">
          🏠 {isGreek ? 'Αρχική' : 'Dashboard'}
        </Link>

        <Link to="/products">
          📦 {isGreek ? 'Προϊόντα' : 'Products'}
        </Link>

        <Link to="/warehouses">
          🏢 {isGreek ? 'Αποθήκες' : 'Warehouses'}
        </Link>

        <Link to="/receipts">
          📥 {isGreek ? 'Παραλαβές' : 'Receipts'}
        </Link>

        <Link to="/shipments">
          📤 {isGreek ? 'Αποστολές' : 'Shipments'}
        </Link>

        <Link to="/inventory">
          📊 {isGreek ? 'Απόθεμα' : 'Inventory'}
        </Link>

        <Link to="/settings">
          ⚙️ {isGreek ? 'Ρυθμίσεις' : 'Settings'}
        </Link>

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          🚪 {isGreek ? 'Αποσύνδεση' : 'Logout'}
        </button>
      </nav>
    </aside>
  )
}

export default Sidebar