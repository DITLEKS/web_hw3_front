import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ordersApi } from '../api/client'
import { PROMO_CODES } from '../data/mock'
import { getSessionId } from '../utils/session'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || !import.meta.env.VITE_ORDERS_API_URL

export const addToCartAsync = createAsyncThunk(
  'cart/addAsync',
  async ({ product, qty = 1 }, { rejectWithValue }) => {
    if (!USE_MOCK) {
      try { await ordersApi.addToCart(getSessionId(), product.sku, qty) }
      catch (e) { return rejectWithValue(e.message) }
    }
    return { product, qty }
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], promo: null, promoError: null },
  reducers: {
    addItem(state, { payload: { product, qty = 1 } }) {
      const existing = state.items.find(i => i.sku === product.sku)
      if (existing) { existing.quantity += qty }
      else {
        state.items.push({
          id: Date.now(), sku: product.sku, name: product.name,
          price: parseFloat(product.price), image: product.primary_image,
          quantity: qty, stock: product.stock_quantity,
        })
      }
    },
    updateItem(state, { payload: { sku, qty } }) {
      if (qty <= 0) { state.items = state.items.filter(i => i.sku !== sku) }
      else { const item = state.items.find(i => i.sku === sku); if (item) item.quantity = qty }
    },
    removeItem(state, { payload: sku }) { state.items = state.items.filter(i => i.sku !== sku) },
    applyPromo(state, { payload: code }) {
      const key = code.toUpperCase()
      const promo = PROMO_CODES[key]
      if (!promo) { state.promoError = 'Промокод не найден'; return }
      const subtotal = state.items.reduce((s, i) => s + i.price * i.quantity, 0)
      if (subtotal < promo.min) { state.promoError = `Промокод действует при заказе от ${promo.min} ₽`; return }
      state.promo = { code: key, ...promo }; state.promoError = null
    },
    removePromo(state) { state.promo = null; state.promoError = null },
    clearCart(state) { state.items = []; state.promo = null; state.promoError = null },
  },
  extraReducers: builder => {
    builder.addCase(addToCartAsync.fulfilled, (state, { payload }) => {
      if (!payload) return
      const { product, qty } = payload
      const existing = state.items.find(i => i.sku === product.sku)
      if (existing) { existing.quantity += qty }
      else {
        state.items.push({
          id: Date.now(), sku: product.sku, name: product.name,
          price: parseFloat(product.price), image: product.primary_image,
          quantity: qty, stock: product.stock_quantity,
        })
      }
    })
  },
})

export const { addItem, updateItem, removeItem, applyPromo, removePromo, clearCart } = cartSlice.actions

export const selectCartItems  = s => s.cart.items
export const selectPromo      = s => s.cart.promo
export const selectPromoError = s => s.cart.promoError
export const selectItemCount  = s => s.cart.items.reduce((n, i) => n + i.quantity, 0)
export const selectSubtotal   = s => s.cart.items.reduce((n, i) => n + i.price * i.quantity, 0)
export const selectDiscount   = s => {
  const promo = s.cart.promo
  const sub = selectSubtotal(s)
  if (!promo) return 0
  if (promo.type === 'percent') return Math.round(sub * promo.value / 100)
  return Math.min(promo.value, sub)
}

export default cartSlice.reducer
