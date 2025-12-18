import axios from 'axios'
//Apontar para o Docker
// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3333/api', // URL do seu backend
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })

// export default api


// Use a URL do backend que está exposta no localhost da sua máquina
// (Assumindo que o backend está no Docker e a porta 3333 está mapeada para localhost:3333)
const API_BASE_URL = 'http://localhost:3333/api' // <--- Esta é a linha chave para rodar localmente

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
