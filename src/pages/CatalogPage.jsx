import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, fetchCategories, setQuery } from '../store/catalogSlice'
import { addItem, selectCartItems } from '../store/cartSlice'
import { PRODUCTS, CATEGORIES } from '../data/mock'
import styles from './CatalogPage.module.css'

const CAT_COLORS = {
  led: '#3B82F6', filament: '#F59E0B', smart: '#10B981',
  halogen: '#EF4444', grow: '#22C55E', uv: '#8B5CF6',
}

const SORT_OPTIONS = [
  { value: 'popular',   label: 'По популярности' },
  { value: 'price_asc', label: 'Цена ↑' },
  { value: 'price_desc',label: 'Цена ↓' },
  { value: 'name',      label: 'По названию' },
]

const ALL_SOCKETS = [...new Set(
  PRODUCTS.flatMap(p => p.attributes.filter(a => a.attr_key === 'socket').map(a => a.attr_value))
)].sort()

const MAX_WATT  = Math.max(...PRODUCTS.map(p => parseFloat(p.attributes.find(a => a.attr_key === 'wattage')?.attr_value || 0)))
const MAX_PRICE = Math.max(...PRODUCTS.map(p => parseFloat(p.price)))

function plural(n) {
  if (n % 100 >= 11 && n % 100 <= 19) return 'товаров'
  if (n % 10 === 1) return 'товар'
  if (n % 10 >= 2 && n % 10 <= 4) return 'товара'
  return 'товаров'
}

