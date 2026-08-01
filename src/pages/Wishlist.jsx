import { useCallback, useEffect, useState } from "react"
import axios from "../api/axios";
import { Link } from "react-router-dom"
import { FALLBACK_PROPERTY_IMAGE } from "../constants/images"

export default function Wishlist() {

  const [properties, setProperties] = useState([])

  const fetchWishlist = useCallback(async () => {
    const res = await axios.get(
      "/properties/wishlist"
    )
    setProperties(res.data)
  }, [])

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  const removeFromWishlist = async (id) => {
    await axios.delete(
      `/properties/${id}/wishlist`
    )
    fetchWishlist()
  }

  return (
    <div className="min-h-screen pt-16 px-6 md:px-12 lg:px-20 bg-white dark:bg-gray-900 transition-colors">

      <div className="mb-10">
  <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
    Your Wishlist
  </h1>
</div>

      {properties.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400 text-lg">
          No saved properties yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {properties.map(property => (
            <div
              key={property.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg overflow-hidden transition-colors"
            >
              <img
  src={property.images?.[0]?.url || FALLBACK_PROPERTY_IMAGE}
  className="w-full h-56 object-cover"
  alt=""
  onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_PROPERTY_IMAGE; }}
/>

              <div className="p-6">
                <h2 className="font-semibold text-black dark:text-white">
                  {property.city}
                </h2>

                <p className="text-gray-500 dark:text-gray-400">
                  {property.locality}
                </p>

                <div className="flex justify-between items-center mt-4">

  {/* Rent */}
  <p className="text-indigo-600 font-bold text-xl">
    ₹{property.rent}
  </p>

  {/* Rating */}
  <div className="flex items-center gap-1">
    <span className="text-yellow-400 text-xl">★</span>
    <span className="font-medium dark:text-gray-300">
      {property.average_rating > 0
        ? property.average_rating
        : "0"}
    </span>
  </div>

</div>

                <button
                  onClick={() => removeFromWishlist(property.id)}
                  className="mt-4 text-red-600 dark:text-red-400 text-sm"
                >
                  Remove
                </button>

                <Link
                  to={`/property/${property.id}`}
                  className="block mt-3 text-sm text-indigo-600"
                >
                  View →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
