import React from "react"
import { Car, ArrowLeft, Home, MapPin } from "lucide-react"
import styles from "./NotFound.module.scss"

const NotFound: React.FC = () => {
  const handleGoBack = (): void => {
    window.history.back()
  }

  const handleGoHome = (): void => {
    // W rzeczywistej aplikacji użyłbyś react-router
    window.location.href = "/"
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Animated Car Icon */}
        <div className={styles.iconWrapper}>
          <div className={styles.carIcon}>
            <Car className={styles.carSvg} />
          </div>
          <div className={styles.errorBadge}>
            <span className={styles.errorBadgeText}>!</span>
          </div>
        </div>

        {/* Error Message */}
        <div className={styles.messageSection}>
          <h1 className={styles.errorCode}>404</h1>
          <h2 className={styles.errorTitle}>Ops! Zabłądziłeś</h2>
          <p className={styles.errorDescription}>
            Strona, której szukasz, nie istnieje lub została przeniesiona. Może
            warto sprawdzić dostępne pojazdy w Twojej okolicy?
          </p>
        </div>

        {/* Action Buttons */}
        <div className={styles.buttonSection}>
          <button
            onClick={handleGoHome}
            className={`${styles.button} ${styles.primaryButton}`}
          >
            <Home className={styles.buttonIcon} />
            Strona główna
          </button>

          <button
            onClick={handleGoBack}
            className={`${styles.button} ${styles.secondaryButton}`}
          >
            <ArrowLeft className={styles.buttonIcon} />
            Wróć
          </button>
        </div>

        {/* Additional Info */}
        <div className={styles.infoCard}>
          <div className={styles.infoHeader}>
            <MapPin className={styles.infoIcon} />
            <span className={styles.infoTitle}>Szukasz pojazdu?</span>
          </div>
          <p className={styles.infoDescription}>
            Sprawdź dostępne auta w aplikacji mobilnej lub na mapie na stronie
            głównej
          </p>
          <div className={styles.statsContainer}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>24/7</span>
              <p className={styles.statLabel}>Dostępność</p>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>500+</span>
              <p className={styles.statLabel}>Pojazdów</p>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className={`${styles.floatingElement} ${styles.float1}`}></div>
        <div className={`${styles.floatingElement} ${styles.float2}`}></div>
        <div className={`${styles.floatingElement} ${styles.float3}`}></div>
      </div>
    </div>
  )
}

export default NotFound
