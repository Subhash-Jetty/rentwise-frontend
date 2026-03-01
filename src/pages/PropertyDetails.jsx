import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "../api/axios";

export default function PropertyDetails() {

  const { id } = useParams()

  const [property, setProperty] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [currentImage, setCurrentImage] = useState(0)
  const [wishlistAdded, setWishlistAdded] = useState(false)

  const token = localStorage.getItem("token")
  const role = localStorage.getItem("role")

  useEffect(() => {
    fetchProperty()
  }, [id])

  const fetchProperty = async () => {
    try {
      const res = await axios.get(
        `https://rentwise-backend-1-gnu2.onrender.com/properties/${id}`
      )
      setProperty(res.data)
    } catch (err) {
      setProperty(null)
    }
    setLoading(false)
  }

  const handleAnalyze = async () => {
    try {
      const res = await axios.post(
        `https://rentwise-backend-1-gnu2.onrender.com/analysis/${id}`,
        {},
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {}
        }
      )
      setAnalysis(res.data.market_analysis)
    } catch (err) {
      console.log(err)
    }
  }

  const handleWishlist = async () => {
    if (!token) {
      setError("Login to add to wishlist.")
      return
    }

    try {
      await axios.post(
        `https://rentwise-backend-1-gnu2.onrender.com/properties/${id}/wishlist`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setWishlistAdded(true)
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Failed to add to wishlist."
      )
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()

    if (!token) {
      setError("Login to submit a review.")
      return
    }

    try {
      await axios.post(
        `https://rentwise-backend-1-gnu2.onrender.com/properties/${id}/review`,
        { rating: Number(rating), comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      )

      setSuccess("Review added successfully.")
      setComment("")
      fetchProperty()

    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Failed to submit review."
      )
    }
  }

  const nextImage = () => {
    if (!property?.images?.length) return
    setCurrentImage(prev =>
      prev === property.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    if (!property?.images?.length) return
    setCurrentImage(prev =>
      prev === 0 ? property.images.length - 1 : prev - 1
    )
  }

  if (loading) return <div className="p-10 text-gray-500 dark:text-gray-400">Loading...</div>
  if (!property) return <div className="p-10 text-gray-500 dark:text-gray-400">Property not found.</div>

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 px-6 md:px-12 py-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">

        {property.images && property.images.length > 0 && (
          <div className="relative mb-8">

           <img
  src={property.images[0]}
  alt=""
  className="w-full h-96 object-cover rounded-lg"
/>

            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 text-white px-3 py-2 rounded-lg"
                >
                  ‹
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 text-white px-3 py-2 rounded-lg"
                >
                  ›
                </button>
              </>
            )}

          </div>
        )}

        <h1 className="text-3xl font-semibold mb-2 text-gray-900 dark:text-white">
          {property.city}
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-4">
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

        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {property.bedrooms} BHK • {property.area_sqft} sqft
        </p>

        <p className="mb-6 text-gray-800 dark:text-gray-300">
          {property.description}
        </p>

        {/*  CONTACT OWNER  */}
        {role === "customer" && property.owner_email && (
          <div className="mb-8 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <h3 className="font-semibold text-lg mb-2">
              Contact Owner
            </h3>

            <p className="text-gray-700 dark:text-gray-300">
              Email:
              <a
                href={`mailto:${property.owner_email}`}
                className="ml-2 font-medium underline hover:opacity-70 transition"
              >
                {property.owner_email}
              </a>
            </p>
          </div>
        )}

        {/* RATING + WISHLIST */}
        <div className="flex items-center justify-between mb-6">

          <p className="font-semibold text-gray-900 dark:text-white">
            Average Rating: ⭐ {property.average_rating}
          </p>

          {role === "customer" && (
            <button
              onClick={handleWishlist}
              disabled={wishlistAdded}
              className="text-3xl transition transform hover:scale-110"
            >
              <span
                className={`${
                  wishlistAdded ? "text-red-600" : "text-gray-400 dark:text-gray-500"
                }`}
              >
                ♥
              </span>
            </button>
          )}

        </div>

        <button
          onClick={handleAnalyze}
          className="px-6 py-3 bg-black text-white rounded-lg hover:opacity-80 transition"
        >
          Analyze Pricing
        </button>

        {analysis && (
          <div className="mt-6 p-6 border border-borderSoft dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 transition-colors duration-300 space-y-2">

            <p>
              <strong>Market Rent:</strong> ₹{analysis.predicted_rent}
            </p>

            <p className={`font-semibold ${
              analysis.market_status === "Underpriced"
                ? "text-green-600"
                : analysis.market_status === "Overpriced"
                ? "text-red-600"
                : "text-gray-700 dark:text-gray-300"
            }`}>
              {analysis.message}
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Typical market range: ₹
              {analysis.market_range.low} - ₹
              {analysis.market_range.high}
            </p>
          </div>
        )}

        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Reviews ({property.reviews?.length || 0})
          </h2>

          {property.reviews?.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No reviews yet.</p>
          ) : (
            property.reviews.map((r, index) => (
              <div key={index} className="border-b border-borderSoft dark:border-gray-700 py-4">
                <p className="font-semibold">⭐ {r.rating}</p>
                <p className="text-gray-600 dark:text-gray-400">{r.comment}</p>
              </div>
            ))
          )}
        </div>

        {role === "customer" && (
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Leave a Review
            </h3>

            <form onSubmit={handleReviewSubmit} className="space-y-4">

              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="border border-borderSoft dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white p-3 rounded-lg w-full transition-colors duration-300"
              >
                <option value={5}>5 ⭐</option>
                <option value={4}>4 ⭐</option>
                <option value={3}>3 ⭐</option>
                <option value={2}>2 ⭐</option>
                <option value={1}>1 ⭐</option>
              </select>

              <textarea
                placeholder="Write your review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="border border-borderSoft dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white p-3 rounded-lg w-full transition-colors duration-300"
                rows="4"
              />

              <button
                type="submit"
                className="px-6 py-3 bg-black text-white rounded-lg hover:opacity-80 transition"
              >
                Submit Review
              </button>
            </form>
          </div>
        )}

        {error && <div className="mt-6 text-red-600">{error}</div>}
        {success && <div className="mt-6 text-green-600">{success}</div>}

      </div>
    </div>
  )
}