import { useState, useMemo } from 'react'
import { CATEGORIES, PRODUCTS } from '../data/mock'
import ProductCard from '../components/ProductCard'
import styles from './CatalogPage.module.css'

export default function CatalogPage() {
  const [activeCategory, setActiveCategory] = useState(null) // null = все

  const filtered = useMemo(() => {
    if (!activeCategory) return PRODUCTS.filter(p => p.status !== 'archived')
    return PRODUCTS.filter(
      p => p.category.slug === activeCategory && p.status !== 'archived'
    )
  }, [activeCategory])

  return (
    <main className={styles.page}>

      {/* Шапка каталога */}
      <section className={`container ${styles.hero}`}>
        <p className={`${styles.heroLabel} anim-fade-in`}>Интернет-магазин</p>
        <h1 className={`${styles.heroTitle} anim-fade-up delay-1`}>
          Лампы для<br/>любого пространства
        </h1>
        <p className={`${styles.heroSub} anim-fade-up delay-2`}>
          LED, филаментные, умные и галогенные лампы с доставкой по всей России
        </p>
      </section>

      {/* Фильтры по категориям */}
      <div className={`container ${styles.filterWrap}`}>
        <div className={styles.filters}>
          <button
            className={`${styles.filterBtn} ${!activeCategory ? styles.active : ''}`}
            onClick={() => setActiveCategory(null)}
          >
            Все товары
            <span className={styles.filterCount}>{PRODUCTS.length}</span>
          </button>

          {CATEGORIES.map(cat => {
            const count = PRODUCTS.filter(p => p.category.slug === cat.slug).length
            return (
              <button
                key={cat.slug}
                className={`${styles.filterBtn} ${activeCategory === cat.slug ? styles.active : ''}`}
                onClick={() => setActiveCategory(cat.slug)}
                style={{ '--cat-color': cat.color }}
              >
                <span
                  className={styles.filterDot}
                  style={{ background: cat.color }}
                />
                {cat.name}
                <span className={styles.filterCount}>{count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Описание категории */}
      {activeCategory && (
        <div className={`container ${styles.catDesc}`}>
          <p>{CATEGORIES.find(c => c.slug === activeCategory)?.description}</p>
        </div>
      )}

      {/* Сетка товаров */}
      <section className={`container ${styles.grid}`}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <span>🔍</span>
            <p>Товаров не найдено</p>
          </div>
        ) : (
          filtered.map((product, idx) => (
            <ProductCard
              key={product.sku}
              product={product}
              animDelay={idx * 50}
            />
          ))
        )}
      </section>

    </main>
  )
}
