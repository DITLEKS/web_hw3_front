import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { catalogApi } from '../api/client'
import { PRODUCTS, CATEGORIES } from '../data/mock'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || !import.meta.env.VITE_CATALOG_API_URL

export const fetchProducts = createAsyncThunk(
  'catalog/fetchProducts',
  async ({ category, query } = {}, { rejectWithValue }) => {
    try {
      if (USE_MOCK) {
        let list = PRODUCTS.filter(p => p.status !== 'archived')
        if (category) list = list.filter(p => p.category.slug === category)
        if (query && query.trim()) {
          const q = query.trim().toLowerCase()
          list = list.filter(p =>
            p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
          )
        }
        return list
      }
      const params = { limit: 100 }
      if (category) params.category = category
      const res = await catalogApi.getProducts(params)
      return Array.isArray(res.data) ? res.data : (res.data?.items ?? [])
    } catch (e) {
      return rejectWithValue(e.message || 'Ошибка загрузки товаров')
    }
  }
)

export const fetchProduct = createAsyncThunk(
  'catalog/fetchProduct',
  async (sku, { rejectWithValue }) => {
    try {
      if (USE_MOCK) {
        const found = PRODUCTS.find(p => p.sku === sku)
        if (!found) return rejectWithValue('Товар не найден')
        return found
      }
      const res = await catalogApi.getProduct(sku)
      return res.data
    } catch (e) {
      return rejectWithValue(e.message || 'Ошибка загрузки товара')
    }
  }
)

export const fetchCategories = createAsyncThunk(
  'catalog/fetchCategories',
  async () => {
    try {
      if (USE_MOCK) return CATEGORIES
      const res = await catalogApi.getCategories()
      return res.data.map(c => ({ ...c, color: c.color_hex ?? c.color }))
    } catch {
      return CATEGORIES
    }
  }
)

const catalogSlice = createSlice({
  name: 'catalog',
  initialState: {
    products: [],
    product: null,
    categories: [],
    loading: false,
    productLoading: false,
    error: null,
    query: '',
    activeCategory: null,
  },
  reducers: {
    setQuery(state, action) { state.query = action.payload },
    setActiveCategory(state, action) { state.activeCategory = action.payload; state.query = '' },
    clearProduct(state) { state.product = null },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending,   state => { state.loading = true; state.error = null })
      .addCase(fetchProducts.fulfilled, (state, { payload }) => { state.loading = false; state.products = payload })
      .addCase(fetchProducts.rejected,  (state, { payload }) => { state.loading = false; state.error = payload })
      .addCase(fetchProduct.pending,    state => { state.productLoading = true; state.error = null })
      .addCase(fetchProduct.fulfilled,  (state, { payload }) => { state.productLoading = false; state.product = payload })
      .addCase(fetchProduct.rejected,   (state, { payload }) => { state.productLoading = false; state.error = payload })
      .addCase(fetchCategories.fulfilled, (state, { payload }) => { state.categories = payload })
  },
})

export const { setQuery, setActiveCategory, clearProduct } = catalogSlice.actions
export default catalogSlice.reducer
