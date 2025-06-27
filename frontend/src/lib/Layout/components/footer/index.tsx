import React from "react"
import styles from "./footer.module.scss"

import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from "react-icons/fa"

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.contactInfo}>
          <h2>Contact Us</h2>
          <div className={styles.infoItem}>
            <FaMapMarkerAlt />
            <span>
              ul. Zamkowa 15A Lok. 4 Kraków, <br />
              30-301
            </span>
          </div>
          <div className={styles.infoItem}>
            <FaPhoneAlt />
            <span>+48 503 825 810</span>
          </div>
          <div className={styles.infoItem}>
            <FaEnvelope />
            <a href="mailto:info@weovernight.com">vroom@carsharing.com</a>
          </div>
          <div className={styles.infoItem}>
            <FaClock />
            <span>Poniedziałek - Piątek: 6:00 - 17:00</span>
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.about}>
            Szybkość, niezawodność i wygoda – oferujemy coś więcej niż tylko
            samochody, oferujemy swobodę podróżowania. Wybierz nasz car sharing
            i ciesz się mobilnością wtedy, gdy jej potrzebujesz.
          </div>
          <div className={styles.socialMedia}>
            <a
              href="https://www.facebook.com/profile.php?id=61575436269528"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>

      <div className={styles.copyright}>
        &copy; {new Date().getFullYear()} Vroom. Wszelkie prawa zastrzeżone.
      </div>
    </footer>
  )
}

export default Footer
