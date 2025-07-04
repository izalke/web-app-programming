import { useState, useEffect, JSX } from "react"
import { useLocation, Link } from "react-router-dom"
import { motion } from "framer-motion"
import styles from "./nav.module.scss"

import { FaLinkedin, FaFacebookSquare } from "react-icons/fa"
import logo from "../../../../assets/logo-vroom1.png"

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

  // Funkcja do płynnego przewijania do sekcji (tylko dla strony głównej)
  const scrollToSection = (id: string) => {
    // Sprawdź czy jesteśmy na stronie głównej
    if (pathname === "/") {
      const section = document.getElementById(id)
      if (section) {
        window.scrollTo({
          top: section.offsetTop - 80,
          behavior: "smooth",
        })
        setIsDrawerOpen(false)
      }
    }
  }

  // Funkcja do zamykania drawer po kliknięciu w link
  const handleLinkClick = () => {
    setIsDrawerOpen(false)
  }

  return (
    <nav className={styles.wrapper}>
      <div className={styles.bar}>
        <Link to="/">
          <img src={logo} alt="Company Logo" className={styles.logo} />
        </Link>
        <span className={styles.spacer} />
        <ul className={styles.links}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            {pathname === "/" ? (
              <a href="#about-us" onClick={() => scrollToSection("about-us")}>
                About
              </a>
            ) : (
              <Link to="/#about-us">About</Link>
            )}
          </li>
          <li>
            {pathname === "/" ? (
              <a
                href="#our-services"
                onClick={() => scrollToSection("our-services")}
              >
                Our Services
              </a>
            ) : (
              <Link to="/#our-services">Our Services</Link>
            )}
          </li>
          <li>
            {pathname === "/" ? (
              <a
                href="#why-choose-us"
                onClick={() => scrollToSection("why-choose-us")}
              >
                Why Us
              </a>
            ) : (
              <Link to="/#why-choose-us">Why Us</Link>
            )}
          </li>
          <li>
            {pathname === "/" ? (
              <a
                href="#client-testimonials"
                onClick={() => scrollToSection("client-testimonials")}
              >
                Testimonials
              </a>
            ) : (
              <Link to="/#client-testimonials">Testimonials</Link>
            )}
          </li>
          <li>
            {pathname === "/" ? (
              <a
                href="#contact-us"
                onClick={() => scrollToSection("contact-us")}
              >
                Contact
              </a>
            ) : (
              <Link to="/#contact-us">Contact</Link>
            )}
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
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
          <Link to="/" className={styles.mobileLink} onClick={handleLinkClick}>
            Home
          </Link>
          {pathname === "/" ? (
            <a
              className={styles.mobileLink}
              onClick={() => scrollToSection("about-us")}
            >
              About
            </a>
          ) : (
            <Link
              to="/#about-us"
              className={styles.mobileLink}
              onClick={handleLinkClick}
            >
              About
            </Link>
          )}
          {pathname === "/" ? (
            <a
              className={styles.mobileLink}
              onClick={() => scrollToSection("our-services")}
            >
              Our Services
            </a>
          ) : (
            <Link
              to="/#our-services"
              className={styles.mobileLink}
              onClick={handleLinkClick}
            >
              Our Services
            </Link>
          )}
          {pathname === "/" ? (
            <a
              className={styles.mobileLink}
              onClick={() => scrollToSection("why-choose-us")}
            >
              Why Us
            </a>
          ) : (
            <Link
              to="/#why-choose-us"
              className={styles.mobileLink}
              onClick={handleLinkClick}
            >
              Why Us
            </Link>
          )}
          {pathname === "/" ? (
            <a
              className={styles.mobileLink}
              onClick={() => scrollToSection("client-testimonials")}
            >
              Testimonials
            </a>
          ) : (
            <Link
              to="/#client-testimonials"
              className={styles.mobileLink}
              onClick={handleLinkClick}
            >
              Testimonials
            </Link>
          )}
          {pathname === "/" ? (
            <a
              className={styles.mobileLink}
              onClick={() => scrollToSection("contact-us")}
            >
              Contact
            </a>
          ) : (
            <Link
              to="/#contact-us"
              className={styles.mobileLink}
              onClick={handleLinkClick}
            >
              Contact
            </Link>
          )}
          <Link
            to="/register"
            className={styles.mobileLink}
            onClick={handleLinkClick}
          >
            Register
          </Link>
          <Link
            to="/login"
            className={styles.mobileLink}
            onClick={handleLinkClick}
          >
            Login
          </Link>
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
