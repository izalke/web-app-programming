import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Star,
  Users,
  Fuel,
  MapPin,
  CreditCard,
  Receipt,
  User,
  Settings,
} from "lucide-react"
import { fetchVehicles, Vehicle, fetchPayments } from "../../api"
import Payments from "../Payments"
import Reservations from "../Reservation"
import styles from "./vehiclesComponent.module.scss"

interface VehiclesComponentProps {
  token?: string
}

const VehiclesComponent: React.FC<VehiclesComponentProps> = ({ token }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<
    "vehicles" | "payments" | "reservations"
  >("vehicles")
  const [pendingPaymentsCount, setPendingPaymentsCount] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get token from props or localStorage
        const authToken = token || localStorage.getItem("authToken")

        if (!authToken) {
          // Redirect to login if no token found
          navigate("/login")
          return
        }

        const vehiclesData = await fetchVehicles(authToken)
        console.log("vehiclesData from API:", vehiclesData)
        setVehicles(vehiclesData)

        // Pobierz również płatności żeby sprawdzić ile jest oczekujących
        try {
          const paymentsData = await fetchPayments(authToken)
          const pendingCount = paymentsData.filter(
            (p) => p.status.toLowerCase() === "pending"
          ).length
          setPendingPaymentsCount(pendingCount)
        } catch (paymentError) {
          console.error("Error fetching payments:", paymentError)
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load vehicles"
        setError(errorMessage)
        console.error("Error fetching vehicles:", err)

        // If authentication error, redirect to login
        if (err instanceof Error && err.message.includes("authentication")) {
          localStorage.removeItem("authToken")
          navigate("/login")
        }
      } finally {
        setLoading(false)
      }
    }

    loadVehicles()
  }, [token, navigate])

  const getVehicleType = (brand: string, model: string): string => {
    const modelLower = model.toLowerCase()
    const brandLower = brand.toLowerCase()

    if (
      modelLower.includes("suv") ||
      modelLower.includes("x3") ||
      modelLower.includes("x5") ||
      modelLower.includes("nx") ||
      brandLower.includes("lexus")
    ) {
      return "SUV"
    } else if (
      modelLower.includes("van") ||
      modelLower.includes("alphard") ||
      modelLower.includes("sienna")
    ) {
      return "Minivan"
    } else if (
      modelLower.includes("hatchback") ||
      modelLower.includes("yaris") ||
      modelLower.includes("corolla")
    ) {
      return "Hatchback"
    } else {
      return "Sedan"
    }
  }

  const getVehicleImage = (brand: string, model: string): string => {
    // Generate SVG based on vehicle type
    const type = getVehicleType(brand, model)
    const colors = {
      SUV: "#4b7688",
      Minivan: "#2d3348",
      Hatchback: "#6366f1",
      Sedan: "#059669",
    }

    const color = colors[type as keyof typeof colors] || "#6366f1"

    return `data:image/svg+xml;charset=UTF-8,%3Csvg width='200' height='120' viewBox='0 0 200 120' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='200' height='120' fill='%23f3f4f6'/%3E%3Crect x='20' y='35' width='160' height='50' rx='8' fill='${encodeURIComponent(
      color
    )}'/%3E%3Ccircle cx='55' cy='100' r='12' fill='%23374151'/%3E%3Ccircle cx='145' cy='100' r='12' fill='%23374151'/%3E%3Ctext x='100' y='65' text-anchor='middle' fill='white' font-family='Arial' font-size='12' font-weight='bold'%3E${brand}%3C/text%3E%3C/svg%3E`
  }

  const handleBookVehicle = (vehicle: Vehicle) => {
    console.log("Booking vehicle:", vehicle)
    // Here you would typically navigate to booking page or open booking modal
    // For now, just log the action
    alert(`Booking ${vehicle.brand} ${vehicle.model} - ${vehicle.licensePlate}`)
  }

  const retryFetch = () => {
    setError(null)
    setLoading(true)
    // Re-trigger useEffect by updating a state that's in the dependency array
    const authToken = token || localStorage.getItem("authToken")
    if (!authToken) {
      navigate("/login")
      return
    }
    // Force re-render to trigger useEffect
    window.location.reload()
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    navigate("/login")
  }

  // Funkcje do przełączania widoku
  const handleNavigateToPayments = () => {
    setCurrentView("payments")
  }

  const handleNavigateToReservations = () => {
    setCurrentView("reservations")
  }

  const handleNavigateToVehicles = () => {
    setCurrentView("vehicles")
  }

  // Pobierz token dla komponentów podrzędnych
  const authToken = token || localStorage.getItem("authToken")
  if (!authToken) {
    navigate("/login")
    return null
  }

  // Jeśli aktualny widok to płatności, wyświetl komponent płatności
  if (currentView === "payments") {
    return (
      <Payments token={authToken} onNavigateBack={handleNavigateToVehicles} />
    )
  }

  // Jeśli aktualny widok to rezerwacje, wyświetl komponent rezerwacji
  if (currentView === "reservations") {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <button
              onClick={handleNavigateToVehicles}
              className={styles.backButton}
            >
              ← Powrót do pojazdów
            </button>
          </div>
        </div>
        <Reservations token={authToken} />
      </div>
    )
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading vehicles...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <p className={styles.errorText}>{error}</p>
          <div
            style={{ display: "flex", gap: "10px", justifyContent: "center" }}
          >
            <button onClick={retryFetch} className={styles.retryButton}>
              Try Again
            </button>
            <button onClick={handleLogout} className={styles.retryButton}>
              Login Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  const availableVehicles = vehicles.filter((v) => v.available)
  const minPrice =
    vehicles.length > 0 ? Math.min(...vehicles.map((v) => v.pricePerHour)) : 0

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Available Vehicles</h1>
          <p className={styles.subtitle}>
            Choose from our fleet of premium vehicles
          </p>

          {/* Navigation Menu */}
          <div className={styles.navigationMenu}>
            <button
              onClick={handleNavigateToPayments}
              className={styles.navButton}
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Płatności
              {pendingPaymentsCount > 0 && (
                <span className={styles.notificationBadge}>
                  {pendingPaymentsCount}
                </span>
              )}
            </button>
            <button
              onClick={handleNavigateToReservations}
              className={styles.navButton}
            >
              <Receipt className="w-5 h-5 mr-2" />
              Rezerwacje
            </button>
            <button
              onClick={() => alert("Funkcja w budowie")}
              className={styles.navButton}
            >
              <User className="w-5 h-5 mr-2" />
              Profil
            </button>
          </div>

          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Top picks section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Top picks vehicle this month</h2>
          <p className={styles.sectionSubtitle}>
            Experience the ultimate of amazing journey with our top picks.
          </p>

          {vehicles.length === 0 ? (
            <div className={styles.errorContent}>
              <p className={styles.errorText}>
                No vehicles available at the moment.
              </p>
            </div>
          ) : (
            <div className={styles.vehiclesGrid}>
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className={`${styles.vehicleCard} ${
                    !vehicle.available ? styles.unavailable : ""
                  }`}
                >
                  {/* Vehicle Image */}
                  <div className={styles.vehicleImageContainer}>
                    <img
                      src={getVehicleImage(vehicle.brand, vehicle.model)}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className={styles.vehicleImage}
                    />
                    <div className={styles.vehicleType}>
                      {getVehicleType(vehicle.brand, vehicle.model)}
                    </div>
                    {!vehicle.available && (
                      <div className={styles.unavailableOverlay}>
                        <span className={styles.unavailableText}>
                          Not Available
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Vehicle Details */}
                  <div className={styles.vehicleDetails}>
                    <h3 className={styles.vehicleName}>
                      {vehicle.brand} {vehicle.model}
                    </h3>

                    <div className={styles.vehicleSpecs}>
                      <div className={styles.specItem}>
                        <Users className={styles.icon} />
                        <span>Auto</span>
                      </div>
                      <div className={styles.specItem}>
                        <Fuel className={styles.icon} />
                        <span>Petrol</span>
                      </div>
                    </div>

                    <div className={styles.vehiclePlate}>
                      <MapPin className={styles.icon} />
                      <span>{vehicle.licensePlate}</span>
                    </div>

                    <div className={styles.vehicleFooter}>
                      <div className={styles.rating}>
                        <div className={styles.stars}>
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={styles.star} />
                          ))}
                        </div>
                        <span className={styles.ratingValue}>4.7</span>
                      </div>
                      <div className={styles.priceContainer}>
                        <div className={styles.price}>
                          ${vehicle.pricePerHour}
                        </div>
                        <div className={styles.priceUnit}>/hour</div>
                      </div>
                    </div>

                    <button
                      className={`${styles.bookButton} ${
                        vehicle.available
                          ? styles.available
                          : styles.unavailable
                      }`}
                      disabled={!vehicle.available}
                      onClick={() => handleBookVehicle(vehicle)}
                    >
                      {vehicle.available ? "Book Now" : "Unavailable"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        {vehicles.length > 0 && (
          <div className={styles.statsContainer}>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={`${styles.statValue} ${styles.blue}`}>
                  {availableVehicles.length}
                </div>
                <div className={styles.statLabel}>Available Vehicles</div>
              </div>
              <div className={styles.statItem}>
                <div className={`${styles.statValue} ${styles.green}`}>
                  {vehicles.length}
                </div>
                <div className={styles.statLabel}>Total Fleet</div>
              </div>
              <div className={styles.statItem}>
                <div className={`${styles.statValue} ${styles.purple}`}>
                  ${minPrice}
                </div>
                <div className={styles.statLabel}>Starting Price</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VehiclesComponent
