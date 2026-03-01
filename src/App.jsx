import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"
import Layout from "./components/layout/Layout"

import Home from "./pages/Home"
import Explore from "./pages/Explore"   
import Login from "./pages/Login"
import Register from "./pages/Register"
import AddProperty from "./pages/AddProperty"
import PropertyDetails from "./pages/PropertyDetails"
import Wishlist from "./pages/Wishlist"
import MyListings from "./pages/MyListings"
import ProtectedRoute from "./components/ProtectedRoute"
import EditProperty from "./pages/EditProperty"

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">

        <Navbar />

        <Layout>
          <Routes>

            {/* HOME (Hero Page) */}
            <Route path="/" element={<Home />} />

            {/* EXPLORE (Listings Page) */}
            <Route path="/explore" element={<Explore />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/add"
              element={
                <ProtectedRoute allowedRole="renter">
                  <AddProperty />
                </ProtectedRoute>
              }
            />

            <Route
              path="/wishlist"
              element={
                <ProtectedRoute allowedRole="customer">
                  <Wishlist />
                </ProtectedRoute>
              }
            />

            <Route
              path="/edit/:id"
              element={
                <ProtectedRoute allowedRole="renter">
                  <EditProperty />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-listings"
              element={
                <ProtectedRoute allowedRole="renter">
                  <MyListings />
                </ProtectedRoute>
              }
            />

            <Route path="/property/:id" element={<PropertyDetails />} />

          </Routes>
        </Layout>

      </div>
    </Router>
  )
}