import { useState } from 'react'
import './Settings.css'
import { useLanguage } from '../LanguageContext'

function Settings() {
  const { language, setLanguage } = useLanguage()

  const [notifications, setNotifications] = useState(true)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const isGreek = language === 'Ελληνικά'

  const handleCreateUser = async () => {
    if (!username.trim() || !password || !confirmPassword) {
      alert(
        isGreek
          ? 'Συμπλήρωσε όλα τα πεδία.'
          : 'Please fill in all fields.'
      )

      return
    }

    if (password !== confirmPassword) {
      alert(
        isGreek
          ? 'Οι κωδικοί πρόσβασης δεν ταιριάζουν.'
          : 'Passwords do not match.'
      )

      return
    }

    try {
      const response = await fetch(
        'http://localhost:8080/users/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username.trim(),
            password,
          }),
        }
      )

      if (!response.ok) {
        if (response.status === 500 || response.status === 409) {
          throw new Error('USERNAME_EXISTS')
        }

        throw new Error('CREATE_FAILED')
      }

      alert(
        isGreek
          ? 'Ο χρήστης δημιουργήθηκε με επιτυχία.'
          : 'User created successfully.'
      )

      setUsername('')
      setPassword('')
      setConfirmPassword('')
    } catch (error) {
      console.error('Error creating user:', error)

      if (
        error instanceof Error &&
        error.message === 'USERNAME_EXISTS'
      ) {
        alert(
          isGreek
            ? 'Το username χρησιμοποιείται ήδη.'
            : 'Username already exists.'
        )
      } else {
        alert(
          isGreek
            ? 'Δεν ήταν δυνατή η δημιουργία του χρήστη.'
            : 'The user could not be created.'
        )
      }
    }
  }

  return (
    <div className="settings-page">

      <div className="settings-header">
        <h1>
          {isGreek ? 'Ρυθμίσεις' : 'Settings'}
        </h1>

        <p>
          {isGreek
            ? 'Διαχείριση των ρυθμίσεων της εφαρμογής'
            : 'Manage application settings'}
        </p>
      </div>

      <div className="settings-container">

        <div className="settings-section">
          <h2>
            {isGreek
              ? 'Στοιχεία επιχείρησης'
              : 'Company Information'}
          </h2>

          <div className="form-group">
            <label>
              {isGreek
                ? 'Όνομα εταιρείας'
                : 'Company Name'}
            </label>

            <input
              type="text"
              value="Warehouse"
              readOnly
            />
          </div>

          <div className="form-group">
            <label>
              Email
            </label>

            <input
              type="email"
              value="warehouse@demo.com"
              readOnly
            />
          </div>

          <div className="form-group">
            <label>
              {isGreek
                ? 'Τηλέφωνο'
                : 'Phone'}
            </label>

            <input
              type="text"
              value="210 999 9999"
              readOnly
            />
          </div>
        </div>

        <div className="settings-section">
          <h2>
            {isGreek
              ? 'Διαχείριση χρηστών'
              : 'User Management'}
          </h2>

          <div className="form-group">
            <label>
              {isGreek
                ? 'Όνομα χρήστη'
                : 'Username'}
            </label>

            <input
              type="text"
              placeholder={
                isGreek
                  ? 'π.χ. user1'
                  : 'e.g. user1'
              }
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>
              {isGreek
                ? 'Κωδικός πρόσβασης'
                : 'Password'}
            </label>

            <input
              type="password"
              placeholder={
                isGreek
                  ? 'Κωδικός πρόσβασης'
                  : 'Password'
              }
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />
          </div>

          <div className="form-group">
            <label>
              {isGreek
                ? 'Επιβεβαίωση κωδικού'
                : 'Confirm Password'}
            </label>

            <input
              type="password"
              placeholder={
                isGreek
                  ? 'Επανάλαβε τον κωδικό'
                  : 'Repeat password'
              }
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
            />
          </div>

          <button
            className="save-settings-button"
            onClick={handleCreateUser}
          >
            {isGreek
              ? 'Δημιουργία χρήστη'
              : 'Create User'}
          </button>
        </div>

        <div className="settings-section">
          <h2>
            {isGreek
              ? 'Γενικές ρυθμίσεις'
              : 'General Settings'}
          </h2>

          <div className="form-group">
            <label>
              {isGreek
                ? 'Γλώσσα'
                : 'Language'}
            </label>

            <select
              value={language}
              onChange={(e) =>
                setLanguage(
                  e.target.value as
                    | 'Ελληνικά'
                    | 'English'
                )
              }
            >
              <option value="Ελληνικά">
                Ελληνικά
              </option>

              <option value="English">
                English
              </option>
            </select>
          </div>

          <div className="notification-setting">
            <div>
              <strong>
                {isGreek
                  ? 'Ειδοποιήσεις'
                  : 'Notifications'}
              </strong>

              <p>
                {isGreek
                  ? 'Ενεργοποίηση ειδοποιήσεων για την εφαρμογή'
                  : 'Enable notifications for the application'}
              </p>
            </div>

            <label className="switch">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) =>
                  setNotifications(e.target.checked)
                }
              />

              <span className="slider"></span>
            </label>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Settings