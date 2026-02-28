import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

export default function Navbar() {

  const navigate = useNavigate()

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [role, setRole] = useState(null)

  const [darkMode, setDarkMode] = useState(false)

 
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
      setDarkMode(true)
    } else {
      document.documentElement.classList.remove("dark")
      setDarkMode(false)
    }
  }, [])

  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [darkMode])

  useEffect(() => {
    checkAuth()
    window.addEventListener("storage", checkAuth)
    return () => window.removeEventListener("storage", checkAuth)
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem("token")
    const userRole = localStorage.getItem("role")
    setIsLoggedIn(!!token)
    setRole(userRole)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    setIsLoggedIn(false)
    setRole(null)
    navigate("/")
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/70 dark:bg-black/70 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">

      <div className="w-full px-6 md:px-12 lg:px-20 py-4 flex justify-between items-center">

        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-semibold tracking-tight text-black dark:text-white"
        >
          RentWise
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium text-black dark:text-white">

          {/* ✅ HOME LINK ADDED */}
          <Link to="/" className="hover:opacity-70 transition">
            Home
          </Link>

          <Link to="/explore" className="hover:opacity-70 transition">
            Explore
          </Link>

          {isLoggedIn && role === "renter" && (
            <>
              <Link to="/add" className="hover:opacity-70 transition">
                Add Property
              </Link>
              <Link to="/my-listings" className="hover:opacity-70 transition">
                My Listings
              </Link>
            </>
          )}

          {isLoggedIn && role === "customer" && (
            <Link to="/wishlist" className="hover:opacity-70 transition">
              Wishlist
            </Link>
          )}

          {/* DARK MODE TOGGLE */}
          <button
            onClick={() => setDarkMode(prev => !prev)}
            className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
              darkMode ? "bg-white" : "bg-black"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                darkMode
                  ? "translate-x-6 bg-black"
                  : "bg-white"
              }`}
            >
              {darkMode ? (
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white" fill="currentColor">
                  <circle cx="12" cy="12" r="4" />
                  <g stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="4" />
                    <line x1="12" y1="20" x2="12" y2="23" />
                    <line x1="4.2" y1="4.2" x2="6.3" y2="6.3" />
                    <line x1="17.7" y1="17.7" x2="19.8" y2="19.8" />
                    <line x1="1" y1="12" x2="4" y2="12" />
                    <line x1="20" y1="12" x2="23" y2="12" />
                    <line x1="4.2" y1="19.8" x2="6.3" y2="17.7" />
                    <line x1="17.7" y1="6.3" x2="19.8" y2="4.2" />
                  </g>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-black" fill="currentColor">
                  <path d="M21 12.8A9 9 0 1111.2 3c0 .3 0 .6.1 1a7 7 0 009.7 8.8z" />
                </svg>
              )}
            </span>
          </button>

          {!isLoggedIn ? (
            <>
              <Link to="/login" className="hover:opacity-70 transition">
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-xl transition"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 hover:opacity-70 transition"
            >
              Logout
            </button>
          )}

        </div>
      </div>
    </nav>
  )
}