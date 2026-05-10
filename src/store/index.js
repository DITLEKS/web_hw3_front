import { configureStore } from '@reduxjs/toolkit'
import catalogReducer from './catalogSlice'
import cartReducer    from './cartSlice'
import ordersReducer  from './ordersSlice'

export const store = configureStore({
  reducer: {
    catalog: catalogReducer,
    cart:    cartReducer,
    orders:  ordersReducer,
  },
})
