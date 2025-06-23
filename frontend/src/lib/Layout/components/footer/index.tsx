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
              368 Bluff City Blvd Suite 100 Unit D Elgin, <br />
              IL 60120
            </span>
          </div>
          <div className={styles.infoItem}>
            <FaPhoneAlt />
            <span>+1 (630) 206-0995</span>
          </div>
          <div className={styles.infoItem}>
            <FaEnvelope />
            <a href="mailto:info@weovernight.com">info@weovernight.com</a>
          </div>
          <div className={styles.infoItem}>
            <FaClock />
            <span>Mon - Fri: 6:00 AM - 5:00 PM</span>
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.about}>
            Speed, reliability, and dedication – we deliver more than just
            cargo, we deliver trust. Choose us for seamless logistics, because
            your business deserves the best.
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
        &copy; {new Date().getFullYear()} Overnight Trucking INC. All rights
        reserved.
      </div>
    </footer>
  )
}

export default Footer