export default function CatalogPage() {
  const dispatch       = useDispatch()
  const reduxProducts  = useSelector(s => s.catalog.products)
  const reduxLoading   = useSelector(s => s.catalog.loading)
  const reduxQuery     = useSelector(s => s.catalog.query)
  const categories     = useSelector(s => s.catalog.categories.length ? s.catalog.categories : CATEGORIES)

  const [cats,       setCats]       = useState([])
  const [sockets,    setSockets]    = useState([])
  const [maxWatt,    setMaxWatt]    = useState(MAX_WATT)
  const [maxPrice,   setMaxPrice]   = useState(MAX_PRICE)
  const [inStock,    setInStock]    = useState(false)
  const [sort,       setSort]       = useState('popular')
  const [localQuery, setLocalQuery] = useState(reduxQuery)

  // Синхронизируем с поиском из Header
  useEffect(() => { setLocalQuery(reduxQuery) }, [reduxQuery])

  // Загрузка при изменении категории или поискового запроса
  useEffect(() => {
    dispatch(fetchCategories())
    dispatch(fetchProducts({ category: cats[0] || undefined, query: localQuery }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cats, localQuery])

  const toggle = (arr, setArr, v) =>
    setArr(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])

  const handleCategoryToggle = (slug) => {
    toggle(cats, setCats, slug)
    if (localQuery) { setLocalQuery(''); dispatch(setQuery('')) }
  }

  const handleClearSearch = () => { setLocalQuery(''); dispatch(setQuery('')) }

  const reset = () => {
    setCats([]); setSockets([]); setMaxWatt(MAX_WATT); setMaxPrice(MAX_PRICE)
    setInStock(false); setLocalQuery(''); dispatch(setQuery(''))
  }

  const filtered = useMemo(() => {
    let list = reduxProducts.filter(p => p.status !== 'archived')
    if (sockets.length) list = list.filter(p => {
      const s = p.attributes.find(a => a.attr_key === 'socket')
      return s && sockets.includes(s.attr_value)
    })
    list = list.filter(p => {
      const w = p.attributes.find(a => a.attr_key === 'wattage')
      return !w || parseFloat(w.attr_value) <= maxWatt
    })
    list = list.filter(p => parseFloat(p.price) <= maxPrice)
    if (inStock) list = list.filter(p => p.stock_quantity > 0)
    switch (sort) {
      case 'price_asc':  return [...list].sort((a,b) => parseFloat(a.price) - parseFloat(b.price))
      case 'price_desc': return [...list].sort((a,b) => parseFloat(b.price) - parseFloat(a.price))
      case 'name':       return [...list].sort((a,b) => a.name.localeCompare(b.name, 'ru'))
      default:           return list
    }
  }, [reduxProducts, sockets, maxWatt, maxPrice, inStock, sort])

  const activeCount = cats.length + sockets.length +
    (maxWatt < MAX_WATT ? 1 : 0) + (maxPrice < MAX_PRICE ? 1 : 0) +
    (inStock ? 1 : 0) + (localQuery ? 1 : 0)

  return (
    <main className={styles.page}>
      <div className="container">

        <nav className={styles.breadcrumb}>
          <Link to="/">Главная</Link><span>/</span><span>Каталог</span>
        </nav>

        <h1 className={styles.pageTitle}>Каталог ламп</h1>

        <div className={styles.layout}>

          <aside className={styles.sidebar}>
            <FilterSection title="Тип лампы">
              {categories.map(c => (
                <CheckRow key={c.slug} checked={cats.includes(c.slug)}
                  onChange={() => handleCategoryToggle(c.slug)}
                  label={c.name} dot={CAT_COLORS[c.slug] || c.color}/>
              ))}
            </FilterSection>

            <FilterSection title="Цоколь">
              {ALL_SOCKETS.map(s => (
                <CheckRow key={s} checked={sockets.includes(s)}
                  onChange={() => toggle(sockets, setSockets, s)} label={s}/>
              ))}
            </FilterSection>

            <FilterSection title="Мощность (Вт)">
              <input type="range" min={1} max={MAX_WATT} value={maxWatt}
                onChange={e => setMaxWatt(Number(e.target.value))} className={styles.range}/>
              <div className={styles.rangeLabels}><span>1 Вт</span><span>{maxWatt} Вт</span></div>
            </FilterSection>

            <FilterSection title="Цена (₽)">
              <input type="range" min={0} max={MAX_PRICE} value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))} className={styles.range}/>
              <div className={styles.rangeLabels}><span>0 ₽</span><span>{maxPrice} ₽</span></div>
            </FilterSection>

            <label className={`${styles.checkRow} ${styles.inStockRow}`}>
              <input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)}/>
              Только в наличии
            </label>

            {activeCount > 0 && (
              <button className={styles.resetBtn} onClick={reset}>Сбросить ({activeCount})</button>
            )}
          </aside>

          <div className={styles.content}>

            {/* Поисковая строка */}
            <div className={styles.searchRow}>
              <div className={styles.searchBox}>
                <svg className={styles.searchIcon} width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input className={styles.searchInput} type="search"
                  placeholder="Поиск по названию или артикулу..."
                  value={localQuery} onChange={e => setLocalQuery(e.target.value)}
                  aria-label="Поиск товаров"/>
                {localQuery && (
                  <button className={styles.searchClear} onClick={handleClearSearch} aria-label="Очистить">✕</button>
                )}
              </div>
            </div>

            <div className={styles.topBar}>
              <span className={styles.found}>
                {reduxLoading ? 'Загрузка...' : `Найдено: ${filtered.length} ${plural(filtered.length)}`}
              </span>
              <select className={`input ${styles.sortSelect}`} value={sort} onChange={e => setSort(e.target.value)}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {reduxLoading ? (
              <div className={styles.grid}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className={styles.skeletonCard}>
                    <div className={`${styles.skeletonImg} skeleton`}/>
                    <div style={{ padding: 16 }}>
                      <div className="skeleton" style={{ height: 12, width: '40%', marginBottom: 8, borderRadius: 4 }}/>
                      <div className="skeleton" style={{ height: 14, width: '80%', marginBottom: 16, borderRadius: 4 }}/>
                      <div className="skeleton" style={{ height: 20, width: '50%', borderRadius: 4 }}/>
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className={styles.empty}>
                <span>🔍</span>
                <p>Товаров не найдено</p>
                <button className="btn btn-outline" onClick={reset}>Сбросить фильтры</button>
              </div>
            ) : (
              <div className={styles.grid} aria-live="polite">
                {filtered.map((p, i) => <CatalogCard key={p.sku} product={p} animDelay={i * 40}/>)}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

function FilterSection({ title, children }) {
  const [open, setOpen] = useState(true)
  return (
    <div className={styles.filterSection}>
      <button className={styles.filterTitle} onClick={() => setOpen(o => !o)}>
        {title}
        <span className={`${styles.arrow} ${open ? styles.arrowOpen : ''}`}>▾</span>
      </button>
      {open && <div className={styles.filterBody}>{children}</div>}
    </div>
  )
}

function CheckRow({ checked, onChange, label, dot }) {
  return (
    <label className={styles.checkRow}>
      <input type="checkbox" checked={checked} onChange={onChange}/>
      {dot && <span className={styles.dot} style={{ background: dot }}/>}
      {label}
    </label>
  )
}

function CatalogCard({ product, animDelay }) {
  const dispatch  = useDispatch()
  const cartItems = useSelector(selectCartItems)
  const inCart    = cartItems.some(i => i.sku === product.sku)
  const price     = parseFloat(product.price)
  const oldPrice  = product.old_price ? parseFloat(product.old_price) : null
  const outOfStock = product.status === 'out_of_stock' || product.stock_quantity === 0
  const catColor   = CAT_COLORS[product.category.slug] || '#888'

  const handleAdd = (e) => {
    e.preventDefault(); e.stopPropagation()
    if (!outOfStock) dispatch(addItem({ product, qty: 1 }))
  }

  return (
    <Link to={`/products/${product.sku}`} className={styles.card} style={{ animationDelay: `${animDelay}ms` }}>
      <div className={styles.cardImg}>
        <img src={product.primary_image} alt={product.name} loading="lazy"/>
        <span className={styles.catBadge} style={{ background: catColor }}>{product.category.name}</span>
      </div>
      <div className={styles.cardBody}>
        <p className={styles.cardSku}>{product.sku}</p>
        <p className={styles.cardName}>{product.name}</p>
        <div className={styles.cardMeta}>
          <div>
            <strong className={styles.cardPrice}>{price} ₽</strong>
            {oldPrice && <s className={styles.cardOld}>{oldPrice} ₽</s>}
          </div>
          <span className={styles.cardStock} style={{ color: outOfStock ? '#EF4444' : '#10B981' }}>
            {outOfStock ? '0 в наличии' : `${product.stock_quantity} в наличии`}
          </span>
        </div>
        <button className={`${styles.addBtn} ${inCart ? styles.inCart : ''}`}
          onClick={handleAdd} disabled={outOfStock}>
          {inCart ? '✓ В корзине' : 'В корзину'}
        </button>
      </div>
    </Link>
  )
}
