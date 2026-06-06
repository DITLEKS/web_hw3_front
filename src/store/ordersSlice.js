import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { ordersApi } from '../api/client'
import { PAYMENT_OPTIONS } from '../data/mock'
import { getSessionId } from '../utils/session'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || !import.meta.env.VITE_ORDERS_API_URL

// ── Thunks ──────────────────────────────────────────────────────── //

export const fetchOrders = createAsyncThunk(
  'orders/fetchAll',
  async (_, { rejectWithValue }) => {
    if (USE_MOCK) return []
    try {
      const email = localStorage.getItem('slx_customer_email')
      if (!email) return []
      const sessionId = getSessionId()
      const res = await ordersApi.getOrders(sessionId, email)
      return res.data?.data ?? res.data ?? res ?? []
    } catch (e) {
      return rejectWithValue(e.message)
    }
  }
)

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchByNumber',
  async (orderNumber, { rejectWithValue }) => {
    if (USE_MOCK) return null
    try {
      const email = localStorage.getItem('slx_customer_email')
      const res = await ordersApi.getOrder(orderNumber, getSessionId(), email)
      const data = res.data ?? res
      return data
    } catch (e) {
      return rejectWithValue(e.message)
    }
  }
)

export const fetchOrderDetails = createAsyncThunk(
  'orders/fetchDetails',
  async (orderNumber, { rejectWithValue }) => {
    if (USE_MOCK) return null
    try {
      const email = localStorage.getItem('slx_customer_email')
      const sessionId = getSessionId()
      const res = await ordersApi.getOrder(orderNumber, sessionId, email)
      const data = res.data ?? res
      return data
    } catch (e) {
      return rejectWithValue(e.message)
    }
  }
)

export const createOrder = createAsyncThunk(
  'orders/create',
  async ({ form, delivery, total, promo }, { rejectWithValue, getState }) => {
    try {
      let orderData
      if (USE_MOCK) {
        await new Promise(r => setTimeout(r, 1200))
        const ts = Date.now().toString(36).toUpperCase().slice(-4)
        orderData = {
          order_number: `LX-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${ts}`,
          total_amount: String(total),
          status: 'processing',
          created_at: new Date().toISOString(),
          delivery_type: form.delivery_type,
          payment_method: form.payment_method,
        }
      } else {
        // Перед созданием заказа синхронизируем корзину из Redux с корзиной на backend
        try {
          const state = getState()
          const { selectCartItems } = await import('./cartSlice')
          const localItems = selectCartItems(state)
          const sessionId = getSessionId()
          const server = await ordersApi.getCart(sessionId)
          const serverCart = server.data ?? server
          const serverItems = serverCart.items ?? []
          const serverBySku = new Map(serverItems.map(i => [i.sku, i]))
          const localBySku  = new Map(localItems.map(i => [i.sku, i]))

          // Удаляем лишние позиции на сервере
          for (const s of serverItems) {
            if (!localBySku.has(s.sku)) {
              await ordersApi.removeCartItem(sessionId, s.item_id)
            }
          }

          // Добавляем/обновляем позиции из локальной корзины
          for (const item of localItems) {
            const existing = serverBySku.get(item.sku)
            if (!existing) {
              await ordersApi.addToCart(sessionId, item.sku, item.quantity)
            } else if (existing.quantity !== item.quantity) {
              await ordersApi.updateCartItem(sessionId, existing.item_id, item.quantity)
            }
          }
        } catch (e) {
          return rejectWithValue('Не удалось синхронизировать корзину с сервером')
        }

        const payload = {
          // Данные покупателя (обязательные поля бэкенда)
          first_name:      form.first_name,
          last_name:       form.last_name,
          email:           form.email,
          phone:           form.phone || undefined,
          // Доставка
          delivery_type:   form.delivery_type,
          delivery_city:   form.delivery_type !== 'pickup' ? form.city    : undefined,
          delivery_street: form.delivery_type !== 'pickup' ? form.street  : undefined,
          delivery_zip:    form.zip   || undefined,
          // Оплата
          payment_method:  form.payment_method,
          promo_code:      promo?.code || undefined,
        }
        const res = await ordersApi.createOrder(getSessionId(), payload)
        orderData = res.data ?? res
        // Запрашиваем детали только что созданного заказа для получения позиций
        try {
          const detail = await ordersApi.getOrder(orderData.order_number, getSessionId(), form.email)
          const detailData = detail.data ?? detail
          orderData = { ...orderData, items: detailData.items ?? detailData.order_items ?? detailData.products ?? [] }
        } catch { /* не критично — используем orderData без items */ }
      }
      return {
        raw: orderData,
        // нормализованные поля для ConfirmPage
        orderNumber: orderData.order_number,
        total:       parseFloat(orderData.total_amount) || total,
        delivery:    delivery.label,
        payment:     PAYMENT_OPTIONS.find(p => p.value === form.payment_method)?.label,
        email:       form.email,
      }
    } catch (e) {
      return rejectWithValue(e.message || 'Не удалось оформить заказ')
    }
  }
)

