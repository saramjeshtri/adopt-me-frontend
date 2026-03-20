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

export const uploadReportMedia = (reportId: number, file: File) => {
  const form = new FormData()
  form.append('file', file)
  return api.post(`/reports/${reportId}/media`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(res => res.data)
}

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

export const adminGetAnimal = (id: number) =>
  api.get(`/admin/animals/${id}`).then(res => res.data)

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

export const adminDeleteAnimalPhoto = (animalId: number, photoId: number) =>
  api.delete(`/admin/animals/${animalId}/photos/${photoId}`).then(res => res.data)

// EVENTS (public)
export const getEvents = () =>
  api.get('/events/').then(res => res.data)

// EVENTS (admin)
export const adminGetEvents = () =>
  api.get('/admin/events/').then(res => res.data)

export const adminCreateEvent = (data: object) =>
  api.post('/admin/events/', data).then(res => res.data)

export const adminUpdateEvent = (id: number, data: object) =>
  api.patch(`/admin/events/${id}`, data).then(res => res.data)

export const adminDeleteEvent = (id: number) =>
  api.delete(`/admin/events/${id}`).then(res => res.data)

// SURRENDER (public)
export const createSurrender = (data: object) =>
  api.post('/surrender/', data).then(res => res.data)

export const uploadSurrenderMedia = (surrenderId: number, file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post(`/surrender/${surrenderId}/media`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(res => res.data)
}

// SURRENDER (admin)
export const adminGetSurrenders = (status?: string) =>
  api.get('/admin/surrender/', { params: status ? { status } : {} }).then(res => res.data)

export const adminUpdateSurrenderStatus = (id: number, status: string) =>
  api.patch(`/admin/surrender/${id}/status`, { status }).then(res => res.data)

export const adminAcceptSurrender = (id: number, data: object) =>
  api.post(`/admin/surrender/${id}/accept`, data).then(res => res.data)

export const adminRejectSurrender = (id: number, reason: string) =>
  api.post(`/admin/surrender/${id}/reject`, { reason }).then(res => res.data)

export const adminDeleteSurrender = (id: number) =>
  api.delete(`/admin/surrender/${id}`).then(res => res.data)

export default api