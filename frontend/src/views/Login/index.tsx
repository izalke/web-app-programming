import React, { useState, ChangeEvent, FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { loginUser } from "../../api"
import styles from "./registerForm.module.scss"

type MessageType = "success" | "error" | ""

interface LoginFormData {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
}

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<MessageType>("")
  const navigate = useNavigate()

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    if (!formData.email) newErrors.email = "Email jest wymagany"
    if (!formData.password) newErrors.password = "Hasło jest wymagane"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
    setMessage("")
    setMessageType("")
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    setMessage("")
    setMessageType("")

    try {
      const response = await loginUser(formData.email, formData.password)
      setMessage("Zalogowano pomyślnie!")
      setMessageType("success")

      // Zapisz token do localStorage
      localStorage.setItem("authToken", response.token)

      // Przekieruj do strony z pojazdami po krótkim delay
      setTimeout(() => {
        navigate("/vehicles")
      }, 1000)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Wystąpił błąd logowania"
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
            Witamy z powrotem!
            <span className={styles.highlight}>Zaloguj się</span>
          </h1>
          <p className={styles.welcomeDescription}>
            Wpisz swoje dane, aby uzyskać dostęp do panelu i korzystać z
            carsharing.
          </p>
        </div>
      </div>

      <div className={styles.formSection}>
        <div className={styles.formWrapper}>
          <h2 className={styles.title}>Logowanie</h2>
          <p className={styles.subtitle}>
            Wprowadź dane, aby się zalogować do swojego konta.
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

            <button
              type="submit"
              className={styles.button}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className={styles.loading}>
                  <span className={styles.spinner}></span>
                  Logowanie...
                </span>
              ) : (
                "Zaloguj się"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