// ── Slice ────────────────────────────────────────────────────────── //

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    list:      [],          // история заказов с API
    lastOrder: null,        // последний оформленный (для ConfirmPage)
    loading:   false,
    listLoading: false,
    error:     null,
  },
  reducers: {
    clearLastOrder(state) { state.lastOrder = null; state.error = null },
  },
  extraReducers: builder => {
    // createOrder
    builder
      .addCase(createOrder.pending,   state => { state.loading = true; state.error = null })
      .addCase(createOrder.fulfilled, (state, { payload }) => {
        state.loading = false
        state.lastOrder = payload
        if (payload.raw) {
          state.list = [payload.raw, ...state.list]
        }
        try {
          if (payload.orderNumber) {
            localStorage.setItem('lastOrderNumber', payload.orderNumber)
          }
          if (payload.email) {
            localStorage.setItem('slx_customer_email', payload.email)
          }
        } catch (e) {
          // ignore storage errors
        }
      })
      .addCase(createOrder.rejected,  (state, { payload }) => {
        state.loading = false; state.error = payload
      })

    // fetchOrders
    builder
      .addCase(fetchOrders.pending,   state => { state.listLoading = true })
      .addCase(fetchOrders.fulfilled, (state, { payload }) => {
        state.listLoading = false
        state.list = payload
      })
      .addCase(fetchOrders.rejected,  state => { state.listLoading = false })

    // fetchOrderByNumber
    builder
      .addCase(fetchOrderByNumber.pending, state => { state.listLoading = true })
      .addCase(fetchOrderByNumber.fulfilled, (state, { payload }) => {
        state.listLoading = false
        if (!payload) return
        const idx = state.list.findIndex(o => o.order_number === payload.order_number)
        if (idx === -1) {
          state.list = [payload, ...state.list]
        } else {
          state.list[idx] = { ...state.list[idx], ...payload }
        }
      })
      .addCase(fetchOrderByNumber.rejected, state => { state.listLoading = false })

    // fetchOrderDetails
    builder
      .addCase(fetchOrderDetails.pending, state => { state.listLoading = true })
      .addCase(fetchOrderDetails.fulfilled, (state, { payload }) => {
        state.listLoading = false
        if (!payload) return
        const detail = payload.data ?? payload
        const idx = state.list.findIndex(order => order.order_number === detail.order_number)
        if (idx !== -1) {
          state.list[idx] = {
            ...state.list[idx],
            ...detail,
            items: detail.items ?? detail.order_items ?? detail.products ?? state.list[idx].items ?? [],
          }
        }
      })
      .addCase(fetchOrderDetails.rejected, state => { state.listLoading = false })
  },
})

export const { clearLastOrder }    = ordersSlice.actions
export const selectLastOrder       = s => s.orders.lastOrder
export const selectOrderLoading    = s => s.orders.loading
export const selectOrderError      = s => s.orders.error
export const selectOrders          = s => s.orders.list
export const selectOrdersLoading   = s => s.orders.listLoading
export default ordersSlice.reducer
