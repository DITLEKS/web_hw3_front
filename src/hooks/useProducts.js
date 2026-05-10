import { useState, useEffect, useCallback } from 'react'
import { catalogApi } from '../api/client'
import { PRODUCTS, CATEGORIES } from '../data/mock'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || !import.meta.env.VITE_CATALOG_API_URL

/**
 * Хук для получения списка товаров с фильтрацией по категории.
 * Автоматически переключается между mock-данными и реальным API.
 */
export function useProducts(categorySlug = null) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (USE_MOCK) {
        // Mock: фильтруем локально
        await new Promise(r => setTimeout(r, 0))
        const filtered = categorySlug
          ? PRODUCTS.filter(p => p.category.slug === categorySlug && p.status !== 'archived')
          : PRODUCTS.filter(p => p.status !== 'archived')
        setProducts(filtered)
      } else {
        const res = await catalogApi.getProducts({
          category: categorySlug || undefined,
          limit: 100,
        })
        setProducts(res.data)
      }
    } catch (e) {
      setError(e.message || 'Не удалось загрузить товары')
    } finally {
      setLoading(false)
    }
  }, [categorySlug])

  useEffect(() => { fetch() }, [fetch])

  return { products, loading, error, refetch: fetch }
}

/**
 * Хук для получения одного товара по SKU.
 */
export function useProduct(sku) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!sku) return
    let cancelled = false
    setLoading(true)
    setError(null)

    const load = async () => {
      try {
        if (USE_MOCK) {
          await new Promise(r => setTimeout(r, 0))
          const found = PRODUCTS.find(p => p.sku === sku) || null
          if (!cancelled) setProduct(found)
        } else {
          const res = await catalogApi.getProduct(sku)
          if (!cancelled) setProduct(res.data)
        }
      } catch (e) {
        if (!cancelled) setError(e.status === 404 ? null : e.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [sku])

  return { product, loading, error }
}

/**
 * Хук для получения списка категорий.
 */
export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        if (USE_MOCK) {
          setCategories(CATEGORIES)
        } else {
          const res = await catalogApi.getCategories()
          // Backend возвращает color_hex, в mock — color. Нормализуем.
          setCategories(res.data.map(c => ({ ...c, color: c.color_hex ?? c.color })))
        }
      } catch {
        setCategories(CATEGORIES) // фолбек
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { categories, loading }
}
