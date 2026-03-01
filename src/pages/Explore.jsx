import { useEffect, useState } from "react"
import axios from "../api/axios";
import { Link, useLocation } from "react-router-dom"

export default function Explore() {

  const location = useLocation()
  const token = localStorage.getItem("token")

  const [properties, setProperties] = useState([])
  const [filtersData, setFiltersData] = useState({})

  const [city, setCity] = useState(location.state?.city || "")
  const [locality, setLocality] = useState(location.state?.locality || "")
  const [bedrooms, setBedrooms] = useState(location.state?.bedrooms || "")
  const [sort, setSort] = useState("")
  const [priceRange, setPriceRange] = useState(1000000)
  const [showFilters, setShowFilters] = useState(false)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchFilters()
  }, [])

  useEffect(() => {
    fetchProperties()
  }, [page])

  const fetchFilters = async () => {
    const res = await axios.get("https://rentwise-backend-1-gnu2.onrender.com/properties/filters")
    setFiltersData(res.data.cities || {})
  }

  const fetchProperties = async () => {
    setLoading(true)

    const res = await axios.get(
      `https://rentwise-backend-1-gnu2.onrender.com/properties/all?city=${city}&locality=${locality}&bedrooms=${bedrooms}&max_price=${priceRange}&sort=${sort}&page=${page}&per_page=15`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      }
    )

    setProperties(res.data.properties || [])
    setTotalPages(res.data.total_pages || 1)
    setLoading(false)
  }

  const toggleWishlist = async (propertyId, isInWishlist) => {

    if (!token) {
      alert("Please login first")
      return
    }

    if (isInWishlist) {
      await axios.delete(
        `https://rentwise-backend-1-gnu2.onrender.com/properties/${propertyId}/wishlist`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
    } else {
      await axios.post(
        `https://rentwise-backend-1-gnu2.onrender.com/properties/${propertyId}/wishlist`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
    }

    fetchProperties()
  }

  const handleSearch = () => {
    setPage(1)
    fetchProperties()
  }

  return (
   <div className="pt-16 px-6 md:px-12 lg:px-20 min-h-screen bg-white dark:bg-gray-950 transition-colors">

  {/* PAGE HEADING */}
  <div className="mb-10">
    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
      Find Your Perfect Rental
    </h1>
    <p className="text-gray-500 dark:text-gray-400 mt-2">
      
    </p>
  </div>

  {/* FILTER BAR */}
  <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 mb-8 flex flex-wrap gap-4 items-center relative transition-colors">

        <select
          value={city}
          onChange={(e) => {
            setCity(e.target.value)
            setLocality("")
          }}
           className="px-4 py-2 rounded-xl border border-gray-300 
             dark:border-gray-700 
             bg-white dark:bg-gray-800 
             dark:text-white
             shadow-sm
             focus:outline-none 
             focus:ring-2 
             focus:ring-indigo-500
             hover:border-indigo-400
             transition-all duration-200"
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
  className="px-4 py-2 rounded-xl border border-gray-300 
             dark:border-gray-700 
             bg-white dark:bg-gray-800 
             dark:text-white
             shadow-sm
             focus:outline-none 
             focus:ring-2 
             focus:ring-indigo-500
             hover:border-indigo-400
             transition-all duration-200
             disabled:opacity-60 disabled:cursor-not-allowed"
>
          <option value="">Locality</option>
          {city && filtersData[city]?.map((loc) => (
            <option key={loc}>{loc}</option>
          ))}
        </select>

        <select
  value={bedrooms}
  onChange={(e) => setBedrooms(e.target.value)}
  className="px-4 py-2 rounded-xl border border-gray-300 
             dark:border-gray-700 
             bg-white dark:bg-gray-800 
             dark:text-white
             shadow-sm
             focus:outline-none 
             focus:ring-2 
             focus:ring-indigo-500
             hover:border-indigo-400
             transition-all duration-200"
>
          <option value="">Bedrooms</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4+</option>
        </select>

        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl"
        >
          Search
        </button>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
        >
          Filters ⚙
        </button>

        {/* ADVANCED FILTERS */}
        {showFilters && (
          <div className="absolute right-0 top-full mt-4 w-full md:w-[650px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 grid md:grid-cols-3 gap-6 z-50">

            <div>
              <label className="text-sm text-gray-500 dark:text-gray-400">
                Max Price: ₹{priceRange}
              </label>
              <input
                type="range"
                min="1000"
                max="1000000"
                step="1000"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full mt-3"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500 dark:text-gray-400">
                Sort
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="mt-2 w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white rounded-xl px-4 py-3"
              >
                <option value="">Newest</option>
                <option value="low">Price Low → High</option>
                <option value="high">Price High → Low</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setPage(1)
                  fetchProperties()
                  setShowFilters(false)
                }}
                className="w-full bg-indigo-600 text-white rounded-xl py-3"
              >
                Apply Filters
              </button>
            </div>

          </div>
        )}
      </div>

      {/* LISTINGS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {properties.map((property) => (
          <div
            key={property.id}
            className="relative bg-white dark:bg-gray-900 rounded-2xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden"
          >

            <button
              onClick={() =>
                toggleWishlist(property.id, property.is_in_wishlist)
              }
              className={`absolute top-4 right-4 text-2xl ${
                property.is_in_wishlist ? "text-red-500" : "text-gray-400"
              }`}
            >
              ♥
            </button>

            <Link to={`/property/${property.id}`}>
              {property.images?.length > 0 && (
                <img
                   src={`https://rentwise-backend-1-gnu2.onrender.com/uploads/${property.images[0]?.split("/uploads/")[1]}`}
                   className="w-full h-60 object-cover"
                   alt=""
                />
              )}

              <div className="p-6">
                <h2 className="font-semibold dark:text-white">
                  {property.city}
                </h2>
                <div className="flex justify-between items-center mt-3">
  
  {/* Rent - Left */}
  <p className="text-indigo-600 font-bold text-lg">
    ₹{property.rent}
  </p>

  {/* Rating - Right */}
  <div className="flex items-center gap-1">
    <span className="text-yellow-400 text-lg">★</span>
    <span className="font-medium dark:text-gray-300">
      {property.average_rating > 0
        ? property.average_rating
        : "0"}
    </span>
  </div>

</div>
                
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-16 pb-20">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 rounded-xl border disabled:opacity-40 dark:text-white"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded-xl ${
                page === i + 1
                  ? "bg-indigo-600 text-white"
                  : "border dark:text-white"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 rounded-xl border disabled:opacity-40 dark:text-white"
          >
            Next
          </button>
        </div>
      )}

    </div>
  )
}