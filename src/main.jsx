import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { FirebaseContextProvider } from './context/FirebaseContext.jsx'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <FirebaseContextProvider>
        <App />
        <ToastContainer/>
    </FirebaseContextProvider>
    </BrowserRouter> 
  </StrictMode>,
)
