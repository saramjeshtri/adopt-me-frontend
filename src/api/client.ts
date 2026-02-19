import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

// An "interceptor" runs before every request
// Here we check: is this request going to /admin?
// If yes, attach the secret API key your backend requires
api.interceptors.request.use((config) => {
  if (config.url?.startsWith('/admin')) {
    config.headers['X-API-Key'] = import.meta.env.VITE_ADMIN_API_KEY || ''
  }
  return config
})

// All the functions our pages will use to talk to the backend

//ANIMALS 
export const getAnimals = () =>
  api.get('/animals/').then(res => res.data)

export const getAnimal = (id: number) =>
  api.get(`/animals/${id}`).then(res => res.data)

export const getAnimalStats = () =>
  api.get('/animals/statistika').then(res => res.data)

//REPORTS
export const createReport = (data: object) =>
  api.post('/reports/', data).then(res => res.data)

export const getReport = (id: number) =>
  api.get(`/reports/${id}`).then(res => res.data)

//MEETINGS
export const createMeeting = (data: object) =>
  api.post('/meetings/', data).then(res => res.data)

export const getMeeting = (id: number) =>
  api.get(`/meetings/${id}`).then(res => res.data)

//ADMIN
export const adminGetReports = (params?: object) =>
  api.get('/admin/reports', { params }).then(res => res.data)

export const adminUpdateReport = (id: number, data: object) =>
  api.patch(`/admin/reports/${id}`, data).then(res => res.data)

export const adminGetAnimals = (params?: object) =>
  api.get('/admin/animals', { params }).then(res => res.data)

export const adminUpdateAnimal = (id: number, data: object) =>
  api.patch(`/admin/animals/${id}`, data).then(res => res.data)

export const adminGetMeetings = (params?: object) =>
  api.get('/admin/meetings', { params }).then(res => res.data)

export const adminUpdateMeeting = (id: number, data: object) =>
  api.patch(`/admin/meetings/${id}`, data).then(res => res.data)

export const adminUploadAnimalPhoto = (animalId: number, file: File) => {
  const form = new FormData()
  form.append('file', file)
  return api.post(`/admin/animals/${animalId}/photos`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(res => res.data)
}

export default api