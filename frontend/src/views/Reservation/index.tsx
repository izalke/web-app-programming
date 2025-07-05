import React, { useState, useEffect } from "react"
import {
  Calendar,
  Clock,
  Car,
  MapPin,
  CreditCard,
  X,
  AlertCircle,
} from "lucide-react"
import {
  fetchReservations,
  cancelReservation,
  createPayment,
  payPayment,
  fetchPayments,
  Reservation,
  Payment,
  CreatePaymentInput,
} from "../../api/index"
import styles from "./reservation.module.scss"

interface ReservationsProps {
  token: string
}

const Reservations: React.FC<ReservationsProps> = ({ token }) => {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    loadData()
  }, [token])

  const loadData = async () => {
    try {
      setLoading(true)
      const [reservationsData, paymentsData] = await Promise.all([
        fetchReservations(token),
        fetchPayments(token),
      ])
      setReservations(reservationsData)
      setPayments(paymentsData)
    } catch (err) {
      setError("Błąd podczas ładowania danych rezerwacji")
      console.error("Error loading reservations:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelReservation = async (reservationId: number) => {
    if (!window.confirm("Czy na pewno chcesz anulować tę rezerwację?")) {
      return
    }

    try {
      setProcessingIds((prev) => new Set(prev).add(reservationId))
      await cancelReservation(reservationId, token)
      await loadData() // Odśwież dane
    } catch (err) {
      setError("Błąd podczas anulowania rezerwacji")
      console.error("Error canceling reservation:", err)
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(reservationId)
        return newSet
      })
    }
  }

  const handleCreatePayment = async (reservation: Reservation) => {
    try {
      setProcessingIds((prev) => new Set(prev).add(reservation.id))
      const startTime = new Date(reservation.startTime)
      const endTime = new Date(reservation.endTime)
      const hours = Math.ceil(
        (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)
      )
      const amount = hours * reservation.vehicle.pricePerHour

      const paymentInput: CreatePaymentInput = {
        reservation: `/api/reservations/${reservation.id}`,
        amount: amount,
      }

      await createPayment(paymentInput, token)
      await loadData()
    } catch (err) {
      setError("Błąd podczas tworzenia płatności")
      console.error("Error creating payment:", err)
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(reservation.id)
        return newSet
      })
    }
  }

  const handlePayPayment = async (paymentId: number) => {
    try {
      setProcessingIds((prev) => new Set(prev).add(paymentId))
      await payPayment(paymentId, token)
      await loadData()
    } catch (err) {
      setError("Błąd podczas realizacji płatności")
      console.error("Error paying payment:", err)
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(paymentId)
        return newSet
      })
    }
  }

  const getPaymentForReservation = (
    reservationId: number
  ): Payment | undefined => {
    return payments.find((payment) => payment.reservation.id === reservationId)
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "active":
      case "confirmed":
        return styles.statusActive
      case "completed":
        return styles.statusCompleted
      case "cancelled":
        return styles.statusCancelled
      case "pending":
        return styles.statusPending
      default:
        return styles.statusDefault
    }
  }

  const calculateTotalCost = (reservation: Reservation): number => {
    const startTime = new Date(reservation.startTime)
    const endTime = new Date(reservation.endTime)
    const hours = Math.ceil(
      (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)
    )
    return hours * reservation.vehicle.pricePerHour
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Ładowanie rezerwacji...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Moje Rezerwacje</h1>
        <div className={styles.summary}>
          <span className={styles.count}>Łącznie: {reservations.length}</span>
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={() => setError("")} className={styles.closeError}>
            <X size={16} />
          </button>
        </div>
      )}

      {reservations.length === 0 ? (
        <div className={styles.emptyState}>
          <Car size={48} />
          <h2>Brak rezerwacji</h2>
          <p>
            Nie masz jeszcze żadnych rezerwacji. Zarezerwuj pojazd już teraz!
          </p>
        </div>
      ) : (
        <div className={styles.reservationsList}>
          {reservations.map((reservation) => {
            const payment = getPaymentForReservation(reservation.id)
            const totalCost = calculateTotalCost(reservation)
            const isProcessing = processingIds.has(reservation.id)

            return (
              <div key={reservation.id} className={styles.reservationCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.vehicleInfo}>
                    <Car size={24} />
                    <div>
                      <h3>
                        {reservation.vehicle.brand} {reservation.vehicle.model}
                      </h3>
                      <p className={styles.licensePlate}>
                        {reservation.vehicle.licensePlate}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`${styles.status} ${getStatusColor(
                      reservation.status
                    )}`}
                  >
                    {reservation.status}
                  </div>
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.timeInfo}>
                    <div className={styles.timeSlot}>
                      <Calendar size={16} />
                      <div>
                        <p className={styles.label}>Początek</p>
                        <p className={styles.value}>
                          {formatDate(reservation.startTime)}
                        </p>
                      </div>
                    </div>
                    <div className={styles.timeSlot}>
                      <Clock size={16} />
                      <div>
                        <p className={styles.label}>Koniec</p>
                        <p className={styles.value}>
                          {formatDate(reservation.endTime)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.priceInfo}>
                    <div className={styles.priceDetail}>
                      <span>Cena za godzinę:</span>
                      <span>{reservation.vehicle.pricePerHour} zł</span>
                    </div>
                    <div className={styles.priceDetail}>
                      <span>Łączny koszt:</span>
                      <span className={styles.totalPrice}>{totalCost} zł</span>
                    </div>
                  </div>

                  {reservation.vehicle.latitude &&
                    reservation.vehicle.longitude && (
                      <div className={styles.locationInfo}>
                        <MapPin size={16} />
                        <span>
                          Lokalizacja: {reservation.vehicle.latitude.toFixed(4)}
                          , {reservation.vehicle.longitude.toFixed(4)}
                        </span>
                      </div>
                    )}

                  {payment && (
                    <div className={styles.paymentInfo}>
                      <div className={styles.paymentHeader}>
                        <CreditCard size={16} />
                        <span>Płatność</span>
                      </div>
                      <div className={styles.paymentDetails}>
                        <div className={styles.paymentDetail}>
                          <span>Kwota:</span>
                          <span>{payment.amount} zł</span>
                        </div>
                        <div className={styles.paymentDetail}>
                          <span>Status:</span>
                          <span
                            className={`${
                              styles.paymentStatus
                            } ${getStatusColor(payment.status)}`}
                          >
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.cardActions}>
                  {reservation.status.toLowerCase() !== "cancelled" && (
                    <button
                      onClick={() => handleCancelReservation(reservation.id)}
                      disabled={isProcessing}
                      className={`${styles.button} ${styles.cancelButton}`}
                    >
                      {isProcessing ? "Anulowanie..." : "Anuluj rezerwację"}
                    </button>
                  )}

                  {!payment &&
                    reservation.status.toLowerCase() !== "cancelled" && (
                      <button
                        onClick={() => handleCreatePayment(reservation)}
                        disabled={isProcessing}
                        className={`${styles.button} ${styles.payButton}`}
                      >
                        {isProcessing ? "Tworzenie..." : "Utwórz płatność"}
                      </button>
                    )}

                  {payment && payment.status.toLowerCase() === "pending" && (
                    <button
                      onClick={() => handlePayPayment(payment.id)}
                      disabled={processingIds.has(payment.id)}
                      className={`${styles.button} ${styles.payButton}`}
                    >
                      {processingIds.has(payment.id) ? "Płacenie..." : "Zapłać"}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Reservations
