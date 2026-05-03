import { createContext, useContext, useReducer, useCallback } from 'react'
import { PROMO_CODES } from '../data/mock'

const CartContext = createContext(null)

// Редьюсер  
function cartReducer(state, action) {
  switch (action.type) {

    case 'ADD': {
      const existing = state.items.find(i => i.sku === action.product.sku)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.sku === action.product.sku
              ? { ...i, quantity: i.quantity + action.qty }
              : i
          ),
        }
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            id:       Date.now(),
            sku:      action.product.sku,
            name:     action.product.name,
            // price может прийти как строка из бекенда ("89.00") или число из mock (89)
            price:    parseFloat(action.product.price),
            image:    action.product.primary_image,
            quantity: action.qty,
            stock:    action.product.stock_quantity,
          },
        ],
      }
    }

    case 'UPDATE': {
      if (action.qty <= 0) {
        return { ...state, items: state.items.filter(i => i.sku !== action.sku) }
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.sku === action.sku ? { ...i, quantity: action.qty } : i
        ),
      }
    }

    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.sku !== action.sku) }

    case 'APPLY_PROMO': {
      const code = action.code.toUpperCase()
      const promo = PROMO_CODES[code]
      if (!promo) return { ...state, promoError: 'Промокод не найден' }

      const subtotal = state.items.reduce((s, i) => s + i.price * i.quantity, 0)
      if (subtotal < promo.min) {
        return {
          ...state,
          promoError: `Промокод действует при заказе от ${promo.min} ₽`,
        }
      }
      return { ...state, promo: { code, ...promo }, promoError: null }
    }

    case 'REMOVE_PROMO':
      return { ...state, promo: null, promoError: null }

    case 'CLEAR':
      return { ...initialState }

    default:
      return state
  }
}

const initialState = { items: [], promo: null, promoError: null }

// Провайдер

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const itemCount = state.items.reduce((s, i) => s + i.quantity, 0)
  const subtotal  = state.items.reduce((s, i) => s + i.price * i.quantity, 0)

  const discount = (() => {
    if (!state.promo) return 0
    if (state.promo.type === 'percent') return Math.round(subtotal * state.promo.value / 100)
    return Math.min(state.promo.value, subtotal)
  })()

  const addItem    = useCallback((product, qty = 1) => dispatch({ type: 'ADD',          product, qty }), [])
  const updateItem = useCallback((sku, qty)          => dispatch({ type: 'UPDATE',       sku, qty }),    [])
  const removeItem = useCallback((sku)               => dispatch({ type: 'REMOVE',       sku }),         [])
  const applyPromo = useCallback((code)              => dispatch({ type: 'APPLY_PROMO',  code }),        [])
  const removePromo= useCallback(()                  => dispatch({ type: 'REMOVE_PROMO' }),              [])
  const clearCart  = useCallback(()                  => dispatch({ type: 'CLEAR' }),                     [])

  return (
    <CartContext.Provider value={{
      items:      state.items,
      promo:      state.promo,
      promoError: state.promoError,
      itemCount,
      subtotal,
      discount,
      addItem,
      updateItem,
      removeItem,
      applyPromo,
      removePromo,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
