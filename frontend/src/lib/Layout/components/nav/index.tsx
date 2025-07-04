import { useState, useEffect, JSX } from "react"
import { useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import styles from "./nav.module.scss"

import { FaLinkedin, FaFacebookSquare } from "react-icons/fa"
// import logo from "../../../../assets/img/logo/small-logo.png"

const Nav = (): JSX.Element => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const toggleDrawer = (): void => {
    setIsDrawerOpen((prev) => !prev)
  }
  const { pathname } = useLocation()
  useEffect(() => {
    if (window.innerWidth <= 1024) {
      setIsDrawerOpen(false)
    }
  }, [pathname])

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isDrawerOpen])

  // Zamykaj menu po zmianie rozmiaru ekranu
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsDrawerOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Funkcja do płynnego przewijania do sekcji
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id)
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth",
      })
      setIsDrawerOpen(false)
    }
  }

  return (
    <nav className={styles.wrapper}>
      <div className={styles.bar}>
        <a href="#home">
          {/* <img src={logo} alt="Company Logo" className={styles.logo} /> */}
        </a>
        <span className={styles.spacer} />
        <ul className={styles.links}>
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#about-us">About</a>
          </li>
          <li>
            <a href="#our-services">Our Services</a>
          </li>
          <li>
            <a href="#why-choose-us">Why Us</a>
          </li>
          <li>
            <a href="#client-testimonials">Testimonials</a>
          </li>
          <li>
            <a href="#contact-us">Contact</a>
          </li>
        </ul>
        <div
          className={`${styles.burgerMenu} ${
            isDrawerOpen && styles.burgerMenuActive
          }`}
          onClick={toggleDrawer}
        >
          <span />
          <span />
          <span />
        </div>
      </div>
      <motion.div
        className={styles.drawer}
        initial={{ x: "100%", y: "-100%" }}
        animate={{
          x: isDrawerOpen ? 0 : "100%",
          y: isDrawerOpen ? 0 : "-100%",
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: isDrawerOpen ? 1 : 0, x: isDrawerOpen ? 0 : -20 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <a
            className={styles.mobileLink}
            onClick={() => scrollToSection("hero")}
          >
            Home
          </a>
          <a
            className={styles.mobileLink}
            onClick={() => scrollToSection("about-us")}
          >
            About
          </a>
          <a
            className={styles.mobileLink}
            onClick={() => scrollToSection("our-services")}
          >
            Our Services
          </a>
          <a
            className={styles.mobileLink}
            onClick={() => scrollToSection("why-choose-us")}
          >
            Why Us
          </a>
          <a
            className={styles.mobileLink}
            onClick={() => scrollToSection("client-testimonials")}
          >
            Testimonials
          </a>
          <a
            className={styles.mobileLink}
            onClick={() => scrollToSection("contact-us")}
          >
            Contact
          </a>
        </motion.div>

        <div className={styles.spacer} />

        {/* Ikony Social Media */}
        <motion.div
          className={styles.socialWrapper}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: isDrawerOpen ? 1 : 0, x: isDrawerOpen ? 0 : -20 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <a
            href="https://www.facebook.com"
            className={styles.socialLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookSquare />
          </a>
          <a
            href="https://www.linkedin.com/"
            className={styles.socialLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin />
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        className={isDrawerOpen ? styles.mobileOverlay : ""}
        initial={{ opacity: 0 }}
        animate={{ opacity: isDrawerOpen ? 0.15 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </nav>
  )
}

export default Nav
