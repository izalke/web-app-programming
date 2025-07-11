import axios from "axios"

const API_BASE_URL = "http://localhost:8000/api"

export interface RegisterResponse {
  message: string
}

export interface RegisterError {
  error: string
}

export async function registerUser(
  email: string,
  password: string
): Promise<RegisterResponse> {
  try {
    const response = await axios.post<RegisterResponse>(
      `${API_BASE_URL}/register`,
      {
        email,
        password,
      }
    )

    return response.data
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(error.response.data.error)
    } else {
      throw new Error("Nieznany błąd podczas rejestracji")
    }
  }
}

// Login
export interface LoginResponse {
  token: string
}

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  try {
    const response = await axios.post<LoginResponse>(`${API_BASE_URL}/login`, {
      email,
      password,
    })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Unknown login error")
  }
}

// --- Unified Vehicle Interface ---
export interface Vehicle {
  id: number
  brand: string
  model: string
  licensePlate: string
  pricePerHour: number
  available: boolean
  latitude?: number
  longitude?: number
}

// Vehicle input for creating/updating (same as Vehicle but without id)
export interface VehicleInput {
  brand: string
  model: string
  licensePlate: string
  available: boolean
  latitude?: number
  longitude?: number
  pricePerHour: number
}

//Reservation
export interface Reservation {
  id: number
  vehicle: Vehicle
  startTime: string
  endTime: string
  status: string
}

export interface CreateReservationInput {
  vehicle: string
  startTime: string
  endTime: string
}

export async function fetchReservations(token: string): Promise<Reservation[]> {
  const response = await axios.get(`${API_BASE_URL}/reservations`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function createReservation(
  input: CreateReservationInput,
  token: string
): Promise<Reservation> {
  const response = await axios.post(`${API_BASE_URL}/reservations`, input, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function cancelReservation(
  reservationId: number,
  token: string
): Promise<void> {
  await axios.delete(`${API_BASE_URL}/reservations/${reservationId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

//Payment
export interface Payment {
  id: number
  amount: number
  status: string
  reservation: Reservation
}

export interface CreatePaymentInput {
  reservation: string
  amount: number
}

export async function createPayment(
  input: CreatePaymentInput,
  token: string
): Promise<Payment> {
  const response = await axios.post(`${API_BASE_URL}/payments`, input, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function fetchPayments(token: string): Promise<Payment[]> {
  const response = await axios.get(`${API_BASE_URL}/payments`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function payPayment(
  paymentId: number,
  token: string
): Promise<{ message: string }> {
  const response = await axios.post(
    `${API_BASE_URL}/payments/${paymentId}/pay`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return response.data
}

// --- Vehicles ---
export async function fetchVehicles(token: string): Promise<Vehicle[]> {
  const response = await axios.get(`${API_BASE_URL}/vehicles`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (Array.isArray(response.data)) {
    return response.data
  }
  return response.data["hydra:member"] || []
}

export async function fetchVehicleById(
  id: number,
  token: string
): Promise<Vehicle> {
  const response = await axios.get(`${API_BASE_URL}/vehicles/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function createVehicle(
  input: VehicleInput,
  token: string
): Promise<Vehicle> {
  const response = await axios.post(`${API_BASE_URL}/vehicles`, input, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
  return response.data
}

export async function updateVehicle(
  id: number,
  input: VehicleInput,
  token: string
): Promise<Vehicle> {
  const response = await axios.put(`${API_BASE_URL}/vehicles/${id}`, input, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
  return response.data
}

export async function deleteVehicle(id: number, token: string): Promise<void> {
  await axios.delete(`${API_BASE_URL}/vehicles/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
