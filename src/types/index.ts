export type ReportType =
  | 'Abuzim me kafshë'
  | 'Kafshë e humbur'
  | 'Kafshë agresive'
  | 'Kafshë e lënduar'
  | 'Braktisje kafshësh'
  | 'Tjetër'

export type ReportStatus =
  | 'Hapur'
  | 'Në proces'
  | 'Zgjidhur - Kafshë e gjetur'
  | 'Zgjidhur - Nuk u gjet'
  | 'Zgjidhur - Kthyer pronarit'

export type AnimalSpecies = 'Qen' | 'Mace' | 'Zog' | 'Kalë' | 'Tjetër'

export type AnimalGender = 'Mashkull' | 'Femër' | 'E panjohur'

export type AdoptionStatus =
  | 'Disponueshme'
  | 'Takim i planifikuar'
  | 'Adoptuar'
  | 'Jo disponueshme'

export type HealthStatus = 'Shëndetshëm' | 'I lënduar' | 'Në trajtim'

export type MeetingStatus = 'Në pritje' | 'Konfirmuar' | 'Përfunduar' | 'Anulluar'

// These are "interfaces" — they describe the shape of objects
// For example, every Animal object from the backend will have these fields

export interface AnimalPhoto {
  photo_id: number
  photo_url: string
  is_primary: boolean
  animal_id: number
}

export interface Animal {
  animal_id: number
  name?: string           // ? means optional — might not exist
  species: AnimalSpecies
  breed?: string
  age_estimate?: string
  gender?: AnimalGender
  description?: string
  health_status?: HealthStatus
  adoption_status: AdoptionStatus
  added_at: string        // dates come as strings from the API
  adopted_at?: string
  report_id: number
  photos?: AnimalPhoto[]  // [] means "array of"
}

export interface Department {
  department_id: number
  department_name: string
  department_type: string
  contact_email?: string
  contact_phone?: string
}

export interface Media {
  media_id: number
  media_type: 'foto' | 'video'
  file_url: string
  uploaded_at: string
  report_id: number
}

export interface Report {
  report_id: number
  report_type: ReportType
  report_description: string
  location_address: string
  latitude: number
  longitude: number
  report_status: ReportStatus
  created_at: string
  resolved_at?: string
  phoneNr?: string
  email?: string
  department_id: number
  media?: Media[]
  department?: Department
}

export interface AdoptionMeeting {
  meeting_id: number
  visitor_name: string
  visitor_phone: string
  visitor_email?: string
  preferred_date: string
  preferred_time: string
  status: MeetingStatus
  notes?: string
  created_at: string
  animal_id: number
}

export interface AdoptionStats {
  total_rescued: number
  currently_available: number
  meetings_scheduled: number
  successfully_adopted: number
}