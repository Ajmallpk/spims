import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "@/App"
import "@/index.css"
import { SuspensionProvider } from "@/context/SuspensionContext";
ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <SuspensionProvider>
    <BrowserRouter>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
    </BrowserRouter>
  </SuspensionProvider>
  // </React.StrictMode>
)