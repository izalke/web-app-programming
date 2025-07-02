import React, { useState, ChangeEvent, FormEvent } from "react"
import { registerUser } from "../../api"
import styles from "./RegisterForm.module.scss"

interface FormData {
  email: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  email?: string
  password?: string
  confirmPassword?: string
}

type MessageType = "success" | "error" | ""

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<MessageType>("")
  const [acceptTerms, setAcceptTerms] = useState(false)

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.email) {
      newErrors.email = "Email jest wymagany"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Wprowadź poprawny adres email"
    }

    if (!formData.password) {
      newErrors.password = "Hasło jest wymagane"
    } else if (formData.password.length < 6) {
      newErrors.password = "Hasło musi mieć co najmniej 6 znaków"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Potwierdzenie hasła jest wymagane"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Hasła nie są identyczne"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }

    if (message) {
      setMessage("")
      setMessageType("")
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) return

    if (!acceptTerms) {
      setMessage("Musisz zaakceptować regulamin, aby się zarejestrować")
      setMessageType("error")
      return
    }

    setIsLoading(true)
    setMessage("")
    setMessageType("")

    try {
      const response = await registerUser(formData.email, formData.password)
      setMessage("Konto zostało utworzone! Sprawdź email w celu aktywacji.")
      setMessageType("success")
      setFormData({ email: "", password: "", confirmPassword: "" })
      setAcceptTerms(false)
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Wystąpił błąd podczas rejestracji"
      setMessage(errorMessage)
      setMessageType("error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      
      <div className={styles.welcomeSection}>
        <div className={styles.welcomeContent}>
          <div className={styles.logo}></div>
          <h1 className={styles.welcomeTitle}>
            Twoja wolność
            <span className={styles.highlight}>na kółkach</span>
          </h1>
          <p className={styles.welcomeDescription}>
            Dołącz do tysięcy użytkowników, którzy już korzystają z naszego
            carsharing. Rezerwuj, jeździj, zwracaj - wszystko w jednej
            aplikacji.
          </p>
        </div>
      </div>

      <div className={styles.formSection}>
        <div className={styles.formWrapper}>
          <h2 className={styles.title}>Utwórz konto</h2>
          <p className={styles.subtitle}>
            Wypełnij dane, aby rozpocząć korzystanie z carsharing
          </p>

          {message && (
            <div className={`${styles.message} ${styles[messageType]}`}>
              {message}
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Adres email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="twoj@email.com"
                disabled={isLoading}
                className={`${styles.input} ${
                  errors.email ? styles.error : ""
                }`}
              />
              {errors.email && (
                <span className={styles.errorText}>{errors.email}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Hasło
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={isLoading}
                className={`${styles.input} ${
                  errors.password ? styles.error : ""
                }`}
              />
              {errors.password && (
                <span className={styles.errorText}>{errors.password}</span>
              )}
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Potwierdź hasło
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={isLoading}
                className={`${styles.input} ${
                  errors.confirmPassword ? styles.error : ""
                }`}
              />
              {errors.confirmPassword && (
                <span className={styles.errorText}>
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <div className={styles.checkboxGroup}>
              <div className={styles.checkboxWrapper}>
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className={styles.checkbox}
                />
                <label htmlFor="acceptTerms" className={styles.checkboxLabel}>
                  Akceptuję{" "}
                  <a href="#" className={styles.termsLink}>
                    regulamin
                  </a>{" "}
                  i{" "}
                  <a href="#" className={styles.termsLink}>
                    politykę prywatności
                  </a>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className={styles.button}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className={styles.loading}>
                  <span className={styles.spinner}></span>
                  Tworzenie konta...
                </span>
              ) : (
                "Utwórz konto"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterForm
