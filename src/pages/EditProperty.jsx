import { useCallback, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "../api/axios";

export default function EditProperty() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    city: "",
    locality: "",
    bedrooms: "",
    area_sqft: "",
    rent: "",
    description: ""
  })

  const fetchProperty = useCallback(async () => {
    const res = await axios.get(
      `/properties/${id}`
    )
    setForm(res.data)
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    await axios.put(
      `/properties/${id}`,
      form
    )

    navigate("/my-listings")
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors px-12 py-12">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-3xl font-semibold mb-8 dark:text-white">
          Edit Property
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            className="border p-3 w-full rounded dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />

          <input
            name="locality"
            value={form.locality}
            onChange={handleChange}
            className="border p-3 w-full rounded dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />

          <input
            name="bedrooms"
            value={form.bedrooms}
            onChange={handleChange}
            className="border p-3 w-full rounded dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />

          <input
            name="area_sqft"
            value={form.area_sqft}
            onChange={handleChange}
            className="border p-3 w-full rounded dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />

          <input
            name="rent"
            value={form.rent}
            onChange={handleChange}
            className="border p-3 w-full rounded dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="border p-3 w-full rounded dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />

          <button
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl transition"
          >
            Update Property
          </button>

        </form>

      </div>
    </div>
  )
}
