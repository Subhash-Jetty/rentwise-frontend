import { useState } from "react"
import axios from "../api/axios";
import { useNavigate } from "react-router-dom"

export default function Login() {

  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("")
    setLoading(true)

    try {
      const response = await axios.post(
        "/auth/login",
        { email, password }
      )

      localStorage.setItem("token", response.data.access_token)
      localStorage.setItem("role", response.data.role)

      navigate("/")
      window.location.reload()

    } catch (err) {
      setError("Invalid credentials")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-white dark:bg-gray-900 transition-colors px-6">

      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">

        <h1 className="text-3xl font-semibold mb-8 text-black dark:text-white">
          Login
        </h1>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 p-3 mb-4 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 dark:text-white p-3 rounded"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 dark:text-white p-3 rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg transition font-semibold"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>
    </div>
  )
}