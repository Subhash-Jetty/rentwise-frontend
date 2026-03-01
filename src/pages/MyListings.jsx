import { useEffect, useState } from "react"
import axios from "../api/axios";
import { Link } from "react-router-dom"

export default function MyListings() {

  const [properties, setProperties] = useState([])
  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchMine()
  }, [])

  const fetchMine = async () => {
    try {
      const res = await axios.get(
        "https://rentwise-backend-1-gnu2.onrender.com/properties/mine",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setProperties(res.data)
    } catch (err) {
      console.log("Failed to fetch listings")
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return

    await axios.delete(
      `https://rentwise-backend-1-gnu2.onrender.com/properties/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    fetchMine()
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors px-12 py-12">
      <div className="max-w-6xl mx-auto">

       <div className="mb-10">
  <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
    My Listings
  </h1>
</div>

        {properties.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No properties yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {properties.map(p => (
              <div
                key={p.id}
                className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-lg transition"
              >

                {p.images && p.images.length > 0 && (
<img
  src={`https://rentwise-backend-1-gnu2.onrender.com/uploads/${p.images[0]?.split("/uploads/")[1]}`}
  alt=""
  className="w-full h-40 object-cover rounded mb-4"
/>
)}

                <h2 className="font-semibold text-lg text-black dark:text-white">
                  {p.city}
                </h2>

                <p className="text-gray-600 dark:text-gray-400">
                  {p.locality}
                </p>

                <div className="flex justify-between items-center mt-3">

  {/* Rent - Left */}
  <p className="text-blue-600 font-semibold text-lg">
    ₹{Math.round(p.rent)}
  </p>

  {/* Rating - Right */}
  <div className="flex items-center gap-1">
    <span className="text-yellow-400">★</span>
    <span className="text-sm font-medium dark:text-gray-300">
      {p.average_rating > 0 ? p.average_rating : "0"}
    </span>
  </div>

</div>

                <div className="flex justify-between mt-4">

                  <Link
                    to={`/property/${p.id}`}
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition"
                  >
                    View
                  </Link>

                  <Link
                    to={`/edit/${p.id}`}
                    className="text-sm text-blue-600"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-sm text-red-600"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  )
}