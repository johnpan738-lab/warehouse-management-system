import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('http://localhost:8080/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })

      if (response.ok) {
        const credentials = btoa(`${username}:${password}`)

        sessionStorage.setItem('isLoggedIn', 'true')
        sessionStorage.setItem('auth', credentials)
        sessionStorage.setItem('username', username)

        navigate('/')
      } else {
        setError('Λάθος username ή password')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Δεν ήταν δυνατή η σύνδεση με τον server')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Warehouse Login</h1>

        <form onSubmit={handleLogin}>
          <div className="login-field">
            <label>Username</label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="login-field">
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="login-button" type="submit">
            Σύνδεση
          </button>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}

export default Login