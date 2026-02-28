import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export default function AddProperty() {

  const navigate = useNavigate()

  const [city, setCity] = useState("")
  const [locality, setLocality] = useState("")
  const [bedrooms, setBedrooms] = useState("")
  const [areaSqft, setAreaSqft] = useState("")
  const [rent, setRent] = useState("")
  const [description, setDescription] = useState("")
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem("token")

    if (!token) {
      setError("You must be logged in.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const formData = new FormData()

      formData.append("city", city)
      formData.append("locality", locality)
      formData.append("bedrooms", bedrooms)
      formData.append("area_sqft", areaSqft)
      formData.append("rent", rent)
      formData.append("description", description)

      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i])
      }

      await axios.post(
  "https://rentwise-backend-du7p.onrender.com/properties/",
  formData,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
)
      navigate("/")

    } catch (err) {
      console.error(err)
      setError("Failed to create property.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors px-12 py-16">

      <div className="max-w-2xl mx-auto">

        <div className="mb-10">
  <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
    Add Property
  </h1>
</div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white p-3 rounded"
          />

          <input
            type="text"
            placeholder="Locality"
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            required
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white p-3 rounded"
          />

          <input
            type="number"
            placeholder="Bedrooms"
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            required
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white p-3 rounded"
          />

          <input
            type="number"
            placeholder="Area (sqft)"
            value={areaSqft}
            onChange={(e) => setAreaSqft(e.target.value)}
            required
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white p-3 rounded"
          />

          <input
  type="number"
  placeholder="Rent"
  value={rent}
  onChange={(e) => setRent(parseInt(e.target.value || 0))}
  step="1"
  min="0"
  required
  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white p-3 rounded"
/>

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white p-3 rounded"
          />

         <div className="flex items-center gap-4">

  <label className="text-sm text-black dark:text-white">
    Images
  </label>

  <label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg cursor-pointer transition">
    Upload
    <input
      type="file"
      multiple
      onChange={(e) => setImages(e.target.files)}
      className="hidden"
    />
  </label>

  {images.length > 0 && (
    <span className="text-xs text-gray-500 dark:text-gray-400">
      {images.length} selected
    </span>
  )}

</div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl transition font-semibold"
          >
            {loading ? "Creating..." : "Create Property"}
          </button>

        </form>

      </div>
    </div>
  )
}