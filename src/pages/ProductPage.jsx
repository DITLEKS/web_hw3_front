import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useProduct, useProducts } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import { ATTR_LABELS } from '../data/mock'
import styles from './ProductPage.module.css'

export default function ProductPage() {
  const { sku } = useParams()
  const navigate = useNavigate()
  const { items, addItem } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const { product, loading, error } = useProduct(sku)

  if (loading) {
    return (
      <main className={`container ${styles.loadingWrap}`}>
        <div className={styles.loadingPulse} />
      </main>
    )
  }

  if (error) {
    return (
      <main className={`container ${styles.notFound}`}>
        <h2>Ошибка загрузки</h2>
        <p>{error}</p>
        <Link to="/" className="btn btn-primary">← Вернуться в каталог</Link>
      </main>
    )
  }

  if (!product) {
    return (
      <main className={`container ${styles.notFound}`}>
        <h2>Товар не найден</h2>
        <p>Возможно, он был удалён или ссылка устарела.</p>
        <Link to="/" className="btn btn-primary">← Вернуться в каталог</Link>
      </main>
    )
  }

  const outOfStock = product.status === 'out_of_stock' || product.stock_quantity === 0
  const inCart = items.find(i => i.sku === product.sku)
  // price может быть строкой из API ("89.00") или числом из mock (89)
  const price    = parseFloat(product.price)
  const oldPrice = product.old_price ? parseFloat(product.old_price) : null

  const handleAdd = () => {
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <main className={styles.page}>
      <div className="container">

        {/* Хлебные крошки */}
        <nav className={`${styles.breadcrumb} anim-fade-in`} aria-label="Навигация">
          <Link to="/">Каталог</Link>
          <span aria-hidden>/</span>
          <span>{product.category.name}</span>
          <span aria-hidden>/</span>
          <span>{product.name}</span>
        </nav>

        {/* Основной блок */}
        <div className={styles.layout}>

          {/* Изображение */}
          <div className={`${styles.imageSection} anim-scale-in`}>
            <div className={styles.imageWrap}>
              <img
                src={product.primary_image ?? product.images?.[0]?.url}
                alt={product.name}
                className={styles.image}
              />
              {outOfStock && <div className={styles.outBadge}>Нет в наличии</div>}
              {oldPrice && !outOfStock && (
                <div className={styles.saleBadge}>
                  −{Math.round((1 - price / oldPrice) * 100)}%
                </div>
              )}
            </div>
            <div className={styles.sku}>Арт.: {product.sku}</div>
          </div>

          {/* Информация */}
          <div className={`${styles.info} anim-fade-up delay-1`}>
            <span className={styles.catLabel}>{product.category.name}</span>
            <h1 className={styles.name}>{product.name}</h1>

            {/* Цена */}
            <div className={styles.priceRow}>
              <span className={styles.price}>{price} ₽</span>
              {oldPrice && (
                <>
                  <span className={styles.oldPrice}>{oldPrice} ₽</span>
                  <span className={styles.discount}>
                    −{Math.round((1 - price / oldPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Описание */}
            <p className={styles.description}>{product.description}</p>

            {/* Атрибуты */}
            {product.attributes?.length > 0 && (
              <div className={styles.attrs}>
                {product.attributes.map(attr => (
                  <div key={attr.attr_key} className={styles.attrRow}>
                    <span className={styles.attrKey}>
                      {ATTR_LABELS[attr.attr_key] || attr.attr_key}
                    </span>
                    <span className={styles.attrDots} aria-hidden />
                    <span className={styles.attrVal}>
                      {attr.attr_value}{attr.unit ? ` ${attr.unit}` : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Количество + кнопка */}
            {!outOfStock ? (
              <div className={styles.actions}>
                <div className={styles.qtyControl}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    aria-label="Уменьшить количество"
                  >−</button>
                  <span className={styles.qtyVal}>{qty}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => setQty(q => Math.min(product.stock_quantity, q + 1))}
                    aria-label="Увеличить количество"
                  >+</button>
                </div>

                {inCart ? (
                  <button
                    className="btn btn-outline btn-lg"
                    onClick={() => navigate('/cart')}
                  >
                    ✓ В корзине — перейти
                  </button>
                ) : (
                  <button
                    className={`btn btn-primary btn-lg ${styles.addBtn} ${added ? styles.addedAnim : ''}`}
                    onClick={handleAdd}
                  >
                    {added ? '✓ Добавлено!' : 'В корзину'}
                  </button>
                )}
              </div>
            ) : (
              <div className={styles.outMsg}>
                <span>😔</span> Товара нет в наличии
              </div>
            )}

            {/* Остаток */}
            {!outOfStock && (
              <p className={styles.stock}>
                {product.stock_quantity > 20
                  ? 'Много в наличии'
                  : `Осталось: ${product.stock_quantity} шт.`}
              </p>
            )}
          </div>
        </div>

        {/* Похожие товары */}
        <RelatedProducts currentSku={sku} categorySlug={product.category.slug} />

      </div>
    </main>
  )
}

function RelatedProducts({ currentSku, categorySlug }) {
  const { products } = useProducts(categorySlug)
  const related = products.filter(p => p.sku !== currentSku).slice(0, 3)
  if (!related.length) return null

  return (
    <section className={styles.related}>
      <h2 className={styles.relatedTitle}>Похожие товары</h2>
      <div className={styles.relatedGrid}>
        {related.map(p => (
          <Link key={p.sku} to={`/products/${p.sku}`} className={styles.relatedCard}>
            <img src={p.primary_image} alt={p.name} />
            <div className={styles.relatedInfo}>
              <span>{p.name}</span>
              <strong>{parseFloat(p.price)} ₽</strong>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
