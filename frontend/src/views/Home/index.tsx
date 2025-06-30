import React from "react"
import { motion } from "framer-motion"
import styles from "./home.module.scss"
import {
  FaShippingFast,
  FaTruckMoving,
  FaHeadset,
  FaMapMarkerAlt,
  FaHandshake,
  FaRoute,
  FaShieldAlt,
  FaWarehouse,
  FaRegClock,
  FaWrench,
} from "react-icons/fa"

//images
import background from "../../assets/img/chevrolet.jpg"
import truck1 from "../../assets/img/hundai.jpg"
import truck2 from "../../assets/img/chevrolet.jpg"

const imageContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.5 } },
}

const serviceItemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
}

const customerOptionVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 1 } },
}

const mapVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1 } },
}

const headerVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } },
}

const servicesContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const services = [
  {
    icon: <FaShippingFast />,
    title: "Dostępność 24/7",
    subtitle: "Samochody dostępne zawsze i wszędzie",
  },
  {
    icon: <FaTruckMoving />,
    title: "Elastyczne wynajmy",
    subtitle: "Na minuty, godziny lub dni – Ty decydujesz",
  },
  {
    icon: <FaHeadset />,
    title: "Wsparcie Klienta",
    subtitle: "Zawsze gotowi, by Ci pomóc",
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Lokalizacje w całym mieście",
    subtitle: "Odbieraj i zostawiaj auta tam, gdzie Ci wygodnie",
  },
  {
    icon: <FaHandshake />,
    title: "Bez zobowiązań",
    subtitle: "Bez umów, bez papierologii",
  },
  {
    icon: <FaRoute />,
    title: "Nawigacja i wsparcie w trasie",
    subtitle: "Zintegrowane systemy wspomagania podróży",
  },
  {
    icon: <FaShieldAlt />,
    title: "Pełne ubezpieczenie",
    subtitle: "Jazda bez stresu i ryzyka",
  },
  {
    icon: <FaWarehouse />,
    title: "Różnorodna flota",
    subtitle: "Elektryczne, kompaktowe, SUV-y – wybierz swój styl",
  },
  {
    icon: <FaRegClock />,
    title: "Zawsze na czas",
    subtitle: "Mobilność dopasowana do Twojego harmonogramu",
  },
  {
    icon: <FaWrench />,
    title: "Regularny serwis",
    subtitle: "Bezpieczna i czysta flota każdego dnia",
  },
]

const testimonials = [
  {
    text: "Korzystam z Vroom codziennie do pracy i nigdy mnie nie zawiedli. Szybki dostęp do auta, brak formalności i konkurencyjne ceny.",
    author: "MARTA ZIELIŃSKA",
    position: "Specjalistka ds. HR",
    company: "TechPark Solutions",
  },
  {
    text: "Vroom to idealne rozwiązanie dla osób, które nie chcą posiadać auta, ale cenią sobie niezależność. Świetna aplikacja i niezawodna obsługa!",
    author: "ADAM NOWAK",
    position: "Freelancer",
    company: "Self-employed",
  },
  {
    text: "Flota Vroom jest zawsze czysta, a ceny transparentne. Wreszcie poruszanie się po mieście stało się wygodne i elastyczne.",
    author: "KATARZYNA LEWANDOWSKA",
    position: "Marketing Manager",
    company: "Urban Media Group",
  },
]

const features = [
  {
    number: "01.",
    title: "Inteligentna mobilność na wyciągnięcie ręki",
    description:
      "Nasza aplikacja umożliwia błyskawiczne rezerwacje i dostęp do pojazdów w całym mieście. To mobilność nowej generacji – bez kluczyków, bez stresu.",
    image: truck1,
  },
  {
    number: "02.",
    title: "Flota gotowa na każdą okazję",
    description:
      "Od miejskich hatchbacków po rodzinne SUV-y – wybierz samochód idealnie dopasowany do Twoich planów. Nasze pojazdy są nowoczesne, czyste i zawsze sprawne.",
    image: truck2,
  },
]

