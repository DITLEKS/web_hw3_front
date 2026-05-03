import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { PRODUCTS, ATTR_LABELS } from '../data/mock'
import { useCart } from '../context/CartContext'
import styles from './ProductPage.module.css'

export default function ProductPage() {
  const { sku } = useParams()
  const navigate = useNavigate()
  const { items, addItem } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const product = PRODUCTS.find(p => p.sku === sku)

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

  const handleAdd = () => {
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const related = PRODUCTS.filter(
    p => p.category.slug === product.category.slug && p.sku !== product.sku
  ).slice(0, 3)

  return (
    <main className={styles.page}>
      <div className="container">

        {/* Хлебные крошки */}
        <nav className={`${styles.breadcrumb} anim-fade-in`}>
          <Link to="/">Каталог</Link>
          <span>/</span>
          <span>{product.category.name}</span>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        {/* Основной блок */}
        <div className={styles.layout}>

          {/* Изображение */}
          <div className={`${styles.imageSection} anim-scale-in`}>
            <div className={styles.imageWrap}>
              <img src={product.primary_image} alt={product.name} className={styles.image} />
              {outOfStock && <div className={styles.outBadge}>Нет в наличии</div>}
              {product.old_price && !outOfStock && (
                <div className={styles.saleBadge}>Скидка</div>
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
              <span className={styles.price}>{product.price} ₽</span>
              {product.old_price && (
                <>
                  <span className={styles.oldPrice}>{product.old_price} ₽</span>
                  <span className={styles.discount}>
                    −{Math.round((1 - product.price / product.old_price) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Описание */}
            <p className={styles.description}>{product.description}</p>

            {/* Атрибуты */}
            {product.attributes.length > 0 && (
              <div className={styles.attrs}>
                {product.attributes.map(attr => (
                  <div key={attr.attr_key} className={styles.attrRow}>
                    <span className={styles.attrKey}>
                      {ATTR_LABELS[attr.attr_key] || attr.attr_key}
                    </span>
                    <span className={styles.attrDots} aria-hidden />
                    <span className={styles.attrVal}>
                      {attr.attr_value}{attr.unit ? ' ' + attr.unit : ''}
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
                    aria-label="Уменьшить"
                  >−</button>
                  <span className={styles.qtyVal}>{qty}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => setQty(q => Math.min(product.stock_quantity, q + 1))}
                    aria-label="Увеличить"
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
        {related.length > 0 && (
          <section className={styles.related}>
            <h2 className={styles.relatedTitle}>Похожие товары</h2>
            <div className={styles.relatedGrid}>
              {related.map(p => (
                <Link key={p.sku} to={`/products/${p.sku}`} className={styles.relatedCard}>
                  <img src={p.primary_image} alt={p.name} />
                  <div className={styles.relatedInfo}>
                    <span>{p.name}</span>
                    <strong>{p.price} ₽</strong>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  )
}
