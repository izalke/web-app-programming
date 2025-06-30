import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./App.scss"
import Layout from "./lib/Layout"

// views
import Home from "./views/Home"

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
    ],
  },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
