import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./App.scss"
import Layout from "./lib/Layout"
import { AuthProvider } from "./contexts/authContext"

// views
import Home from "./views/Home"
import Register from "./views/Register"
import Login from "./views/Login"
import VehiclesComponent from "./views/Vehicles"
import Payments from "./views/Payments"
import NotFound from "./views/NotFound"
import Reservation from "./views/Reservation"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/vehicles",
        element: <VehiclesComponent />,
      },
      {
        path: "/payments",
        element: <Payments token={""} />,
      },
      {
        path: "/reservation",
        element: <Reservation token={""} />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
)
