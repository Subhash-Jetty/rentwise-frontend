import { useCallback, useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "../api/axios";
import { FALLBACK_PROPERTY_IMAGE } from "../constants/images"

const MAX_IMAGES = 8
const MAX_FILE_SIZE_MB = 5

export default function EditProperty() {

  const { id } = useParams()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
    city: "",
    locality: "",
    bedrooms: "",
    area_sqft: "",
    rent: "",
    description: ""
  })

  const [existingImages, setExistingImages] = useState([])
  const [deletedImageIds, setDeletedImageIds] = useState([])
  const [newImageFiles, setNewImageFiles] = useState([])
  const [newImagePreviews, setNewImagePreviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [dragActive, setDragActive] = useState(false)

  const fetchProperty = useCallback(async () => {
    try {
      const res = await axios.get(`/properties/${id}`)
      const data = res.data
      setForm({
        city: data.city || "",
        locality: data.locality || "",
        bedrooms: data.bedrooms || "",
        area_sqft: data.area_sqft || "",
        rent: data.rent || "",
        description: data.description || ""
      })
      setExistingImages(data.images || [])
    } catch {
      setError("Failed to load property.")
    }
    setFetching(false)
  }, [id])

  useEffect(() => {
    fetchProperty()
  }, [fetchProperty])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const totalImageCount = existingImages.filter(img => !deletedImageIds.includes(img.id)).length + newImageFiles.length

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

    const newTotal = totalImageCount + validFiles.length
    if (newTotal > MAX_IMAGES) {
      errors.push(`Maximum ${MAX_IMAGES} images allowed. ${newTotal - MAX_IMAGES} file(s) skipped.`)
      validFiles.splice(MAX_IMAGES - totalImageCount)
    }

    if (errors.length > 0) {
      setError(errors.join(". "))
      setTimeout(() => setError(""), 5000)
    }

    if (validFiles.length === 0) return

    const newPreviews = validFiles.map(file => URL.createObjectURL(file))
    setNewImageFiles(prev => [...prev, ...validFiles])
    setNewImagePreviews(prev => [...prev, ...newPreviews])
  }

  const markExistingImageForDeletion = (imageId) => {
    setDeletedImageIds(prev => [...prev, imageId])
  }

  const undoDeleteExistingImage = (imageId) => {
    setDeletedImageIds(prev => prev.filter(id => id !== imageId))
  }

  const removeNewImage = (index) => {
    URL.revokeObjectURL(newImagePreviews[index])
    setNewImageFiles(prev => prev.filter((_, i) => i !== index))
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index))
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
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const formData = new FormData()

      formData.append("city", form.city)
      formData.append("locality", form.locality)
      formData.append("bedrooms", form.bedrooms)
      formData.append("area_sqft", form.area_sqft)
      formData.append("rent", form.rent)
      formData.append("description", form.description)

      if (deletedImageIds.length > 0) {
        formData.append("deleted_image_ids", JSON.stringify(deletedImageIds))
      }

      for (const file of newImageFiles) {
        formData.append("images", file)
      }

      await axios.put(`/properties/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      newImagePreviews.forEach(url => URL.revokeObjectURL(url))
      setSuccess("Property updated successfully!")

      setTimeout(() => navigate("/my-listings"), 1200)

    } catch (err) {
      console.error(err)
      setError(err.response?.data?.error || "Update failed.")
    }

    setLoading(false)
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading property...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors px-6 md:px-12 py-16">
      <div className="max-w-2xl mx-auto">

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Edit Property
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Update your property details and images
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-300 p-4 rounded-xl mb-6 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* City & Locality Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                City
              </label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Locality
              </label>
              <input
                name="locality"
                value={form.locality}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          {/* Bedrooms & Area Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Bedrooms
              </label>
              <input
                name="bedrooms"
                type="number"
                value={form.bedrooms}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Area (sqft)
              </label>
              <input
                name="area_sqft"
                type="number"
                value={form.area_sqft}
                onChange={handleChange}
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
            </div>
          </div>

          {/* Rent */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Monthly Rent (₹)
            </label>
            <input
              name="rent"
              type="number"
              value={form.rent}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none"
            />
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Current Images
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {existingImages.map((img) => {
                  const isDeleted = deletedImageIds.includes(img.id)
                  return (
                    <div
                      key={img.id}
                      className={`relative group aspect-square rounded-xl overflow-hidden border transition-all duration-200 ${
                        isDeleted
                          ? "border-red-300 dark:border-red-700 opacity-50"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <img
                        src={img.url || FALLBACK_PROPERTY_IMAGE}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_PROPERTY_IMAGE; }}
                      />

                      {isDeleted ? (
                        <>
                          <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center">
                            <span className="text-white text-xs font-medium">Marked for deletion</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => undoDeleteExistingImage(img.id)}
                            className="absolute top-1.5 right-1.5 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-green-600 transition"
                            title="Undo delete"
                          >
                            ↺
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200" />
                          <button
                            type="button"
                            onClick={() => markExistingImageForDeletion(img.id)}
                            className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                            title="Remove image"
                          >
                            ✕
                          </button>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>

              {deletedImageIds.length > 0 && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-2">
                  {deletedImageIds.length} image(s) will be removed on save
                </p>
              )}
            </div>
          )}

          {/* Add New Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Add New Images ({totalImageCount}/{MAX_IMAGES})
            </label>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => totalImageCount < MAX_IMAGES && fileInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200
                ${dragActive
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                  : "border-gray-300 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-600 bg-gray-50 dark:bg-gray-800/50"
                }
                ${totalImageCount >= MAX_IMAGES ? "opacity-50 cursor-not-allowed" : ""}
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
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  PNG, JPG, WEBP up to {MAX_FILE_SIZE_MB}MB each
                </p>
              </div>
            </div>

            {/* New Image Previews */}
            {newImagePreviews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                {newImagePreviews.map((preview, index) => (
                  <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-indigo-200 dark:border-indigo-700">
                    <img
                      src={preview}
                      alt={`New ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeNewImage(index)
                      }}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                    >
                      ✕
                    </button>
                    <span className="absolute bottom-1.5 left-1.5 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                      New
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/my-listings")}
              className="flex-1 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-3.5 rounded-xl transition font-semibold hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white py-3.5 rounded-xl transition font-semibold text-lg shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Updating...
                </span>
              ) : "Update Property"}
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}
