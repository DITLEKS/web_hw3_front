// Базовые URL берём из env, с фолбеком на прокси vite
const CATALOG_BASE = import.meta.env.VITE_CATALOG_API_URL
  ? `${import.meta.env.VITE_CATALOG_API_URL}/api/v1`
  : '/catalog/api/v1'

const ORDERS_BASE = import.meta.env.VITE_ORDERS_API_URL
  ? `${import.meta.env.VITE_ORDERS_API_URL}/api/v1`
  : '/orders/api/v1'

async function request(baseUrl, path, options = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Неизвестная ошибка' }))
    throw Object.assign(new Error(err.message || 'API error'), { status: res.status, data: err })
  }
  return res.json()
}

// ── Catalog API ──────────────────────────────────────────────────── //

export const catalogApi = {
  /**
   * GET /api/v1/products?page=&limit=&category=&status=
   * @returns {Promise<{data: ProductListItem[], meta: ProductListMeta}>}
   */
  getProducts({ page = 1, limit = 20, category, status } = {}) {
    const params = new URLSearchParams({ page, limit })
    if (category) params.set('category', category)
    if (status)   params.set('status', status)
    return request(CATALOG_BASE, `/products?${params}`)
  },

  /**
   * GET /api/v1/products/:sku
   * @returns {Promise<{data: ProductDetail}>}
   */
  getProduct(sku) {
    return request(CATALOG_BASE, `/products/${encodeURIComponent(sku)}`)
  },

  /**
   * GET /api/v1/categories
   * @returns {Promise<{data: CategoryOut[]}>}
   */
  getCategories() {
    return request(CATALOG_BASE, '/categories')
  },
}

// ── Orders / Cart API ────────────────────────────────────────────── //

export const ordersApi = {
  /**
   * GET /api/v1/cart
   * @param {string} sessionId
   * @returns {Promise<{data: CartOut}>}
   */
  getCart(sessionId) {
    return request(ORDERS_BASE, '/cart', {
      headers: sessionId ? { 'X-Session-Id': sessionId } : {},
    })
  },

  /**
   * POST /api/v1/cart/items  { sku, quantity }
   * @returns {Promise<{data: CartItemAddedData, message: string}>}
   */
  addToCart(sessionId, sku, quantity = 1) {
    return request(ORDERS_BASE, '/cart/items', {
      method: 'POST',
      headers: sessionId ? { 'X-Session-Id': sessionId } : {},
      body: JSON.stringify({ sku, quantity }),
    })
  },

  /**
   * PATCH /api/v1/cart/items/:itemId  { quantity }
   * @returns {Promise<{data: CartItemUpdatedData, message: string}>}
   */
  updateCartItem(sessionId, itemId, quantity) {
    return request(ORDERS_BASE, `/cart/items/${itemId}`, {
      method: 'PATCH',
      headers: sessionId ? { 'X-Session-Id': sessionId } : {},
      body: JSON.stringify({ quantity }),
    })
  },

  /**
   * DELETE /api/v1/cart/items/:itemId
   */
  removeCartItem(sessionId, itemId) {
    return request(ORDERS_BASE, `/cart/items/${itemId}`, {
      method: 'DELETE',
      headers: sessionId ? { 'X-Session-Id': sessionId } : {},
    })
  },

  /**
   * POST /api/v1/orders
   * Body: CreateOrderRequest
   * @returns {Promise<{data: OrderCreatedData, message: string}>}
   */
  createOrder(sessionId, payload) {
    return request(ORDERS_BASE, '/orders', {
      method: 'POST',
      headers: sessionId ? { 'X-Session-Id': sessionId } : {},
      body: JSON.stringify(payload),
    })
  },
}
