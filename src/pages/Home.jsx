import { useEffect, useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"

export default function Home() {

  const navigate = useNavigate()

  const [featured, setFeatured] = useState([])
  const [filtersData, setFiltersData] = useState({})
  const [city, setCity] = useState("")
  const [locality, setLocality] = useState("")
  const [bedrooms, setBedrooms] = useState("")

  useEffect(() => {
    fetchFilters()
    fetchFeatured()
  }, [])

  const fetchFeatured = async () => {
    try {
      const res = await axios.get(
        "https://rentwise-backend-du7p.onrender.com/properties/all?per_page=6&page=1"
      )
      setFeatured(res.data.properties || [])
    } catch (err) {
      console.error("Failed to fetch featured")
    }
  }

  const fetchFilters = async () => {
    try {
      const res = await axios.get("https://rentwise-backend-du7p.onrender.com/properties/filters")
      setFiltersData(res.data.cities || {})
    } catch (err) {
      console.error(err)
    }
  }

  const handleSearch = () => {
    navigate("/explore", {
      state: { city, locality, bedrooms }
    })
  }

  return (
    <div>

      {/* ================= HERO ================= */}
      <div className="relative w-screen min-h-screen overflow-hidden left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">

        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070"
            alt="Luxury Home"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/60 via-black/60 to-black/80"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 md:px-12 lg:px-20 min-h-screen">

          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Rent with Confidence.
            <br />
            <span className="text-indigo-400"></span>
          </h1>

          <p className="mt-6 max-w-2xl text-indigo-400 text-lg">
            Discover homes backed by real market intelligence and transparent pricing insights.
          </p>

          {/* Glass Search Panel */}
          <div
            className="
              mt-10 w-full max-w-5xl 
              backdrop-blur-xl 
              bg-white/20 dark:bg-black/40
              border border-white/30 dark:border-white/10
              rounded-3xl shadow-2xl 
              p-6 
              transition-all duration-300
            "
          >

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

              <select
                value={city}
                onChange={(e) => {
                  setCity(e.target.value)
                  setLocality("")
                }}
                className="
                  rounded-xl px-4 py-3 
                  bg-white/90 dark:bg-gray-800/80
                  text-gray-900 dark:text-white
                  border border-transparent
                  focus:outline-none focus:ring-2 focus:ring-indigo-500
                  transition-colors
                "
              >
                <option value="">City</option>
                {Object.keys(filtersData).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                disabled={!city}
                className="
                  rounded-xl px-4 py-3 
                  bg-white/90 dark:bg-gray-800/80
                  text-gray-900 dark:text-white
                  disabled:opacity-40
                  focus:outline-none focus:ring-2 focus:ring-indigo-500
                  transition-colors
                "
              >
                <option value="">Locality</option>
                {city && filtersData[city]?.map((loc) => (
                  <option key={loc}>{loc}</option>
                ))}
              </select>

              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="
                  rounded-xl px-4 py-3 
                  bg-white/90 dark:bg-gray-800/80
                  text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-indigo-500
                  transition-colors
                "
              >
                <option value="">Bedrooms</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4+</option>
              </select>

              <button
                onClick={handleSearch}
                className="
                  rounded-xl px-6 py-3 
                  bg-indigo-600 hover:bg-indigo-700
                  text-white font-semibold
                  transition
                "
              >
                Explore →
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* ================= FEATURED SECTION ================= */}
      <div className="px-6 md:px-12 lg:px-20 py-20 bg-white dark:bg-gray-950 transition-colors duration-300">

        <h2 className="text-3xl font-semibold mb-10 text-gray-900 dark:text-white text-center">
          Featured Properties
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {featured.map((property) => (
            <Link
              key={property.id}
              to={`/property/${property.id}`}
              className="
                bg-white dark:bg-gray-900 
                rounded-2xl shadow 
                border border-gray-200 dark:border-gray-700 
                overflow-hidden 
                hover:shadow-lg transition
              "
            >
              {property.images?.length > 0 && (
                <img
                  src={`https://rentwise-backend-du7p.onrender.com/uploads/${property.images[0]?.split("/uploads/")[1]}`}
                  className="w-full h-60 object-cover"
                  alt=""
                />
              )}

              <div className="p-6">
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {property.city}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {property.locality}
                </p>
                <p className="text-indigo-600 font-bold mt-3">
                  ₹{property.rent}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            to="/explore"
            className="
              px-8 py-4 
              bg-indigo-600 hover:bg-indigo-700
              text-white 
              rounded-2xl font-semibold 
              transition
            "
          >
            Explore More Properties →
          </Link>
        </div>

      </div>

    </div>
  )
}