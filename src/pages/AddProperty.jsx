import { useState, useRef } from "react"
import axios from "../api/axios";
import { useNavigate } from "react-router-dom"

const MAX_IMAGES = 8
const MAX_FILE_SIZE_MB = 5

export default function AddProperty() {

  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [city, setCity] = useState("")
  const [locality, setLocality] = useState("")
  const [bedrooms, setBedrooms] = useState("")
  const [areaSqft, setAreaSqft] = useState("")
  const [rent, setRent] = useState("")
  const [description, setDescription] = useState("")
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [dragActive, setDragActive] = useState(false)

  const processFiles = (files) => {
    const fileArray = Array.from(files)
    const validFiles = []
    const errors = []

    for (const file of fileArray) {
      if (!file.type.startsWith("image/")) {
        errors.push(`${file.name} is not an image`)
        continue
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        errors.push(`${file.name} exceeds ${MAX_FILE_SIZE_MB}MB limit`)
        continue
      }
      validFiles.push(file)
    }

    const totalCount = imageFiles.length + validFiles.length
    if (totalCount > MAX_IMAGES) {
      errors.push(`Maximum ${MAX_IMAGES} images allowed. ${totalCount - MAX_IMAGES} file(s) skipped.`)
      validFiles.splice(MAX_IMAGES - imageFiles.length)
    }

    if (errors.length > 0) {
      setError(errors.join(". "))
      setTimeout(() => setError(""), 5000)
    }

    if (validFiles.length === 0) return

    const newPreviews = validFiles.map(file => URL.createObjectURL(file))
    setImageFiles(prev => [...prev, ...validFiles])
    setImagePreviews(prev => [...prev, ...newPreviews])
  }

  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index])
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
    }
    e.target.value = ""
  }

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

      for (const file of imageFiles) {
        formData.append("images", file)
      }

      await axios.post("/properties/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      imagePreviews.forEach(url => URL.revokeObjectURL(url))
      navigate("/my-listings")

    } catch (err) {
      console.error(err)
      setError(err.response?.data?.error || "Failed to create property.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors px-6 md:px-12 py-16">

      <div className="max-w-2xl mx-auto">

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Add Property
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            List your property for potential tenants to discover
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* City & Locality Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                City *
              </label>
              <input
                type="text"
                placeholder="e.g. Hyderabad"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Locality *
              </label>
              <input
                type="text"
                placeholder="e.g. Gachibowli"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                required
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          {/* Bedrooms & Area Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Bedrooms *
              </label>
              <input
                type="number"
                placeholder="e.g. 2"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                min="1"
                required
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Area (sqft) *
              </label>
              <input
                type="number"
                placeholder="e.g. 1200"
                value={areaSqft}
                onChange={(e) => setAreaSqft(e.target.value)}
                min="1"
                required
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          {/* Rent */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Monthly Rent (₹) *
            </label>
            <input
              type="number"
              placeholder="e.g. 25000"
              value={rent}
              onChange={(e) => setRent(parseInt(e.target.value || 0))}
              step="1"
              min="0"
              required
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Description
            </label>
            <textarea
              placeholder="Describe your property — amenities, neighborhood, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none"
            />
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Property Images ({imageFiles.length}/{MAX_IMAGES})
            </label>

            {/* Drag and Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => imageFiles.length < MAX_IMAGES && fileInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200
                ${dragActive
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                  : "border-gray-300 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-600 bg-gray-50 dark:bg-gray-800/50"
                }
                ${imageFiles.length >= MAX_IMAGES ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  PNG, JPG, WEBP up to {MAX_FILE_SIZE_MB}MB each · Max {MAX_IMAGES} images
                </p>
              </div>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeImage(index)
                      }}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                    >
                      ✕
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-1.5 left-1.5 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                        Cover
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white py-3.5 rounded-xl transition font-semibold text-lg shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating Property...
              </span>
            ) : "Create Property"}
          </button>

        </form>

      </div>
    </div>
  )
}