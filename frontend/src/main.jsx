import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import App from "@/App"
import "@/index.css"
import { SuspensionProvider } from "@/context/SuspensionContext";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SuspensionProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      </SuspensionProvider>
  </React.StrictMode>
)