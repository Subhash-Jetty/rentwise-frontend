import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"

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

  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchProperty()
  }, [])

  const fetchProperty = async () => {
    const res = await axios.get(
      `https://rentwise-backend-du7p.onrender.com/properties/${id}`
    )
    setForm(res.data)
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    await axios.put(
      `https://rentwise-backend-du7p.onrender.com/properties/${id}`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    navigate("/my-listings")
  }

  return (
    <div className="min-h-screen bg-white px-12 py-12">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-3xl font-semibold mb-8">
          Edit Property
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            className="border p-3 w-full rounded"
          />

          <input
            name="locality"
            value={form.locality}
            onChange={handleChange}
            className="border p-3 w-full rounded"
          />

          <input
            name="bedrooms"
            value={form.bedrooms}
            onChange={handleChange}
            className="border p-3 w-full rounded"
          />

          <input
            name="area_sqft"
            value={form.area_sqft}
            onChange={handleChange}
            className="border p-3 w-full rounded"
          />

          <input
            name="rent"
            value={form.rent}
            onChange={handleChange}
            className="border p-3 w-full rounded"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="border p-3 w-full rounded"
          />

          <button
            className="bg-black text-white px-6 py-3 rounded"
          >
            Update Property
          </button>

        </form>

      </div>
    </div>
  )
}