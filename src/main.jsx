import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './index.css'
import { CartProvider } from './context/CartContext'
import Layout from './components/Layout/Layout'
import CatalogPage      from './pages/CatalogPage'
import ProductPage      from './pages/ProductPage'
import CartPage         from './pages/CartPage'
import CheckoutPage     from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index                  element={<CatalogPage />}      />
            <Route path="products/:sku"   element={<ProductPage />}      />
            <Route path="cart"            element={<CartPage />}         />
            <Route path="checkout"        element={<CheckoutPage />}     />
            <Route path="order-success"   element={<OrderSuccessPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  </StrictMode>
)
