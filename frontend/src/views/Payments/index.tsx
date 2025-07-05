import React, { useState, useEffect } from "react"
import { fetchPayments, payPayment, Payment } from "../../api"
import {
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Car,
  Calendar,
  DollarSign,
  ArrowLeft,
} from "lucide-react"

const styles = {
  paymentsContainer: "payments-container",
  header: "header",
  title: "title",
  subtitle: "subtitle",
  backButton: "back-button",
  paymentsList: "payments-list",
  paymentCard: "payment-card",
  paymentCardPending: "payment-card--pending",
  paymentCardPaid: "payment-card--paid",
  paymentCardCancelled: "payment-card--cancelled",
  paymentHeader: "payment-header",
  paymentStatus: "payment-status",
  statusPending: "status--pending",
  statusPaid: "status--paid",
  statusCancelled: "status--cancelled",
  paymentAmount: "payment-amount",
  paymentDetails: "payment-details",
  detailItem: "detail-item",
  detailLabel: "detail-label",
  detailValue: "detail-value",
  vehicleInfo: "vehicle-info",
  reservationInfo: "reservation-info",
  paymentActions: "payment-actions",
  payButton: "pay-button",
  payButtonDisabled: "pay-button--disabled",
  emptyState: "empty-state",
  emptyStateIcon: "empty-state-icon",
  emptyStateText: "empty-state-text",
  loadingState: "loading-state",
  errorState: "error-state",
}

interface PaymentsProps {
  token: string
  onNavigateBack?: () => void // Dodany opcjonalny prop
}

const Payments: React.FC<PaymentsProps> = ({ token, onNavigateBack }) => {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [payingIds, setPayingIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    loadPayments()
  }, [token])

  const loadPayments = async () => {
    try {
      setLoading(true)
      setError(null)
      const paymentsData = await fetchPayments(token)
      setPayments(paymentsData)
    } catch (err) {
      setError("Nie udało się załadować płatności")
      console.error("Error loading payments:", err)
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async (paymentId: number) => {
    try {
      setPayingIds((prev) => new Set([...prev, paymentId]))
      await payPayment(paymentId, token)
      await loadPayments() // Odświeżenie listy
    } catch (err) {
      setError("Nie udało się zrealizować płatności")
      console.error("Error processing payment:", err)
    } finally {
      setPayingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(paymentId)
        return newSet
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return <CheckCircle className="w-5 h-5" />
      case "cancelled":
        return <XCircle className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "Zapłacono"
      case "cancelled":
        return "Anulowano"
      case "pending":
        return "Oczekuje"
      default:
        return status
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
    }).format(amount)
  }

  if (loading) {
    return (
      <div className={`${styles.paymentsContainer} ${styles.loadingState}`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${styles.paymentsContainer} ${styles.errorState}`}>
        <div className="text-center text-red-600 p-8">
          <XCircle className="w-16 h-16 mx-auto mb-4" />
          <p className="text-lg">{error}</p>
          <button
            onClick={loadPayments}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.paymentsContainer}>
      <div className={styles.header}>
        {onNavigateBack && (
          <button onClick={onNavigateBack} className={styles.backButton}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            Powrót do pojazdów
          </button>
        )}
        <h1 className={styles.title}>
          <CreditCard className="w-8 h-8 mr-3" />
          Płatności
        </h1>
        <p className={styles.subtitle}>
          Zarządzaj swoimi płatnościami za wypożyczenia pojazdów
        </p>
      </div>

      {payments.length === 0 ? (
        <div className={styles.emptyState}>
          <CreditCard className={`${styles.emptyStateIcon} w-16 h-16`} />
          <p className={styles.emptyStateText}>
            Brak płatności do wyświetlenia
          </p>
        </div>
      ) : (
        <div className={styles.paymentsList}>
          {payments.map((payment) => (
            <div
              key={payment.id}
              className={`${styles.paymentCard} ${
                payment.status.toLowerCase() === "paid"
                  ? styles.paymentCardPaid
                  : payment.status.toLowerCase() === "cancelled"
                  ? styles.paymentCardCancelled
                  : styles.paymentCardPending
              }`}
            >
              <div className={styles.paymentHeader}>
                <div
                  className={`${styles.paymentStatus} ${
                    payment.status.toLowerCase() === "paid"
                      ? styles.statusPaid
                      : payment.status.toLowerCase() === "cancelled"
                      ? styles.statusCancelled
                      : styles.statusPending
                  }`}
                >
                  {getStatusIcon(payment.status)}
                  <span>{getStatusText(payment.status)}</span>
                </div>
                <div className={styles.paymentAmount}>
                  <DollarSign className="w-5 h-5 mr-1" />
                  {formatAmount(payment.amount)}
                </div>
              </div>

              <div className={styles.paymentDetails}>
                <div className={styles.vehicleInfo}>
                  <div className={styles.detailItem}>
                    <Car className="w-4 h-4 mr-2" />
                    <span className={styles.detailLabel}>Pojazd:</span>
                    <span className={styles.detailValue}>
                      {payment.reservation.vehicle.brand}{" "}
                      {payment.reservation.vehicle.model}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Rejestracja:</span>
                    <span className={styles.detailValue}>
                      {payment.reservation.vehicle.licensePlate}
                    </span>
                  </div>
                </div>

                <div className={styles.reservationInfo}>
                  <div className={styles.detailItem}>
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className={styles.detailLabel}>Początek:</span>
                    <span className={styles.detailValue}>
                      {formatDate(payment.reservation.startTime)}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Koniec:</span>
                    <span className={styles.detailValue}>
                      {formatDate(payment.reservation.endTime)}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>
                      Status rezerwacji:
                    </span>
                    <span className={styles.detailValue}>
                      {payment.reservation.status}
                    </span>
                  </div>
                </div>
              </div>

              {payment.status.toLowerCase() === "pending" && (
                <div className={styles.paymentActions}>
                  <button
                    onClick={() => handlePayment(payment.id)}
                    disabled={payingIds.has(payment.id)}
                    className={`${styles.payButton} ${
                      payingIds.has(payment.id) ? styles.payButtonDisabled : ""
                    }`}
                  >
                    {payingIds.has(payment.id) ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Przetwarzanie...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Zapłać teraz
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Payments
