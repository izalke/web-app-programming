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
