import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./App.scss"
import Layout from "./lib/Layout"

// views
import Home from "./views/Home"
import Register from "./views/Register"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    // errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
