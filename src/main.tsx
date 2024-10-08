import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import routes from '../src/routes/router'
import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import '.././src/index.css'

import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; 
import { UserProvider } from './lib/UserContext'




ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <ToastContainer />
      

      <RouterProvider router={routes} />
    </UserProvider>
  </React.StrictMode>
)
