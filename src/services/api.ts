import axios from 'axios'

const api = axios.create({
  // Ajuste para a URL da sua API .NET quando ela existir
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

export default api
