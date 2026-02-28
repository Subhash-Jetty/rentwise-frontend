import axios from "axios"

const API = axios.create({
  baseURL: "https://rentwise-backend-du7p.onrender.com",
})

export default API