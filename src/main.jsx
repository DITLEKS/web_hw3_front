import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'

import './index.css'
import ScrollToTop      from './components/ScrollToTop'
import Layout           from './components/Layout/Layout'
import HomePage         from './pages/HomePage'
import CatalogPage      from './pages/CatalogPage'
import ProductPage      from './pages/ProductPage'
import CartPage         from './pages/CartPage'
import CheckoutPage     from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import OrdersPage       from './pages/OrdersPage'
import NotFoundPage     from './pages/NotFoundPage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index                element={<HomePage />}         />
            <Route path="catalog"       element={<CatalogPage />}      />
            <Route path="products/:sku" element={<ProductPage />}      />
            <Route path="cart"          element={<CartPage />}         />
            <Route path="checkout"      element={<CheckoutPage />}     />
            <Route path="order-success" element={<OrderSuccessPage />} />
            <Route path="orders"        element={<OrdersPage />}       />
            <Route path="*"             element={<NotFoundPage />}     />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
)