const Home: React.FC = () => {
  return (
    <>
      {/* Header Section */}
      <motion.div
        className={styles.header}
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${background})`,
        }}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 1 } },
        }}
      >
        <div className={styles.textBox}>
          <motion.div
            id="home"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1, transition: { duration: 1 } },
            }}
            className={styles.headerContent}
          >
            <h1>
              Nowa jakość <br /> miejskiej mobilności
              <span className={styles.dot}>.</span>
            </h1>
            <p>
              {" "}
              Vroom to firma technologiczna oferująca innowacyjne rozwiązania
              car sharingowe. Łączymy wygodę, elastyczność i ekologię, by
              ułatwić codzienne poruszanie się po mieście. Dzięki doświadczeniu
              i pasji naszego zespołu rozwijamy flotę i funkcje aplikacji,
              zapewniając maksymalny komfort oraz bezpieczeństwo użytkowania.{" "}
            </p>
            <div className={styles.buttons}>
              <button
                className={styles.primaryButton}
                onClick={() =>
                  document
                    .getElementById("about-us")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                ABOUT →
              </button>

              <button
                className={styles.secondaryButton}
                onClick={() =>
                  document
                    .getElementById("contact-us")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                CONTACT
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Services Icon Section */}
      <section id="our-services" className={styles.servicesSection}>
        <h2 className={styles.heading}>
          Fast and Reliable Delivery Services That Meet Your Timeline
        </h2>
        <p className={styles.description}>
          We offer services that align with your business needs. Our efficiency
          and expertise ensure timely deliveries and smooth operations in
          multiple languages.
        </p>
        <motion.div
          className={styles.services}
          initial="hidden"
          animate="visible"
          variants={servicesContainerVariants}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              className={styles.serviceItem}
              variants={serviceItemVariants}
            >
              <div className={styles.icon}>{service.icon}</div>
              <h3 className={styles.serviceTitle}>{service.title}</h3>
              <p className={styles.serviceSubtitle}>{service.subtitle}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section id="about-us" className={styles.fleetSection}>
        <div className={styles.textContainer}>
          <div className={styles.textBlock}>
            <h2>Your City, Your Ride!</h2>
            <p>
              Vroom to nowoczesna i dynamicznie rozwijająca się platforma car
              sharingowa, oferująca szybki i bezproblemowy dostęp do samochodów
              w największych miastach. Działamy z myślą o mieszkańcach, którzy
              cenią sobie elastyczność, wygodę oraz odpowiedzialność
              ekologiczną.
            </p>
            <p>
              Naszą misją jest uproszczenie miejskiej mobilności – umożliwiamy
              korzystanie z auta dokładnie wtedy, gdy go potrzebujesz, bez
              kosztów i obowiązków związanych z jego posiadaniem.
            </p>
          </div>
          <div className={styles.textBlock}>
            <p>
              Wierzymy, że przyszłość transportu to współdzielenie. Dzięki
              intuicyjnej aplikacji, nowoczesnej flocie i przejrzystym warunkom,
              Vroom zapewnia wygodną alternatywę dla komunikacji publicznej i
              prywatnych pojazdów.
            </p>
            <p>
              Każde auto Vroom jest regularnie serwisowane, ubezpieczone i
              dostępne 24/7 – gotowe do jazdy, kiedy tylko tego potrzebujesz.
              Wsiadasz, jedziesz, zostawiasz – resztą zajmujemy się my.
            </p>
          </div>
        </div>
      </section>

      {/* About Info Section */}

      <section className={styles.infoSection}>
        <div className={styles.content}>
          <div className={styles.left}>
            <h4 className={styles.subtitle}>Kilka słów o nas</h4>
            <h2 className={styles.title}>
              Każdy użytkownik to dla nas indywidualna historia.
              <br />
              Oferujemy rozwiązania dopasowane do Twoich potrzeb.
            </h2>
            <div className={styles.underline}></div>
          </div>
          <div className={styles.right}>
            <p>
              Vroom to nowoczesna firma technologiczna działająca w obszarze car
              sharingu. Choć jesteśmy stosunkowo młodą marką, wyróżnia nas
              innowacyjne podejście, nacisk na jakość obsługi oraz dbałość o
              każdy szczegół podróży użytkownika.
            </p>
            <p>
              Nasza oferta skierowana jest do wszystkich, którzy cenią sobie
              wolność podróżowania bez konieczności posiadania własnego auta.
              Dzięki naszej aplikacji, elastycznym modelom wynajmu oraz
              regularnie serwisowanej flocie, zapewniamy pełną kontrolę nad
              Twoją mobilnością – bez zbędnych formalności.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}

      <section id="why-choose-us" className={styles.featureSection}>
        {features.map((feature, index) => (
          <div key={index} className={styles.feature}>
            <div className={styles.textContent}>
              <div className={styles.number}>{feature.number}</div>
              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
            </div>
            <div className={styles.imageContainer}>
              <img src={feature.image} alt={feature.title} />
            </div>
          </div>
        ))}
      </section>

      {/* Testimonials Section */}
      <section id="client-testimonials" className={styles.testimonials}>
        <h2 className={styles.title}>Our Clients Opinions</h2>
        <div className={styles.testimonialContainer}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className={styles.testimonialCard}>
              <p className={styles.text}>{testimonial.text}</p>
              <div className={styles.author}>
                <strong>{testimonial.author}</strong>, {testimonial.position}
              </div>
              <div className={styles.company}>{testimonial.company}</div>
              <div className={styles.quoteIcon}>❝❞</div>
            </div>
          ))}
        </div>
      </section>
      <section id="contact-us"></section>
    </>
  )
}

export default Home
