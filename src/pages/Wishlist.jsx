import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"

export default function Wishlist() {

  const [properties, setProperties] = useState([])
  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    const res = await axios.get(
      "https://rentwise-backend-du7p.onrender.com/properties/wishlist",
      { headers: { Authorization: `Bearer ${token}` } }
    )
    setProperties(res.data)
  }

  const removeFromWishlist = async (id) => {
    await axios.delete(
      `https://rentwise-backend-du7p.onrender.com/properties/${id}/wishlist`,
      { headers: { Authorization: `Bearer ${token}` } }
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
              {property.images?.length > 0 && (
                <img
                  src={property.images[0]}
                  className="w-full h-56 object-cover"
                  alt=""
                />
              )}

              <div className="p-6">
                <h2 className="font-semibold text-black dark:text-white">
                  {property.city}
                </h2>

                <p className="text-gray-500 dark:text-gray-400">
                  {property.locality}
                </p>

                <p className="text-indigo-600 font-bold mt-2">
                  ₹{property.rent}
                </p>

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