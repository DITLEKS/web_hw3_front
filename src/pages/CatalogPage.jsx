import { useState } from 'react'
import { useProducts, useCategories } from '../hooks/useProducts'
import { PRODUCTS } from '../data/mock'
import ProductCard from '../components/ProductCard'
import styles from './CatalogPage.module.css'

export default function CatalogPage() {
  const [activeCategory, setActiveCategory] = useState(null)
  const { categories } = useCategories()
  const { products, loading, error } = useProducts(activeCategory)

  return (
    <main className={styles.page}>

      {/* Шапка каталога */}
      <section className={`container ${styles.hero}`}>
        <p className={`${styles.heroLabel} anim-fade-in`}>Интернет-магазин</p>
        <h1 className={`${styles.heroTitle} anim-fade-up delay-1`}>
          Лампы для<br />любого пространства
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

          {categories.map(cat => {
            const count = PRODUCTS.filter(p => p.category.slug === cat.slug).length
            return (
              <button
                key={cat.slug}
                className={`${styles.filterBtn} ${activeCategory === cat.slug ? styles.active : ''}`}
                onClick={() => setActiveCategory(cat.slug)}
                style={{ '--cat-color': cat.color }}
              >
                <span className={styles.filterDot} style={{ background: cat.color }} />
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
          <p>{categories.find(c => c.slug === activeCategory)?.description}</p>
        </div>
      )}

      {/* Сетка товаров */}
      <section className={`container ${styles.grid}`} aria-live="polite">
        {loading && (
          <div className={styles.skeleton}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={styles.skeletonCard} />
            ))}
          </div>
        )}

        {error && (
          <div className={styles.empty}>
            <span>⚠️</span>
            <p>Не удалось загрузить товары: {error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className={styles.empty}>
            <span>🔍</span>
            <p>Товаров не найдено</p>
          </div>
        )}

        {!loading && !error && products.map((product, idx) => (
          <ProductCard
            key={product.sku}
            product={product}
            animDelay={idx * 50}
          />
        ))}
      </section>

    </main>
  )
}
