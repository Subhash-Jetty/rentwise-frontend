import { useState } from "react"
import axios from "../api/axios";
import { useNavigate } from "react-router-dom"

export default function Register() {

  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("customer")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("")
    setLoading(true)

    try {
      await axios.post(
        "/auth/register",
        { email, password, role }
      )

      navigate("/login")

    } catch {
      setError("Registration failed")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-white dark:bg-gray-900 transition-colors px-6">

      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">

        <h1 className="text-3xl font-semibold mb-8 text-black dark:text-white">
          Register
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

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 dark:text-white p-3 rounded"
          >
            <option value="customer">Customer</option>
            <option value="renter">Renter</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg transition font-semibold"
          >
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

      </div>
    </div>
  )
}
