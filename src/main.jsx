import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { FirebaseContextProvider } from './context/FirebaseContext.jsx'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { store } from './app/store.js'
import {Provider} from "react-redux"
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <FirebaseContextProvider>
        <Provider store={store}>
        <App />
        </Provider>
        <ToastContainer/>
    </FirebaseContextProvider>
    </BrowserRouter> 
  </StrictMode>,
)
