import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ordersApi } from '../api/client'
import { DELIVERY_OPTIONS, PAYMENT_OPTIONS } from '../data/mock'
import { getSessionId } from '../utils/session'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || !import.meta.env.VITE_ORDERS_API_URL

export const createOrder = createAsyncThunk(
  'orders/create',
  async ({ form, delivery, total, promo }, { rejectWithValue }) => {
    try {
      let orderNumber, orderTotal
      if (USE_MOCK) {
        await new Promise(r => setTimeout(r, 1200))
        const ts = Date.now().toString(36).toUpperCase().slice(-4)
        orderNumber = `LX-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${ts}`
        orderTotal = total
      } else {
        const payload = {
          delivery_type:   form.delivery_type,
          delivery_city:   form.delivery_type !== 'pickup' ? form.city : undefined,
          delivery_street: form.delivery_type !== 'pickup' ? form.street : undefined,
          delivery_zip:    form.zip || undefined,
          payment_method:  form.payment_method,
          promo_code:      promo?.code || undefined,
        }
        const res = await ordersApi.createOrder(getSessionId(), payload)
        orderNumber = res.data.order_number
        orderTotal  = parseFloat(res.data.total_amount)
      }
      return {
        orderNumber, total: orderTotal,
        delivery: delivery.label,
        payment:  PAYMENT_OPTIONS.find(p => p.value === form.payment_method)?.label,
        email:    form.email,
      }
    } catch (e) {
      return rejectWithValue(e.message || 'Не удалось оформить заказ')
    }
  }
)

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { lastOrder: null, loading: false, error: null },
  reducers: {
    clearLastOrder(state) { state.lastOrder = null; state.error = null },
  },
  extraReducers: builder => {
    builder
      .addCase(createOrder.pending,   state => { state.loading = true; state.error = null })
      .addCase(createOrder.fulfilled, (state, { payload }) => { state.loading = false; state.lastOrder = payload })
      .addCase(createOrder.rejected,  (state, { payload }) => { state.loading = false; state.error = payload })
  },
})

export const { clearLastOrder } = ordersSlice.actions
export const selectLastOrder    = s => s.orders.lastOrder
export const selectOrderLoading = s => s.orders.loading
export const selectOrderError   = s => s.orders.error
export default ordersSlice.reducer
