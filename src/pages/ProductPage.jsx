import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProduct, fetchProducts, clearProduct } from '../store/catalogSlice'
import { addItem, selectCartItems } from '../store/cartSlice'
import { ATTR_LABELS } from '../data/mock'
import styles from './ProductPage.module.css'

export default function ProductPage() {
  const { sku }  = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const product      = useSelector(s => s.catalog.product)
  const loading      = useSelector(s => s.catalog.productLoading)
  const error        = useSelector(s => s.catalog.error)
  const cartItems    = useSelector(selectCartItems)

  const [qty,       setQty]       = useState(1)
  const [added,     setAdded]     = useState(false)
  const [activeImg, setActiveImg] = useState(0)
  const [descOpen,  setDescOpen]  = useState(false)

  useEffect(() => {
    dispatch(fetchProduct(sku))
    return () => dispatch(clearProduct())
  }, [sku, dispatch])

  if (loading) return (
    <main className={`container ${styles.loadingWrap}`}>
      <div className={styles.loadingPulse}/>
    </main>
  )

  if (error || !product) return (
    <main className={`container ${styles.notFound}`}>
      <h2>{error ? 'Ошибка загрузки' : 'Товар не найден'}</h2>
      <p>{error || 'Возможно, он был удалён или ссылка устарела.'}</p>
      <Link to="/" className="btn btn-primary">← Вернуться в каталог</Link>
    </main>
  )

  const outOfStock = product.status === 'out_of_stock' || product.stock_quantity === 0
  const inCart     = cartItems.find(i => i.sku === product.sku)
  const price      = parseFloat(product.price)
  const oldPrice   = product.old_price ? parseFloat(product.old_price) : null
  const images     = product.images?.length
    ? product.images
    : [{ id: 0, url: product.primary_image, alt_text: product.name }]

  const handleAdd = () => {
    dispatch(addItem({ product, qty }))
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <main className={styles.page}>
      <div className="container">

        <nav className={`${styles.breadcrumb} anim-fade-in`} aria-label="Навигация">
          <Link to="/">Главная</Link><span>/</span>
          <Link to="/catalog">Каталог</Link><span>/</span>
          <span>{product.category.name}</span><span>/</span>
          <span>{product.name}</span>
        </nav>

        <div className={styles.layout}>

          <div className={`${styles.gallery} anim-scale-in`}>
            <div className={styles.mainImg}>
              <img src={images[activeImg]?.url ?? product.primary_image}
                alt={images[activeImg]?.alt_text ?? product.name}/>
              {outOfStock && <div className={styles.outBadge}>Нет в наличии</div>}
              {oldPrice && !outOfStock && (
                <div className={styles.saleBadge}>−{Math.round((1 - price / oldPrice) * 100)}%</div>
              )}
            </div>
            {images.length > 1 && (
              <div className={styles.thumbs}>
                {images.map((img, i) => (
                  <button key={img.id} className={`${styles.thumb} ${i === activeImg ? styles.thumbActive : ''}`}
                    onClick={() => setActiveImg(i)} aria-label={`Фото ${i + 1}`}>
                    <img src={img.url} alt={img.alt_text || product.name}/>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={`${styles.info} anim-fade-up delay-1`}>
            <div className={styles.topMeta}>
              <span className={styles.skuText}>Артикул: {product.sku}</span>
              {!outOfStock && <span className={styles.inStock}>в наличии</span>}
            </div>

            <h1 className={styles.name}>{product.name}</h1>

            <div className={styles.priceRow}>
              <span className={styles.price}>{price} ₽</span>
              {oldPrice && (
                <>
                  <span className={styles.oldPrice}>{oldPrice} ₽</span>
                  <span className={styles.discount}>−{Math.round((1 - price / oldPrice) * 100)}%</span>
                </>
              )}
            </div>

            {product.attributes?.length > 0 && (
              <div className={styles.attrsBlock}>
                <p className={styles.attrsTitle}>Характеристики</p>
                <div className={styles.attrsGrid}>
                  {product.attributes.map(a => (
                    <div key={a.attr_key} className={styles.attrCell}>
                      <span className={styles.attrKey}>{ATTR_LABELS[a.attr_key] || a.attr_key}</span>
                      <span className={styles.attrVal}>{a.attr_value}{a.unit ? ` ${a.unit}` : ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!outOfStock ? (
              <div className={styles.actions}>
                <div className={styles.qtyCtrl}>
                  <button className={styles.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span className={styles.qtyVal}>{qty}</span>
                  <button className={styles.qtyBtn} onClick={() => setQty(q => Math.min(product.stock_quantity, q + 1))}>+</button>
                </div>
                {inCart ? (
                  <button className="btn btn-outline btn-lg" onClick={() => navigate('/cart')}>
                    ✓ В корзине — перейти
                  </button>
                ) : (
                  <button className={`btn btn-primary btn-lg ${styles.addBtn} ${added ? styles.addedAnim : ''}`}
                    onClick={handleAdd} style={{ flex: 1 }}>
                    {added ? '✓ Добавлено!' : 'Добавить в корзину'}
                  </button>
                )}
              </div>
            ) : (
              <div className={styles.outMsg}>😔 Товара нет в наличии</div>
            )}

            <div className={styles.accordion}>
              <button className={styles.accordionBtn} onClick={() => setDescOpen(o => !o)} aria-expanded={descOpen}>
                <span>Описание</span>
                <svg className={`${styles.accordionArrow} ${descOpen ? styles.accordionOpen : ''}`}
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="18 15 12 9 6 15"/>
                </svg>
              </button>
              {descOpen && <div className={styles.accordionBody}><p>{product.description}</p></div>}
            </div>
          </div>
        </div>

        <RelatedProducts currentSku={sku} categorySlug={product.category.slug}/>
      </div>
    </main>
  )
}

function RelatedProducts({ currentSku, categorySlug }) {
  const dispatch = useDispatch()
  const products = useSelector(s => s.catalog.products)

  useEffect(() => {
    dispatch(fetchProducts({ category: categorySlug }))
  }, [categorySlug, dispatch])

  const related = products.filter(p => p.sku !== currentSku).slice(0, 3)
  if (!related.length) return null

  return (
    <section className={styles.related}>
      <h2 className={styles.relatedTitle}>Похожие товары</h2>
      <div className={styles.relatedGrid}>
        {related.map(p => (
          <Link key={p.sku} to={`/products/${p.sku}`} className={styles.relatedCard}>
            <img src={p.primary_image} alt={p.name}/>
            <div className={styles.relatedInfo}>
              <span className={styles.relatedSku}>{p.sku}</span>
              <span className={styles.relatedName}>{p.name}</span>
              <strong>{parseFloat(p.price)} ₽</strong>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
