import { Outlet, ScrollRestoration } from "react-router-dom"
import styles from "./layout.module.scss"
import Nav from "./components/nav"
import Footer from "./components/footer"
import React from "react"
import { motion, useScroll } from "framer-motion"

const Layout: React.FC = () => {
  const { scrollYProgress } = useScroll()

  return (
    <div className={styles.wrapper}>
      <motion.div
        className={styles.progressBar}
        style={{ scaleX: scrollYProgress }}
      />
      <Nav />
      <main>
        <Outlet />
      </main>
      <ScrollRestoration />
      <Footer />
    </div>
  )
}

export default Layout
