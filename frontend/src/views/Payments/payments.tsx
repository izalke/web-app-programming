import React from "react"
import { useNavigate } from "react-router-dom"
import Payments from "./index"

const PaymentsView: React.FC = () => {
  const navigate = useNavigate()

  const authToken = localStorage.getItem("authToken")

  // Jeśli brak tokena, przekieruj na login
  if (!authToken) {
    navigate("/login")
    return null
  }

  const handleNavigateBack = () => {
    navigate("/vehicles")
  }

  return <Payments token={authToken} onNavigateBack={handleNavigateBack} />
}

export default PaymentsView
